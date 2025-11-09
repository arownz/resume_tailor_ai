import React from 'react';
import AuthForm from '../components/AuthForm';

export const AuthPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl font-semibold mb-6">Sign in to Resumay Tailor Swift</h1>
                <AuthForm />
                {/* Global player mounted in App.tsx */}
            </div>
        </div>
    );
};

export default AuthPage;
