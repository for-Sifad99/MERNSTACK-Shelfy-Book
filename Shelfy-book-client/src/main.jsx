import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/router'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import AuthProvider from './contexts/AuthProvider';
import { SocketProvider } from './contexts/SocketContext';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
        <AuthProvider>
          <SocketProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </SocketProvider>
        </AuthProvider>
    </HelmetProvider>
  </StrictMode>,
)