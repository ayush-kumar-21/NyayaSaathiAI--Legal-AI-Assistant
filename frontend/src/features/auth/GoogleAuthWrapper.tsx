import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

interface GoogleAuthWrapperProps {
    children: React.ReactNode;
}

const GoogleAuthWrapper: React.FC<GoogleAuthWrapperProps> = ({ children }) => {
    // Fallback ID for development if env is missing - Replace with your actual Client ID from Google Cloud Console
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";

    return (
        <GoogleOAuthProvider clientId={clientId}>
            {children}
        </GoogleOAuthProvider>
    );
};

export default GoogleAuthWrapper;
