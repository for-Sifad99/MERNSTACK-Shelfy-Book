import React, { createContext, useContext, useState } from 'react';

const UserCreationContext = createContext();

export const UserCreationProvider = ({ children }) => {
    const [userCreationStatus, setUserCreationStatus] = useState({
        isCreated: false,
        userEmail: null
    });

    const setUserCreated = (email) => {
        setUserCreationStatus({
            isCreated: true,
            userEmail: email
        });
    };

    const resetUserCreation = () => {
        setUserCreationStatus({
            isCreated: false,
            userEmail: null
        });
    };

    return (
        <UserCreationContext.Provider value={{
            userCreationStatus,
            setUserCreated,
            resetUserCreation
        }}>
            {children}
        </UserCreationContext.Provider>
    );
};

export const useUserCreation = () => {
    const context = useContext(UserCreationContext);
    if (!context) {
        throw new Error('useUserCreation must be used within a UserCreationProvider');
    }
    return context;
};