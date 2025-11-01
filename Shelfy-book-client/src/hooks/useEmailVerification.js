import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import useAuth from './UseAuth';

const useEmailVerification = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Memoize the verification check
    const needsVerification = useMemo(() => {
        return user && !user.emailVerified && user.providerData[0]?.providerId === 'password';
    }, [user]);

    // Check if user is logged in but email is not verified
    useEffect(() => {
        if (needsVerification) {
            // Redirect to email verification page
            navigate('/email-verification');
        }
    }, [needsVerification, navigate]);
};

export default useEmailVerification;