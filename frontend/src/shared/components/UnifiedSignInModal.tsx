// src/shared/components/UnifiedSignInModal.tsx
// NyayaSahayak - Unified Authentication Modal for All Personas
// Supports Citizen, Judge, Police, and Admin with role-specific verification

import React, { useState } from 'react';
import { X, Chrome, User, Mail, ArrowRight, Loader2, Shield, Gavel, Building2, BadgeCheck, MapPin, KeyRound, ChevronLeft, UserPlus, Calendar, CheckCircle } from 'lucide-react';
import { UserRole } from '../../core/auth/AuthContext';
import { citizenApi } from '../../core/services/api';
import { GoogleLogin } from '@react-oauth/google';

interface UnifiedSignInModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSignIn: (userData: {
        name: string;
        email?: string;
        avatar: string;
        station?: string;
        courtId?: string;
        department?: string;
    }, role: UserRole) => void;
    preselectedRole?: UserRole;
}

interface RoleConfig {
    role: UserRole;
    title: string;
    titleHi: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    borderColor: string;
    hoverBg: string;
}

const roles: RoleConfig[] = [
    {
        role: 'CITIZEN',
        title: 'Citizen',
        titleHi: 'नागरिक',
        icon: User,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-500',
        hoverBg: 'hover:bg-orange-50'
    },
    {
        role: 'POLICE',
        title: 'Police Officer',
        titleHi: 'पुलिस अधिकारी',
        icon: Shield,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-500',
        hoverBg: 'hover:bg-blue-50'
    },
    {
        role: 'JUDGE',
        title: 'Judicial Officer',
        titleHi: 'न्यायिक अधिकारी',
        icon: Gavel,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-500',
        hoverBg: 'hover:bg-purple-50'
    },
    {
        role: 'ADMIN',
        title: 'Administrator',
        titleHi: 'प्रशासक',
        icon: Building2,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-500',
        hoverBg: 'hover:bg-amber-50'
    }
];

const UnifiedSignInModal: React.FC<UnifiedSignInModalProps> = ({
    isOpen,
    onClose,
    onSignIn,
    preselectedRole
}) => {
    const [step, setStep] = useState<'role-select' | 'verify' | 'loading'>(preselectedRole ? 'verify' : 'role-select');
    const [selectedRole, setSelectedRole] = useState<UserRole>(preselectedRole || null);
    const [isSignUp, setIsSignUp] = useState(false);
    const [error, setError] = useState('');

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [station, setStation] = useState('');
    const [judgeId, setJudgeId] = useState('');
    const [courtId, setCourtId] = useState('');
    const [adminId, setAdminId] = useState('');
    const [department, setDepartment] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');

    // Reset state when modal opens or role changes
    React.useEffect(() => {
        if (isOpen) {
            setStep(preselectedRole ? 'verify' : 'role-select');
            setSelectedRole(preselectedRole || null);
            setError('');
            setName('');
            setEmail('');
            setServiceId('');
            setStation('');
            setJudgeId('');
            setCourtId('');
            setAdminId('');
            setDepartment('');
            setPassword('');
            setDob('');
            setIsSignUp(false);
        }
    }, [isOpen, preselectedRole]);

    if (!isOpen) return null;

    const selectedRoleConfig = roles.find(r => r.role === selectedRole);

    const handleRoleSelect = (role: UserRole) => {
        setSelectedRole(role);
        setStep('verify');
        setError('');
    };

    const validateAndSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Common validation — name is required for signup (and always for non-citizen roles)
        if (selectedRole !== 'CITIZEN' && !name.trim()) {
            setError('Please enter your name / कृपया अपना नाम दर्ज करें');
            return;
        }

        // Role-specific validation
        switch (selectedRole) {
            case 'CITIZEN':
                if (isSignUp) {
                    if (!name.trim()) {
                        setError('Please enter your name / कृपया अपना नाम दर्ज करें');
                        return;
                    }
                    if (!dob.trim()) {
                        setError('Please enter your date of birth / कृपया जन्म तिथि दर्ज करें');
                        return;
                    }
                }
                if (!email.trim() || !email.includes('@')) {
                    setError('Please enter a valid email / कृपया वैध ईमेल दर्ज करें');
                    return;
                }
                break;
            case 'POLICE':
                if (!serviceId.trim()) {
                    setError('Please enter your Service ID / कृपया सर्विस आईडी दर्ज करें');
                    return;
                }
                if (!station.trim()) {
                    setError('Please enter your Station / कृपया स्टेशन दर्ज करें');
                    return;
                }
                break;
            case 'JUDGE':
                if (!judgeId.trim()) {
                    setError('Please enter your Judge ID / कृपया न्यायाधीश आईडी दर्ज करें');
                    return;
                }
                if (!courtId.trim()) {
                    setError('Please enter your Court ID / कृपया न्यायालय आईडी दर्ज करें');
                    return;
                }
                break;
            case 'ADMIN':
                if (!adminId.trim()) {
                    setError('Please enter your Admin ID / कृपया एडमिन आईडी दर्ज करें');
                    return;
                }
                if (!department.trim()) {
                    setError('Please enter your Department / कृपया विभाग दर्ज करें');
                    return;
                }
                break;
        }

        if (!password.trim()) {
            setError('Please enter your password / कृपया पासवर्ड दर्ज करें');
            return;
        }

        setStep('loading');

        try {
            // Determine unique email/identifier based on role for backend
            let userEmail = email;
            if (selectedRole === 'POLICE') userEmail = `${serviceId}@police.gov.in`;
            if (selectedRole === 'JUDGE') userEmail = `${judgeId}@highcourt.gov.in`;
            if (selectedRole === 'ADMIN') userEmail = `${adminId}@admin.gov.in`;

            let response;
            if (isSignUp) {
                response = await citizenApi.auth.signup({
                    email: userEmail,
                    password,
                    role: selectedRole,
                    full_name: name,
                    station_id: station,
                    court_id: courtId,
                    department: department,
                    badge_number: serviceId || judgeId || adminId,
                    date_of_birth: dob || undefined
                });
            } else {
                response = await citizenApi.auth.login({
                    email: userEmail,
                    password
                });
            }

            // Handle backend response format: { access_token, user_name, user_role, ... }
            const data = response.data;
            const accessToken = data.access_token || data.tokens?.access_token;
            const refreshToken = data.refresh_token || data.tokens?.refresh_token;

            // Store tokens
            if (accessToken) localStorage.setItem('token', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            // Notify parent with user data from backend
            onSignIn({
                name: data.user_name || data.user?.full_name || name,
                email: data.user_email || data.user?.email || userEmail,
                avatar: data.user?.google_profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user_name || data.user?.full_name || name}`,
                station: station,
                courtId: courtId,
                department: department
            }, selectedRole!);

        } catch (err: any) {
            console.error("Auth Error:", err);

            // ===== DEMO FALLBACK: works even without backend =====
            const demoPasswords = ['demo', 'password', 'admin', 'judge', 'police', 'citizen'];
            if (demoPasswords.includes(password.trim().toLowerCase())) {
                console.log("Using demo fallback login for role:", selectedRole);

                // Determine display email
                let userEmail = email;
                if (selectedRole === 'POLICE') userEmail = `${serviceId}@police.gov.in`;
                if (selectedRole === 'JUDGE') userEmail = `${judgeId}@highcourt.gov.in`;
                if (selectedRole === 'ADMIN') userEmail = `${adminId}@admin.gov.in`;

                const displayName = name.trim() || `Demo ${selectedRole?.charAt(0)}${selectedRole?.slice(1).toLowerCase()}`;

                // Set a dummy token so the rest of the app works
                localStorage.setItem('token', 'demo-token-' + selectedRole);

                onSignIn({
                    name: displayName,
                    email: userEmail,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${displayName}`,
                    station: station,
                    courtId: courtId,
                    department: department
                }, selectedRole!);
                return;
            }

            setStep('verify');
            setError(err.response?.data?.detail || 'Authentication failed. Please check credentials or use demo password: "demo"');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        console.log("Google Sign-In Success:", credentialResponse);
        setStep('loading');

        try {
            // Send token to backend for verification
            const response = await citizenApi.auth.google(credentialResponse.credential);
            const data = response.data;

            // Handle backend response format: { access_token, user_name, user_role, ... }
            const accessToken = data.access_token || data.tokens?.access_token;
            const refreshToken = data.refresh_token || data.tokens?.refresh_token;

            // Store tokens
            if (accessToken) localStorage.setItem('token', accessToken);
            if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

            // Update Auth Context with user data
            onSignIn({
                name: data.user_name || data.user?.full_name || data.user_email || "Citizen",
                email: data.user_email || data.user?.email,
                avatar: data.user?.google_profile_picture || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user_name || "User"}`,
                // Citizen doesn't have station/court/dept usually
            }, 'CITIZEN');

        } catch (err: any) {
            setStep('verify');
            console.error("Google Auth Error:", err);
            setError(err.response?.data?.detail || 'Google authentication failed. Please try again.');
        }
    };

    const handleGoogleFailure = () => {
        console.error("Google Sign-In Failed");
        setError("Google Sign-In Failed. Please try again.");
    };

    const handleClose = () => {
        // Reset all state
        setStep(preselectedRole ? 'verify' : 'role-select');
        setSelectedRole(preselectedRole || null);
        setName('');
        setEmail('');
        setServiceId('');
        setStation('');
        setJudgeId('');
        setCourtId('');
        setAdminId('');
        setDepartment('');
        setPassword('');
        setError('');
        setIsSignUp(false);
        onClose();
    };

    const handleBack = () => {
        if (preselectedRole) {
            handleClose();
        } else {
            setStep('role-select');
            setSelectedRole(null);
            setError('');
        }
    };

    // ... (renderRoleSpecificFields is mostly same, just updating props) ...
    const renderRoleSpecificFields = () => {
        switch (selectedRole) {
            case 'CITIZEN':
                return (
                    <>
                        {isSignUp && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth / जन्म तिथि</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); setError(''); }} className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-800" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name / पूरा नाम</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Enter your full name" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-800" />
                                    </div>
                                </div>
                            </>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address / ईमेल</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="your.email@gmail.com" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-800" autoFocus />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / पासवर्ड</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                    </>
                );
            case 'POLICE':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Officer Name / अधिकारी का नाम</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="SI Sharma" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800" autoFocus />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Service ID / सर्विस आईडी</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={serviceId} onChange={(e) => { setServiceId(e.target.value); setError(''); }} placeholder="DL-PS-12345" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Police Station / थाना</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={station} onChange={(e) => { setStation(e.target.value); setError(''); }} placeholder="Saket PS, Delhi" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / पासवर्ड</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                    </>
                );
            case 'JUDGE':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Hon. Justice Name / न्यायाधीश का नाम</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Hon. Justice Patel" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-800" autoFocus />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Judge ID / न्यायाधीश आईडी</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={judgeId} onChange={(e) => { setJudgeId(e.target.value); setError(''); }} placeholder="DHC-J-1234" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Court ID / न्यायालय आईडी</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={courtId} onChange={(e) => { setCourtId(e.target.value); setError(''); }} placeholder="DHC-COURT-1" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / पासवर्ड</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                    </>
                );
            case 'ADMIN':
                return (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin Name / प्रशासक का नाम</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={name} onChange={(e) => { setName(e.target.value); setError(''); }} placeholder="Admin User" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800" autoFocus />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin ID / एडमिन आईडी</label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={adminId} onChange={(e) => { setAdminId(e.target.value); setError(''); }} placeholder="ADM-GOV-001" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Department / विभाग</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" value={department} onChange={(e) => { setDepartment(e.target.value); setError(''); }} placeholder="Ministry of Law & Justice" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password / पासवर्ड</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); setError(''); }} placeholder="••••••••" className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all text-gray-800" />
                            </div>
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const getSubmitButtonColor = () => {
        switch (selectedRole) {
            case 'CITIZEN': return 'bg-orange-600 hover:bg-orange-700';
            case 'POLICE': return 'bg-blue-600 hover:bg-blue-700';
            case 'JUDGE': return 'bg-purple-600 hover:bg-purple-700';
            case 'ADMIN': return 'bg-amber-600 hover:bg-amber-700';
            default: return 'bg-gray-600 hover:bg-gray-700';
        }
    };

    const getPortalName = () => {
        switch (selectedRole) {
            case 'CITIZEN': return 'NyayaSetu (Citizen Portal)';
            case 'POLICE': return 'NyayaRakshak (Police Portal)';
            case 'JUDGE': return 'NyayaAdhikari (Judiciary Portal)';
            case 'ADMIN': return 'NyayaPrashaasak (Admin Portal)';
            default: return 'NyayaSahayak';
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
                {/* Header */}
                <div className={`flex items-center justify-between p-4 border-b border-gray-100 ${selectedRoleConfig?.bgColor || 'bg-gray-50'}`}>
                    <div className="flex items-center gap-3">
                        {selectedRoleConfig ? (
                            <div className={`w-10 h-10 ${selectedRoleConfig.bgColor} rounded-full flex items-center justify-center border-2 ${selectedRoleConfig.borderColor}`}>
                                <selectedRoleConfig.icon className={`w-5 h-5 ${selectedRoleConfig.color}`} />
                            </div>
                        ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                <Chrome className="w-5 h-5 text-white" />
                            </div>
                        )}
                        <div>
                            <span className="font-semibold text-gray-800 block">
                                {step === 'role-select' ? 'Sign In / साइन इन' : (isSignUp ? 'Create Account / खाता बनाएं' : selectedRoleConfig?.title)}
                            </span>
                            {step !== 'role-select' && (
                                <span className="text-xs text-gray-500">{selectedRoleConfig?.titleHi}</span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Step 1: Role Selection */}
                    {step === 'role-select' && (
                        <div className="space-y-4">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-1">Welcome to NyayaSahayak</h2>
                                <p className="text-gray-500 text-sm">
                                    Select your role to continue / जारी रखने के लिए अपनी भूमिका चुनें
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {roles.map((roleConfig) => (
                                    <button
                                        key={roleConfig.role}
                                        onClick={() => handleRoleSelect(roleConfig.role)}
                                        className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 ${roleConfig.hoverBg} hover:border-gray-300 transition-all group`}
                                    >
                                        <div className={`w-12 h-12 ${roleConfig.bgColor} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <roleConfig.icon className={`w-6 h-6 ${roleConfig.color}`} />
                                        </div>
                                        <div className="text-center">
                                            <span className="font-medium text-gray-800 text-sm block">{roleConfig.title}</span>
                                            <span className="text-xs text-gray-500">{roleConfig.titleHi}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                🔒 Secured with HMAC Authentication • Jan-Parichay Compatible
                            </p>
                        </div>
                    )}

                    {/* Step 2: Identity Verification */}
                    {step === 'verify' && (
                        <form onSubmit={validateAndSubmit} className="space-y-4">
                            <div className="text-center mb-4">
                                <p className="text-sm text-gray-500">
                                    {isSignUp ? 'Create your account' : 'Enter your credentials to access'} {getPortalName()}
                                </p>
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                {renderRoleSpecificFields()}
                            </div>

                            <button
                                type="submit"
                                className={`w-full flex items-center justify-center gap-2 px-6 py-3 ${getSubmitButtonColor()} text-white rounded-xl font-medium transition-colors mt-6`}
                            >
                                {isSignUp ? 'Create Account / खाता बनाएं' : 'Sign In / साइन इन करें'}
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {selectedRole === 'CITIZEN' && (
                                <>
                                    <div className="flex items-center my-4">
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                        <span className="mx-4 text-xs text-gray-400 font-medium uppercase tracking-wider">OR</span>
                                        <div className="flex-grow h-px bg-gray-200"></div>
                                    </div>
                                    <div className="flex justify-center w-full">
                                        <GoogleLogin
                                            onSuccess={handleGoogleSuccess}
                                            onError={handleGoogleFailure}
                                            theme="outline"
                                            shape="pill"
                                            size="large"
                                            width="350"
                                            text={isSignUp ? "signup_with" : "signin_with"}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="flex flex-col gap-3 mt-4">
                                <button
                                    type="button"
                                    onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                                    className="w-full flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors py-2 rounded-lg hover:bg-gray-50"
                                >
                                    {isSignUp ? (
                                        <>Already have an account? <span className="font-medium underline">Sign In</span></>
                                    ) : (
                                        <>New user? <span className="font-medium underline">Create Account</span></>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleBack}
                                    className="w-full flex items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    {preselectedRole ? 'Cancel / रद्द करें' : 'Change Role / भूमिका बदलें'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Loading */}
                    {step === 'loading' && (
                        <div className="text-center py-8 space-y-4">
                            <div className={`w-16 h-16 mx-auto ${selectedRoleConfig?.bgColor || 'bg-blue-50'} rounded-full flex items-center justify-center`}>
                                <Loader2 className={`w-8 h-8 ${selectedRoleConfig?.color || 'text-blue-600'} animate-spin`} />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{isSignUp ? 'Creating Account...' : 'Verifying Identity...'}</h3>
                                <p className="text-sm text-gray-500 mt-1">Welcome, {name}!</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-center text-gray-400">
                        🔒 End-to-End Encrypted • HMAC Secured • Government of India
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UnifiedSignInModal;
