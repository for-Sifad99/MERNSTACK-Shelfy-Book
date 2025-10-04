const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

const app = express();
const port = process.env.PORT || 3000;

// Middleware:
app.use(cors());
app.use(express.json());

// Verify Admin
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Verify Firebase Token
const verifyFbToken = async (req, res, next) => {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ message: 'Unauthorized access!!' })
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
    } catch (error) {
        return res.status(401).send({ message: 'Unauthorized access!!' })
    };
};

// Check if decoded email exists
const verifyTokenEmail = async (req, res, next) => {
    if (!req.decoded?.email) {
        return res.status(403).send({ message: 'Forbidden access!' });
    };
    next();
}

// Home route:
app.get('/', (req, res) => {
    res.send('<h1>This is cool a 📖book collection!</h1>');
});

// URI:
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q1etiuc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // Create BooksCollection:
        const booksCollection = client.db('books-library').collection('books');
        const borrowedBooksCollection = client.db('books-library').collection('BorrowedBooksInfo');

        // Get all books with optional category + pagination
        app.get('/allBooks', async (req, res) => {
            try {
                const category = req.query.category;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 5;

                // Query Setup
                const query = {};
                if (category) {
                    query.category = category;
                };

                const skip = (page - 1) * limit;
                const totalBooks = await booksCollection.countDocuments(query);
                const totalPages = Math.ceil(totalBooks / limit);

                const books = await booksCollection
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .toArray();

                res.send({
                    books,
                    totalBooks,
                    totalPages,
                    currentPage: page
                });

            } catch (err) {
                res.status(500).send({ message: "Server error" });
            };
        });

        // Get a single book by Id
        app.get('/allBooks/:id', async (req, res) => {
            const id = req.params.id;

            try {
                const book = await booksCollection.findOne({ _id: new ObjectId(id) });
                res.send(book);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch book' });
            };
        });

        // Get top 10 rating books by sorting
        app.get('/topRatingBooks', async (req, res) => {
            const books = await booksCollection
                .find()
                .sort({ rating: -1 })
                .limit(10)
                .toArray();

            res.send(books);
        });

        // Insert book by Post
        app.post('/addBooks', verifyFbToken, verifyTokenEmail, async (req, res) => {
            const book = req.body;

            const newBook = await booksCollection.insertOne(book);
            res.send(newBook);
        });

        // Ge all borrowed books info
        app.get('/borrowedBooksInfo', async (req, res) => {
            try {
                const borrowedBooksInfo = await borrowedBooksCollection.find().toArray();
                res.send(borrowedBooksInfo);
            } catch (error) {
                res.status(500).send({ error: 'Failed to fetch borrowed books info' });
            };
        });

        // Get all borrowed books
        app.get('/borrowedBooks/:email', async (req, res) => {
            const email = req.params.email;

            try {
                // Find all borrowed entries by this user
                const borrowedBooks = await borrowedBooksCollection.find({ email }).toArray();
                // Extract all bookId values
                const bookIds = borrowedBooks.map(book => new ObjectId(book.bookId));
                // Find all borrowed books with those bookIds from booksCollection
                const books = await booksCollection.find({ _id: { $in: bookIds } }).toArray();

                // Merge borrowed info with book info
                const booksWithInfo = books.map(book => {
                    const borrowedInfo = borrowedBooks.find(b => b.bookId === book._id.toString());
                    return {
                        ...book,
                        ...borrowedInfo
                    };
                });
                res.send(booksWithInfo);
            } catch (error) {
                return res.status(500).send({ error: 'Failed to fetch borrowed books' });
            };
        });

        // Insert Borrowed book inFo by Post
        app.post('/addBorrowedBookInfo', async (req, res) => {
            const borrowedInfo = req.body;
            const { email, bookId } = borrowedInfo;


            // Check if user has borrowed 3 books already
            const totalBorrowed = await borrowedBooksCollection.countDocuments({ email });
            if (totalBorrowed >= 3) {
                return res.status(403).send({ message: "You can't borrow more than 3 books!" });
            };

            // Check if the user has already borrowed this book
            const alreadyBorrowed = await borrowedBooksCollection.findOne({ email, bookId });
            if (alreadyBorrowed) {
                return res.status(400).send({ message: "You have already borrowed this book." });
            };

            const newInfo = await borrowedBooksCollection.insertOne(borrowedInfo);
            res.send(newInfo);
        });

        // Update book info by Patch
        app.patch('/updateBook/:id', verifyFbToken, verifyTokenEmail, async (req, res) => {
            const id = req.params.id;
            const updatedBook = req.body;

            try {
                const filter = { _id: new ObjectId(id) };
                const updatedDoc = {
                    $set: {
                        ...updatedBook,

                    }
                };

                const result = await booksCollection.updateOne(filter, updatedDoc);
                res.send(result);
            } catch (error) {
                res.status(500).send({ error: "Failed to update book" });
            };
        });

        // Delete Borrowed book by Id
        app.delete('/deleteBorrowedBook/:id', (req, res) => {
            const id = req.params.id;

            const result = borrowedBooksCollection.deleteOne({ _id: new ObjectId(id) });
            res.send(result);
        });

        // 404 route:
        app.use((req, res) => {
            res.status(404).send(
                `<div style=" padding-top: 20px; text-align:center;">
        <h1 style="color: #ff735c">⚠️Page Not Found!</h1>
        <a style="color:blue;" href='/'>Back Home</a>
        </div>`
            );
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Connected to MongoDB!");

        // Start server
        app.listen(port, () => {
            console.log(`🚀 Server is running on http://localhost:${port}`);
        });

    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    };
}
run().catch(console.dir);

