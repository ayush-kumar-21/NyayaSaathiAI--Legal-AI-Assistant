
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Scale, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';
import AnimatedPageWrapper from './common/AnimatedPageWrapper';
import { User } from '../types';
import { GoogleLogin } from '@react-oauth/google';
import { citizenApi } from '../../../core/services/api';

interface SignInProps {
    onSignIn: (user: User) => void;
    t: (key: string) => string;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, t }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log("Google Sign-In Success:", credentialResponse);

        try {
            // Send token to backend for verification
            const response = await citizenApi.auth.google(credentialResponse.credential);
            const data = response.data;

            // Handle backend response format: { access_token, user_name, user_role, ... }
            const accessToken = data.access_token || data.tokens?.access_token;
            if (accessToken) localStorage.setItem('token', accessToken);

            // Update Auth Context
            onSignIn({
                email: data.user_email || data.user?.email || '',
                name: data.user_name || data.user?.full_name || 'User',
                role: (data.user_role || data.user?.role || 'CITIZEN').toUpperCase(),
                // @ts-ignore
                avatar: data.avatar || data.user?.google_profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user_name || 'User'}`
            });
        } catch (err: any) {
            console.error("Google Auth Error:", err);
            setError(err.response?.data?.detail || 'Google authentication failed. Please try again.');
        }
    };

    const handleGoogleFailure = () => {
        console.error("Google Sign-In Failed");
        setError("Google Sign-In Failed. Please try again.");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            let response;
            if (isSignUp) {
                // Sign Up
                response = await citizenApi.auth.signup({
                    email,
                    password,
                    role: 'citizen',
                    full_name: email.split('@')[0] // Default name from email
                });
            } else {
                // Login
                response = await citizenApi.auth.login({
                    email,
                    password
                });
            }

            console.log("Auth Response:", response.data);

            // Handle backend response format: { access_token, user_name, user_role, ... }
            const data = response.data;
            const accessToken = data.access_token || data.tokens?.access_token;
            const refreshToken = data.refresh_token || data.tokens?.refresh_token;

            // Store tokens
            if (accessToken) localStorage.setItem('token', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            // Update Auth Context with user data
            const userEmail = data.user_email || data.user?.email || email;
            const userName = data.user_name || data.user?.full_name || email.split('@')[0];
            const userRole = (data.user_role || data.user?.role || 'citizen').toUpperCase();

            onSignIn({
                email: userEmail,
                name: userName,
                role: userRole,
                // @ts-ignore
                avatar: data.user?.google_profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`
            });

            toast.success(`Welcome back, ${userName}!`);

        } catch (err: any) {
            console.error("Auth Error:", err);
            const errorMessage = err.response?.data?.detail || 'Authentication failed. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    return (
        <AnimatedPageWrapper fullscreen={true}>
            <div className="w-full min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ns-primary-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ns-secondary-700/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
                </div>

                <div className="glass relative z-10 p-8 sm:p-12 rounded-3xl shadow-2xl max-w-md w-full border border-white/10 backdrop-blur-xl">
                    <div className="flex justify-center mb-8">
                        <div className="relative w-20 h-20 rounded-2xl brand-ring flex items-center justify-center shadow-lg shadow-ns-primary-900/20">
                            <div className="absolute inset-0 gridline rounded-2xl"></div>
                            <Scale className="w-10 h-10 text-white relative z-10" />
                        </div>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="title text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">{t('header_title')}</h1>
                        <p className="text-base text-white/60 leading-relaxed">
                            {t('about_desc')}
                        </p>
                    </div>

                    {/* Form for Email/Password */}
                    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-ns-primary-500 transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={t('email_address')}
                                className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ns-primary-500/50 focus:border-ns-primary-500/50 transition-all text-sm"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-ns-primary-500 transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={t('password')}
                                className="w-full pl-12 pr-5 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-ns-primary-500/50 focus:border-ns-primary-500/50 transition-all text-sm"
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-ns-danger text-sm font-medium bg-ns-danger/10 p-3 rounded-lg border border-ns-danger/20">
                                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary w-full group">
                            {isSignUp ? t('create_account') : t('sign_in_prompt').split('? ')[1]}
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="flex items-center my-6">
                        <div className="flex-grow h-px bg-white/10"></div>
                        <span className="mx-4 text-xs text-white/40 font-bold uppercase tracking-wider">OR</span>
                        <div className="flex-grow h-px bg-white/10"></div>
                    </div>

                    <div className="flex justify-center w-full mt-4">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            theme="filled_black"
                            shape="pill"
                            size="large"
                            width="350"
                        />
                    </div>

                    <button onClick={() => { setIsSignUp(!isSignUp); setError(''); }} className="w-full text-center text-sm font-medium text-ns-primary-500 hover:text-ns-primary-400 hover:underline mt-8 transition-colors">
                        {isSignUp ? t('sign_in_prompt') : t('sign_up_prompt')}
                    </button>

                    <p className="text-[10px] text-center text-white/30 mt-6">
                        {t('by_signing_in')}
                    </p>
                </div>
            </div>
        </AnimatedPageWrapper>
    );
};

export default SignIn;
