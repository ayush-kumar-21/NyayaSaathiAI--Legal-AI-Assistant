import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppSettingsProvider } from './core/context/AppSettingsContext';
import { AuthProvider, useAuth, ProtectedRoute } from './core/auth/AuthContext';
import { ToastProvider } from './core/context/ToastContext';
// import ProtectedRoute from './core/components/ProtectedRoute'; // Removed duplicate
import LoadingFallback from './core/components/ui/LoadingFallback';
import OfflineIndicator from './components/OfflineIndicator';

// Layouts
import CitizenLayout from './shared/layout/CitizenLayout';
import PoliceLayout from './shared/layout/PoliceLayout';
import JudgeLayout from './shared/layout/JudgeLayout';
import AdminLayout from './shared/layout/AdminLayout';

// Public Pages
import LandingPage from './shared/layout/LandingPage';
import SignIn from './features/main/components/SignIn';
// import SignUp from './features/auth/pages/SignUp'; // TODO: Implement SignUp
import EvidenceIntegrityDemo from './pages/EvidenceIntegrityDemo';

// ... (Imports remain the same, just showing the top part change)

// Login Wrapper to adapt parameters
const SignInWrapper = () => {
    const { loginWithProfile } = useAuth();
    const navigate = useNavigate(); // Need to import useNavigate? App.tsx uses it in imports? No, it imports BrowserRouter as Router etc.
    // Wait, App.tsx imports: import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
    // I need useNavigate.

    // Mock translation function
    const t = (key: string) => {
        const translations: { [key: string]: string } = {
            'header_title': 'NyayaSahayak',
            'about_desc': 'AI-Powered Legal Assistance',
            'email_address': 'Email Address',
            'password': 'Password',
            'create_account': 'Create Account',
            'sign_in_prompt': 'Sign In',
            'sign_up_prompt': 'Sign Up',
            'sign_in_with_google': 'Sign in with Google',
            'by_signing_in': 'By signing in you agree to our terms'
        };
        return translations[key] || key;
    };

    const handleSignIn = (user: any) => {
        // user from SignIn.tsx has { email, name, role }
        loginWithProfile({
            name: user.name,
            id: user.email,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`,
            role: user.role.toUpperCase() as any // Cast to UserRole
        });
        // Navigation is handled by AuthContext or ProtectedRoute redirection usually, 
        // but AuthContext.login mock sets user and state.
        // ProtectedRoute will allow access.
    };

    return <SignIn onSignIn={handleSignIn} t={t} />;
};


// Citizen Pages
const CitizenHomePage = React.lazy(() => import('./personas/citizen/pages/CitizenHome'));
const CitizenComplaintPage = React.lazy(() => import('./personas/citizen/pages/CitizenComplaint'));
const CaseTrackPage = React.lazy(() => import('./personas/citizen/pages/CaseTrack'));
const CitizenTimelinePage = React.lazy(() => import('./personas/citizen/pages/CitizenTimeline'));
const CitizenVisualJusticePage = React.lazy(() => import('./personas/citizen/pages/CitizenVisualJustice'));
const LegalTechHubWrapper = React.lazy(() => import('./features/common/wrappers/LegalTechHubWrapper'));
const NyayaBotWrapper = React.lazy(() => import('./features/common/wrappers/NyayaBotWrapper'));
const LitigantHappinessWrapper = React.lazy(() => import('./features/common/wrappers/LitigantHappinessWrapper'));
const KnowYourRights = React.lazy(() => import('./features/citizen/pages/KnowYourRights'));
const DocumentScannerPage = React.lazy(() => import('./features/citizen/pages/DocumentScanner'));
const VoiceGrievancePage = React.lazy(() => import('./features/citizen/pages/VoiceGrievance'));
const SecureChatPage = React.lazy(() => import('./features/citizen/pages/SecureChat'));

// Police Pages
const PoliceDashboard = React.lazy(() => import('./personas/police/pages/PoliceDashboard'));
const SmartFIRPage = React.lazy(() => import('./personas/police/pages/SmartFIR'));
const FinancialAnalyzerPage = React.lazy(() => import('./personas/police/pages/FinancialAnalyzer'));
const EvidenceLockerPage = React.lazy(() => import('./personas/police/pages/EvidenceLocker'));
const WitnessTrackerPage = React.lazy(() => import('./personas/police/pages/WitnessTracker'));
const CaseLinkerPage = React.lazy(() => import('./personas/police/pages/CaseLinker'));
const ChargeSheetBuilderPage = React.lazy(() => import('./personas/police/pages/ChargeSheetBuilder'));
const InvestigationPlannerPage = React.lazy(() => import('./personas/police/pages/InvestigationPlanner'));
const QuantumFingerprintWrapper = React.lazy(() => import('./features/common/wrappers/QuantumFingerprintWrapper'));
const QuantumHashWrapper = React.lazy(() => import('./features/common/wrappers/QuantumHashWrapper'));
const PatrolMapPage = React.lazy(() => import('./personas/police/pages/PatrolMap'));
const DutyRosterPage = React.lazy(() => import('./personas/police/pages/DutyRoster'));
const WarrantManagerPage = React.lazy(() => import('./personas/police/pages/WarrantManagerPage'));
const CrimeScene3DPage = React.lazy(() => import('./personas/police/pages/CrimeScene3D'));

// Judge Pages
const JudgeBoardPage = React.lazy(() => import('./personas/judge/pages/JudgeBoard'));
const UrgencyMatrixPage = React.lazy(() => import('./features/judge/pages/UrgencyMatrixPage'));
const VirtualCourtPage = React.lazy(() => import('./features/judge/pages/VirtualCourtPage'));
const CaseQueuePage = React.lazy(() => import('./personas/judge/pages/CaseQueuePage'));
const CaseTriageWrapper = React.lazy(() => import('./features/common/wrappers/CaseTriageWrapper'));
const EnhancedJudgeDashboard = React.lazy(() => import('./personas/judge/pages/JudgeDashboard'));
const AdjournmentRiskWrapper = React.lazy(() => import('./features/common/wrappers/AdjournmentRiskWrapper'));
const CaseMapperWrapper = React.lazy(() => import('./features/common/wrappers/CaseMapperWrapper'));
const JusticeTimelineWrapper = React.lazy(() => import('./features/common/wrappers/JusticeTimelineWrapper'));
const DocumentAnalysisWrapper = React.lazy(() => import('./features/common/wrappers/DocumentAnalysisWrapper'));
const SmartBailPage = React.lazy(() => import('./personas/judge/pages/SmartBailPage'));
const OrdersHistoryPage = React.lazy(() => import('./personas/judge/pages/OrdersHistory'));
const JudgeWellnessPage = React.lazy(() => import('./personas/judge/pages/JudgeWellness'));
const NyayaChitraWrapper = React.lazy(() => import('./features/common/wrappers/NyayaChitraWrapper'));
const HistoryWrapper = React.lazy(() => import('./features/common/wrappers/HistoryWrapper'));
const HashVerifierPage = React.lazy(() => import('./personas/judge/pages/HashVerifier'));
const VirtualMootCourtPage = React.lazy(() => import('./personas/judge/pages/VirtualMootCourt'));
const BenchMemoGeneratorPage = React.lazy(() => import('./personas/judge/pages/BenchMemoGenerator'));
const BailReckonerPage = React.lazy(() => import('./personas/judge/pages/BailReckoner'));
const SentencingAssistantPage = React.lazy(() => import('./personas/judge/pages/SentencingAssistant'));
const CaseIntakeTriagePage = React.lazy(() => import('./personas/judge/pages/CaseIntakeTriagePage'));
const JudgmentValidatorPage = React.lazy(() => import('./personas/judge/pages/JudgmentValidatorPage'));

// Citizen Skill Pages
const KnowYourRightsPage = React.lazy(() => import('./personas/citizen/pages/KnowYourRightsPage'));
const CaseStatusTrackerPage = React.lazy(() => import('./personas/citizen/pages/CaseStatusTrackerPage'));
const LegalAidFinderPage = React.lazy(() => import('./personas/citizen/pages/LegalAidFinderPage'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./personas/admin/pages/AdminDashboard'));
const ResourceAllocatorPage = React.lazy(() => import('./features/admin/pages/ResourceAllocatorPage'));
const SystemHealthPage = React.lazy(() => import('./features/admin/pages/SystemHealthPage'));
const BNSTransitionPage = React.lazy(() => import('./personas/admin/pages/BNSTransition'));
const PendencyMapPage = React.lazy(() => import('./personas/admin/pages/PendencyMap'));
const RegistryDashboard = React.lazy(() => import('./personas/admin/pages/RegistryDashboard'));
const ListingOptimizer = React.lazy(() => import('./personas/admin/pages/ListingOptimizer'));

// Test Dashboard
import TestDashboard from './pages/TestDashboard';

// Scroll to top component
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Main App Structure
const AppContent = () => {
    const { isAuthenticated, user } = useAuth();

    // If authenticated - use role-based routing
    if (isAuthenticated && user) {
        return (
            <AppSettingsProvider>
                <ToastProvider>
                    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
                        <OfflineIndicator />
                        <Routes>
                            {/* Profile Settings */}
                            <Route
                                path="/profile"
                                element={
                                    <React.Suspense fallback={<LoadingFallback />}>
                                        <React.Fragment />
                                    </React.Suspense>
                                }
                            />

                            {/* CITIZEN ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['CITIZEN']} />}>
                                <Route path="/citizen" element={<CitizenLayout />}>
                                    <Route index element={<Navigate to="home" replace />} />
                                    <Route path="home" element={<React.Suspense fallback={<LoadingFallback />}><CitizenHomePage /></React.Suspense>} />
                                    <Route path="file" element={<React.Suspense fallback={<LoadingFallback />}><CitizenComplaintPage /></React.Suspense>} />
                                    <Route path="track" element={<React.Suspense fallback={<LoadingFallback />}><CaseTrackPage /></React.Suspense>} />
                                    <Route path="timeline" element={<React.Suspense fallback={<LoadingFallback />}><CitizenTimelinePage /></React.Suspense>} />
                                    <Route path="visuals" element={<React.Suspense fallback={<LoadingFallback />}><CitizenVisualJusticePage /></React.Suspense>} />
                                    <Route path="legal-hub" element={<LegalTechHubWrapper />} />
                                    <Route path="bot" element={<NyayaBotWrapper />} />
                                    <Route path="feedback" element={<LitigantHappinessWrapper />} />
                                    <Route path="kyr" element={<React.Suspense fallback={<LoadingFallback />}><KnowYourRights /></React.Suspense>} />
                                    <Route path="scanner" element={<React.Suspense fallback={<LoadingFallback />}><DocumentScannerPage /></React.Suspense>} />
                                    <Route path="voice" element={<React.Suspense fallback={<LoadingFallback />}><VoiceGrievancePage /></React.Suspense>} />
                                    <Route path="chat" element={<React.Suspense fallback={<LoadingFallback />}><SecureChatPage /></React.Suspense>} />
                                    <Route path="case-status" element={<React.Suspense fallback={<LoadingFallback />}><CaseStatusTrackerPage /></React.Suspense>} />
                                    <Route path="legal-aid" element={<React.Suspense fallback={<LoadingFallback />}><LegalAidFinderPage /></React.Suspense>} />
                                    <Route path="rights" element={<React.Suspense fallback={<LoadingFallback />}><KnowYourRightsPage /></React.Suspense>} />
                                </Route>
                            </Route>

                            {/* POLICE ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['POLICE']} />}>
                                <Route path="/police" element={<PoliceLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="home" element={<Navigate to="/police/dashboard" replace />} />
                                    <Route path="dashboard" element={<React.Suspense fallback={<LoadingFallback />}><PoliceDashboard /></React.Suspense>} />
                                    <Route path="fir" element={<React.Suspense fallback={<LoadingFallback />}><SmartFIRPage /></React.Suspense>} />
                                    <Route path="financial" element={<React.Suspense fallback={<LoadingFallback />}><FinancialAnalyzerPage /></React.Suspense>} />
                                    <Route path="evidence" element={<React.Suspense fallback={<LoadingFallback />}><EvidenceLockerPage /></React.Suspense>} />
                                    <Route path="witness" element={<React.Suspense fallback={<LoadingFallback />}><WitnessTrackerPage /></React.Suspense>} />
                                    <Route path="linker" element={<React.Suspense fallback={<LoadingFallback />}><CaseLinkerPage /></React.Suspense>} />
                                    <Route path="chargesheet" element={<React.Suspense fallback={<LoadingFallback />}><ChargeSheetBuilderPage /></React.Suspense>} />
                                    <Route path="investigation" element={<React.Suspense fallback={<LoadingFallback />}><InvestigationPlannerPage /></React.Suspense>} />
                                    <Route path="quantum" element={<QuantumFingerprintWrapper />} />
                                    <Route path="hash" element={<QuantumHashWrapper />} />
                                    <Route path="patrol" element={<React.Suspense fallback={<LoadingFallback />}><PatrolMapPage /></React.Suspense>} />
                                    <Route path="roster" element={<React.Suspense fallback={<LoadingFallback />}><DutyRosterPage /></React.Suspense>} />
                                    <Route path="warrants" element={<React.Suspense fallback={<LoadingFallback />}><WarrantManagerPage /></React.Suspense>} />
                                    <Route path="crime-scene" element={<React.Suspense fallback={<LoadingFallback />}><CrimeScene3DPage /></React.Suspense>} />
                                    <Route path="bot" element={<NyayaBotWrapper />} />
                                </Route>
                            </Route>

                            {/* JUDGE ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['JUDGE']} />}>
                                <Route path="/judge" element={<JudgeLayout />}>
                                    <Route index element={<Navigate to="board" replace />} />
                                    <Route path="home" element={<Navigate to="/judge/board" replace />} />
                                    <Route path="board" element={<React.Suspense fallback={<LoadingFallback />}><JudgeBoardPage /></React.Suspense>} />
                                    <Route path="urgency" element={<React.Suspense fallback={<LoadingFallback />}><UrgencyMatrixPage /></React.Suspense>} />
                                    <Route path="virtual-court" element={<React.Suspense fallback={<LoadingFallback />}><VirtualCourtPage /></React.Suspense>} />
                                    <Route path="queue" element={<React.Suspense fallback={<LoadingFallback />}><CaseQueuePage /></React.Suspense>} />
                                    <Route path="triage" element={<CaseTriageWrapper />} />
                                    <Route path="draft" element={<React.Suspense fallback={<LoadingFallback />}><EnhancedJudgeDashboard /></React.Suspense>} />
                                    <Route path="risk" element={<AdjournmentRiskWrapper />} />
                                    <Route path="mapper" element={<CaseMapperWrapper />} />
                                    <Route path="timeline" element={<JusticeTimelineWrapper />} />
                                    <Route path="evidence" element={<DocumentAnalysisWrapper />} />
                                    <Route path="bail" element={<React.Suspense fallback={<LoadingFallback />}><SmartBailPage /></React.Suspense>} />
                                    <Route path="orders" element={<React.Suspense fallback={<LoadingFallback />}><OrdersHistoryPage /></React.Suspense>} />
                                    <Route path="wellness" element={<React.Suspense fallback={<LoadingFallback />}><JudgeWellnessPage /></React.Suspense>} />
                                    <Route path="visuals" element={<NyayaChitraWrapper />} />
                                    <Route path="bot" element={<NyayaBotWrapper />} />
                                    <Route path="history" element={<HistoryWrapper />} />
                                    <Route path="verify" element={<React.Suspense fallback={<LoadingFallback />}><HashVerifierPage /></React.Suspense>} />
                                    <Route path="moot-court" element={<React.Suspense fallback={<LoadingFallback />}><VirtualMootCourtPage /></React.Suspense>} />
                                    <Route path="bench-memo" element={<React.Suspense fallback={<LoadingFallback />}><BenchMemoGeneratorPage /></React.Suspense>} />
                                    <Route path="bail-reckoner" element={<React.Suspense fallback={<LoadingFallback />}><BailReckonerPage /></React.Suspense>} />
                                    <Route path="sentencing" element={<React.Suspense fallback={<LoadingFallback />}><SentencingAssistantPage /></React.Suspense>} />
                                    <Route path="intake-triage" element={<React.Suspense fallback={<LoadingFallback />}><CaseIntakeTriagePage /></React.Suspense>} />
                                    <Route path="judgment-validator" element={<React.Suspense fallback={<LoadingFallback />}><JudgmentValidatorPage /></React.Suspense>} />
                                </Route>
                            </Route>

                            {/* ADMIN ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="home" element={<Navigate to="/admin/dashboard" replace />} />
                                    <Route path="dashboard" element={<React.Suspense fallback={<LoadingFallback />}><AdminDashboard /></React.Suspense>} />
                                    <Route path="analysis" element={<DocumentAnalysisWrapper />} />
                                    <Route path="resources" element={<React.Suspense fallback={<LoadingFallback />}><ResourceAllocatorPage /></React.Suspense>} />
                                    <Route path="infrastructure" element={<React.Suspense fallback={<LoadingFallback />}><SystemHealthPage /></React.Suspense>} />
                                    <Route path="happiness" element={<LitigantHappinessWrapper />} />
                                    <Route path="history" element={<HistoryWrapper />} />
                                    <Route path="quantum" element={<QuantumFingerprintWrapper />} />
                                    <Route path="transition" element={<React.Suspense fallback={<LoadingFallback />}><BNSTransitionPage /></React.Suspense>} />
                                    <Route path="pendency" element={<React.Suspense fallback={<LoadingFallback />}><PendencyMapPage /></React.Suspense>} />
                                    <Route path="registry" element={<React.Suspense fallback={<LoadingFallback />}><RegistryDashboard /></React.Suspense>} />
                                    <Route path="listing" element={<React.Suspense fallback={<LoadingFallback />}><ListingOptimizer /></React.Suspense>} />
                                </Route>
                            </Route>



                            {/* Test Dashboard - Available when authenticated */}
                            <Route path="/test" element={<TestDashboard />} />

                            {/* Catch-all fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                        <Toaster position="top-right" />
                    </div>
                </ToastProvider>
            </AppSettingsProvider>
        );
    }

    // ================== PUBLIC ROUTES ==================
    return (
        <ToastProvider>
            <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
                <OfflineIndicator />
                <Routes>
                    <Route path="/" element={<LandingPage />} />

                    {/* Evidence Integrity Sandbox - accessible without auth for testing */}
                    <Route
                        path="/integrity-sandbox/:caseId?"
                        element={
                            <React.Suspense fallback={<LoadingFallback />}>
                                <EvidenceIntegrityDemo />
                            </React.Suspense>
                        }
                    />

                    {/* Test Dashboard - Public for Debugging */}
                    <Route path="/test" element={<TestDashboard />} />

                    {/* Login/Auth */}
                    <Route path="/login" element={<SignInWrapper />} />
                    {/* <Route path="/register" element={<SignUp />} /> */}

                    {/* Fallback to login for any other route */}
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
                <Toaster position="top-right" />
            </div>
        </ToastProvider>
    );
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <ScrollToTop />
                <AppContent />
            </AuthProvider>
        </Router>
    );
};

export default App;
