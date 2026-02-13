import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppSettingsProvider } from './core/context/AppSettingsContext';
import { AuthProvider, useAuth, ProtectedRoute } from './core/auth/AuthContext';
import { ToastProvider } from './core/context/ToastContext';
// import ProtectedRoute from './core/components/ProtectedRoute'; // Removed duplicate
import LoadingFallback from './core/components/ui/LoadingFallback';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});
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

// Error Boundary to catch crashes and show error details instead of white screen
class AppErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: 40, background: '#1e1b2e', color: '#f87171', minHeight: '100vh', fontFamily: 'monospace' }}>
                    <h1 style={{ fontSize: 32, marginBottom: 16 }}>💥 App Crashed — Error Details</h1>
                    <pre style={{ background: '#0f0d1a', padding: 20, borderRadius: 8, overflow: 'auto', color: '#fbbf24', whiteSpace: 'pre-wrap' }}>
                        {this.state.error?.message}
                    </pre>
                    <pre style={{ background: '#0f0d1a', padding: 20, borderRadius: 8, overflow: 'auto', marginTop: 12, fontSize: 12, color: '#94a3b8', whiteSpace: 'pre-wrap' }}>
                        {this.state.error?.stack}
                    </pre>
                    <button onClick={() => { localStorage.clear(); window.location.href = '/'; }}
                        style={{ marginTop: 20, background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}>
                        🔄 Clear Storage & Reload
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

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
const LegalActionCenter = React.lazy(() => import('./features/citizen/pages/LegalActionCenter'));
const CaseTrackPage = React.lazy(() => import('./personas/citizen/pages/CaseTrack'));
const CitizenTimelinePage = React.lazy(() => import('./personas/citizen/pages/CitizenTimeline'));
const CitizenVisualJusticePage = React.lazy(() => import('./personas/citizen/pages/CitizenVisualJustice'));
const NyayaBotWrapper = React.lazy(() => import('./features/common/wrappers/NyayaBotWrapper'));
const LitigantHappinessWrapper = React.lazy(() => import('./features/common/wrappers/LitigantHappinessWrapper'));
const KnowYourRights = React.lazy(() => import('./features/citizen/pages/KnowYourRights'));
const DocumentScannerPage = React.lazy(() => import('./features/citizen/pages/DocumentScanner'));
const VoiceGrievancePage = React.lazy(() => import('./features/citizen/pages/VoiceGrievance'));
const SecureChatPage = React.lazy(() => import('./features/citizen/pages/SecureChat'));
const CasePredictorPage = React.lazy(() => import('./personas/citizen/pages/CasePredictorPage'));
const FilingDashboard = React.lazy(() => import('./personas/citizen/pages/FilingDashboard'));
const EFilingWizard = React.lazy(() => import('./personas/citizen/pages/EFilingWizard'));
const EligibilityCheckerPage = React.lazy(() => import('./personas/citizen/pages/EligibilityCheckerPage'));
const CitizenProfile = React.lazy(() => import('./features/citizen/pages/CitizenProfile'));
const CitizenSupport = React.lazy(() => import('./features/citizen/pages/CitizenSupport'));

// Police Pages
const PoliceDashboard = React.lazy(() => import('./personas/police/pages/PoliceDashboard'));
const StationDashboard = React.lazy(() => import('./personas/police/pages/StationDashboard'));
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
const ForensicInterlockPage = React.lazy(() => import('./personas/police/pages/ForensicInterlock'));
const EvidenceHasherPage = React.lazy(() => import('./personas/police/pages/EvidenceHasher'));
const SerialOffenderAnalysisPage = React.lazy(() => import('./personas/police/pages/SerialOffenderAnalysis'));
const InvestigationGanttPage = React.lazy(() => import('./personas/police/pages/InvestigationGantt'));
const FIRHistoryPage = React.lazy(() => import('./personas/police/pages/FIRHistory'));
const PoliceEscalationInboxPage = React.lazy(() => import('./personas/police/pages/EscalationInbox'));

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
const BenchMemoTemplatesPage = React.lazy(() => import('./personas/judge/pages/BenchMemoTemplates'));
const BailHistoryPage = React.lazy(() => import('./personas/judge/pages/BailHistory'));
const SentencingPrecedentsPage = React.lazy(() => import('./personas/judge/pages/SentencingPrecedents'));
const MootScenarioLibraryPage = React.lazy(() => import('./personas/judge/pages/MootScenarioLibrary'));
const SmartOrdersPage = React.lazy(() => import('./personas/judge/pages/SmartOrders'));
const WellnessAnalyticsPage = React.lazy(() => import('./personas/judge/pages/WellnessAnalytics'));
const PriorityMatrixPage = React.lazy(() => import('./personas/judge/components/queue/PriorityMatrix'));
const CaseIntakeTriagePage = React.lazy(() => import('./personas/judge/pages/CaseIntakeTriagePage'));
const JudgmentValidatorPage = React.lazy(() => import('./personas/judge/pages/JudgmentValidatorPage'));
const LegalKnowledgeBankPage = React.lazy(() => import('./personas/judge/pages/LegalKnowledgeBank'));
const CourtCalendarPage = React.lazy(() => import('./personas/judge/pages/CourtCalendar'));
const EvidenceVaultPage = React.lazy(() => import('./personas/judge/pages/EvidenceVault'));
const OrderManagementPage = React.lazy(() => import('./personas/judge/pages/OrderManagement'));
const JudgeEscalationQueuePage = React.lazy(() => import('./personas/judge/pages/EscalationQueue'));

// Citizen Skill Pages
const KnowYourRightsPage = React.lazy(() => import('./personas/citizen/pages/KnowYourRightsPage'));
const CaseStatusTrackerPage = React.lazy(() => import('./personas/citizen/pages/CaseStatusTrackerPage'));
const LegalAidFinderPage = React.lazy(() => import('./personas/citizen/pages/LegalAidFinderPage'));
const CitizenAboutPage = React.lazy(() => import('./personas/citizen/pages/AboutPage'));
const FileComplaintPage = React.lazy(() => import('./personas/citizen/pages/FileComplaint'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./personas/admin/pages/AdminDashboard'));
const ResourceAllocatorPage = React.lazy(() => import('./personas/admin/pages/ResourceAllocatorPage'));
const SystemHealthPage = React.lazy(() => import('./personas/admin/pages/SystemHealthPage'));
const BNSTransitionPage = React.lazy(() => import('./personas/admin/pages/BNSTransition'));
const PendencyMapPage = React.lazy(() => import('./personas/admin/pages/PendencyMap'));
const RegistryBatchProcessing = React.lazy(() => import('./personas/admin/pages/RegistryBatchProcessing'));
const RegistryTemplates = React.lazy(() => import('./personas/admin/pages/RegistryTemplates'));
const RegistryAnalytics = React.lazy(() => import('./personas/admin/pages/RegistryAnalytics'));
const ListingMultiCourt = React.lazy(() => import('./personas/admin/pages/ListingMultiCourt'));
const ListingTemplates = React.lazy(() => import('./personas/admin/pages/ListingTemplates'));
const ListingHistory = React.lazy(() => import('./personas/admin/pages/ListingHistory'));
const DocumentAnalysisPage = React.lazy(() => import('./personas/admin/pages/DocumentAnalysisPage'));
const ActivityLogPage = React.lazy(() => import('./personas/admin/pages/ActivityLogPage'));
const QuantumVerifyPage = React.lazy(() => import('./personas/admin/pages/QuantumVerifyPage'));
const RegistryDashboard = React.lazy(() => import('./personas/admin/pages/RegistryDashboard'));
const ListingOptimizer = React.lazy(() => import('./personas/admin/pages/ListingOptimizer'));

// Shared Pages
const AboutPage = React.lazy(() => import('./features/main/components/About'));
const TeamPage = React.lazy(() => import('./pages/TeamPage'));

const AboutWrapper = () => {
    // Mock translation function for About page
    const t = (key: string) => {
        const translations: { [key: string]: string } = {
            'hero_title': 'Decentralized Justice Delivery',
            'hero_subtitle': 'AI-Powered Judicial Interventions for the 21st Century',
            'explore_btn': 'Explore Platform',
            'features_title': 'Core Capabilities',
            'stats_title': 'Impact Metrics',
            'roles_title': 'Tailored Experiences',
            'tech_title': 'Built on Trust',
            'cta_title': 'Ready to Modernize?',
            'cta_btn': 'Get Started',
            'cta_desc': 'Join the judicial revolution today.'
        };
        return translations[key] || key;
    };
    return (
        <React.Suspense fallback={<LoadingFallback />}>
            <AboutPage t={t} />
        </React.Suspense>
    );
};



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

                            {/* Shared Routes */}
                            <Route path="/about" element={<AboutWrapper />} />
                            <Route path="/team" element={<React.Suspense fallback={<LoadingFallback />}><TeamPage /></React.Suspense>} />

                            {/* Root Redirect based on Role */}
                            <Route path="/" element={
                                <Navigate to={
                                    user.role === 'POLICE' ? '/police/dashboard' :
                                        user.role === 'JUDGE' ? '/judge/board' :
                                            user.role === 'ADMIN' ? '/admin/dashboard' :
                                                '/citizen/home'
                                } replace />
                            } />

                            {/* CITIZEN ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['CITIZEN']} />}>
                                <Route path="/citizen" element={<CitizenLayout />}>
                                    <Route index element={<Navigate to="home" replace />} />
                                    <Route path="home" element={<React.Suspense fallback={<LoadingFallback />}><CitizenHomePage /></React.Suspense>} />
                                    <Route path="action" element={<React.Suspense fallback={<LoadingFallback />}><LegalActionCenter /></React.Suspense>} />

                                    <Route path="legal-hub" element={<Navigate to="action" replace />} />
                                    <Route path="track" element={<React.Suspense fallback={<LoadingFallback />}><CaseTrackPage /></React.Suspense>} />
                                    <Route path="timeline" element={<React.Suspense fallback={<LoadingFallback />}><CitizenTimelinePage /></React.Suspense>} />
                                    <Route path="visuals" element={<React.Suspense fallback={<LoadingFallback />}><CitizenVisualJusticePage /></React.Suspense>} />
                                    <Route path="bot" element={<React.Suspense fallback={<LoadingFallback />}><NyayaBotWrapper /></React.Suspense>} />
                                    <Route path="feedback" element={<React.Suspense fallback={<LoadingFallback />}><LitigantHappinessWrapper /></React.Suspense>} />
                                    <Route path="kyr" element={<React.Suspense fallback={<LoadingFallback />}><KnowYourRights /></React.Suspense>} />
                                    <Route path="scanner" element={<React.Suspense fallback={<LoadingFallback />}><DocumentScannerPage /></React.Suspense>} />
                                    <Route path="voice" element={<React.Suspense fallback={<LoadingFallback />}><VoiceGrievancePage /></React.Suspense>} />
                                    <Route path="chat" element={<React.Suspense fallback={<LoadingFallback />}><SecureChatPage /></React.Suspense>} />
                                    <Route path="case-status" element={<React.Suspense fallback={<LoadingFallback />}><CaseStatusTrackerPage /></React.Suspense>} />
                                    <Route path="legal-aid" element={<React.Suspense fallback={<LoadingFallback />}><LegalAidFinderPage /></React.Suspense>} />
                                    <Route path="legal-aid/eligibility" element={<React.Suspense fallback={<LoadingFallback />}><EligibilityCheckerPage /></React.Suspense>} />
                                    <Route path="predict" element={<React.Suspense fallback={<LoadingFallback />}><CasePredictorPage /></React.Suspense>} />
                                    <Route path="file" element={<React.Suspense fallback={<LoadingFallback />}><FilingDashboard /></React.Suspense>} />
                                    <Route path="file/wizard" element={<React.Suspense fallback={<LoadingFallback />}><EFilingWizard /></React.Suspense>} />
                                    <Route path="rights" element={<React.Suspense fallback={<LoadingFallback />}><KnowYourRightsPage /></React.Suspense>} />
                                    <Route path="profile" element={<React.Suspense fallback={<LoadingFallback />}><CitizenProfile /></React.Suspense>} />
                                    <Route path="support" element={<React.Suspense fallback={<LoadingFallback />}><CitizenSupport /></React.Suspense>} />
                                    <Route path="about" element={<React.Suspense fallback={<LoadingFallback />}><CitizenAboutPage /></React.Suspense>} />
                                    <Route path="file-complaint" element={<React.Suspense fallback={<LoadingFallback />}><FileComplaintPage /></React.Suspense>} />
                                </Route>
                            </Route>

                            {/* POLICE ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['POLICE']} />}>
                                <Route path="/police" element={<PoliceLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="home" element={<Navigate to="/police/dashboard" replace />} />
                                    <Route path="dashboard" element={<React.Suspense fallback={<LoadingFallback />}><PoliceDashboard /></React.Suspense>} />
                                    <Route path="station" element={<React.Suspense fallback={<LoadingFallback />}><StationDashboard /></React.Suspense>} />
                                    <Route path="fir" element={<React.Suspense fallback={<LoadingFallback />}><SmartFIRPage /></React.Suspense>} />
                                    <Route path="financial" element={<React.Suspense fallback={<LoadingFallback />}><FinancialAnalyzerPage /></React.Suspense>} />
                                    <Route path="evidence" element={<React.Suspense fallback={<LoadingFallback />}><EvidenceLockerPage /></React.Suspense>} />
                                    <Route path="witness" element={<React.Suspense fallback={<LoadingFallback />}><WitnessTrackerPage /></React.Suspense>} />
                                    <Route path="case-linker" element={<React.Suspense fallback={<LoadingFallback />}><CaseLinkerPage /></React.Suspense>} />
                                    <Route path="charge-sheet" element={<React.Suspense fallback={<LoadingFallback />}><ChargeSheetBuilderPage /></React.Suspense>} />
                                    <Route path="investigation" element={<React.Suspense fallback={<LoadingFallback />}><InvestigationPlannerPage /></React.Suspense>} />
                                    {/* Skills 08 & 09 Placeholder - To be implemented in Phase 2 */}
                                    <Route path="forensic" element={<React.Suspense fallback={<LoadingFallback />}><ForensicInterlockPage /></React.Suspense>} />
                                    <Route path="hasher" element={<React.Suspense fallback={<LoadingFallback />}><EvidenceHasherPage /></React.Suspense>} />
                                    {/* Phase 3 Skills */}
                                    <Route path="serial-offender" element={<React.Suspense fallback={<LoadingFallback />}><SerialOffenderAnalysisPage /></React.Suspense>} />
                                    <Route path="investigation-gantt" element={<React.Suspense fallback={<LoadingFallback />}><InvestigationGanttPage /></React.Suspense>} />
                                    <Route path="fir-history" element={<React.Suspense fallback={<LoadingFallback />}><FIRHistoryPage /></React.Suspense>} />

                                    <Route path="quantum" element={<React.Suspense fallback={<LoadingFallback />}><QuantumFingerprintWrapper /></React.Suspense>} />
                                    <Route path="hash" element={<React.Suspense fallback={<LoadingFallback />}><QuantumHashWrapper /></React.Suspense>} />
                                    <Route path="patrol" element={<React.Suspense fallback={<LoadingFallback />}><PatrolMapPage /></React.Suspense>} />
                                    <Route path="roster" element={<React.Suspense fallback={<LoadingFallback />}><DutyRosterPage /></React.Suspense>} />
                                    <Route path="warrants" element={<React.Suspense fallback={<LoadingFallback />}><WarrantManagerPage /></React.Suspense>} />
                                    <Route path="crime-scene" element={<React.Suspense fallback={<LoadingFallback />}><CrimeScene3DPage /></React.Suspense>} />
                                    <Route path="bot" element={<React.Suspense fallback={<LoadingFallback />}><NyayaBotWrapper /></React.Suspense>} />
                                    <Route path="escalation" element={<React.Suspense fallback={<LoadingFallback />}><PoliceEscalationInboxPage /></React.Suspense>} />
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

                                    {/* LegalOS 4.0 Skill Pages */}
                                    <Route path="queue" element={<React.Suspense fallback={<LoadingFallback />}><PriorityMatrixPage /></React.Suspense>} />
                                    <Route path="bail" element={<React.Suspense fallback={<LoadingFallback />}><BailHistoryPage /></React.Suspense>} />
                                    <Route path="sentencing" element={<React.Suspense fallback={<LoadingFallback />}><SentencingPrecedentsPage /></React.Suspense>} />
                                    <Route path="bench-memo" element={<React.Suspense fallback={<LoadingFallback />}><BenchMemoTemplatesPage /></React.Suspense>} />
                                    <Route path="moot-court" element={<React.Suspense fallback={<LoadingFallback />}><MootScenarioLibraryPage /></React.Suspense>} />
                                    <Route path="smart-orders" element={<Navigate to="orders" replace />} />
                                    <Route path="orders" element={<React.Suspense fallback={<LoadingFallback />}><OrderManagementPage /></React.Suspense>} />
                                    <Route path="wellness" element={<React.Suspense fallback={<LoadingFallback />}><WellnessAnalyticsPage /></React.Suspense>} />
                                    <Route path="validate" element={<React.Suspense fallback={<LoadingFallback />}><JudgmentValidatorPage /></React.Suspense>} />

                                    {/* Legacy/Other Routes */}
                                    <Route path="triage" element={<React.Suspense fallback={<LoadingFallback />}><CaseTriageWrapper /></React.Suspense>} />
                                    <Route path="draft" element={<React.Suspense fallback={<LoadingFallback />}><EnhancedJudgeDashboard /></React.Suspense>} />
                                    <Route path="risk" element={<React.Suspense fallback={<LoadingFallback />}><AdjournmentRiskWrapper /></React.Suspense>} />
                                    <Route path="mapper" element={<React.Suspense fallback={<LoadingFallback />}><CaseMapperWrapper /></React.Suspense>} />
                                    <Route path="timeline" element={<React.Suspense fallback={<LoadingFallback />}><JusticeTimelineWrapper /></React.Suspense>} />
                                    <Route path="evidence" element={<React.Suspense fallback={<LoadingFallback />}><EvidenceVaultPage /></React.Suspense>} />
                                    <Route path="visuals" element={<React.Suspense fallback={<LoadingFallback />}><NyayaChitraWrapper /></React.Suspense>} />
                                    <Route path="bot" element={<React.Suspense fallback={<LoadingFallback />}><NyayaBotWrapper /></React.Suspense>} />
                                    <Route path="history" element={<React.Suspense fallback={<LoadingFallback />}><HistoryWrapper /></React.Suspense>} />
                                    <Route path="verify" element={<React.Suspense fallback={<LoadingFallback />}><HashVerifierPage /></React.Suspense>} />
                                    <Route path="intake-triage" element={<React.Suspense fallback={<LoadingFallback />}><CaseIntakeTriagePage /></React.Suspense>} />
                                    <Route path="judgment-validator" element={<Navigate to="validate" replace />} />
                                    <Route path="knowledge" element={<React.Suspense fallback={<LoadingFallback />}><LegalKnowledgeBankPage /></React.Suspense>} />
                                    <Route path="calendar" element={<React.Suspense fallback={<LoadingFallback />}><CourtCalendarPage /></React.Suspense>} />
                                    <Route path="escalation" element={<React.Suspense fallback={<LoadingFallback />}><JudgeEscalationQueuePage /></React.Suspense>} />
                                </Route>
                            </Route>

                            {/* ADMIN ROUTES */}
                            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                                <Route path="/admin" element={<AdminLayout />}>
                                    <Route index element={<Navigate to="dashboard" replace />} />
                                    <Route path="home" element={<Navigate to="/admin/dashboard" replace />} />
                                    <Route path="dashboard" element={<React.Suspense fallback={<LoadingFallback />}><AdminDashboard /></React.Suspense>} />

                                    {/* Registry Automator (Skill 19) */}
                                    <Route path="registry" element={<React.Suspense fallback={<LoadingFallback />}><RegistryDashboard /></React.Suspense>} />
                                    <Route path="registry/batch" element={<React.Suspense fallback={<LoadingFallback />}><RegistryBatchProcessing /></React.Suspense>} />
                                    <Route path="registry/templates" element={<React.Suspense fallback={<LoadingFallback />}><RegistryTemplates /></React.Suspense>} />
                                    <Route path="registry/analytics" element={<React.Suspense fallback={<LoadingFallback />}><RegistryAnalytics /></React.Suspense>} />

                                    {/* Listing Optimizer (Skill 20) */}
                                    <Route path="listing" element={<React.Suspense fallback={<LoadingFallback />}><ListingOptimizer /></React.Suspense>} />
                                    <Route path="listing/multi-court" element={<React.Suspense fallback={<LoadingFallback />}><ListingMultiCourt /></React.Suspense>} />
                                    <Route path="listing/templates" element={<React.Suspense fallback={<LoadingFallback />}><ListingTemplates /></React.Suspense>} />
                                    <Route path="listing/history" element={<React.Suspense fallback={<LoadingFallback />}><ListingHistory /></React.Suspense>} />

                                    {/* Analytics & System */}
                                    <Route path="analysis" element={<React.Suspense fallback={<LoadingFallback />}><DocumentAnalysisPage /></React.Suspense>} />
                                    <Route path="resources" element={<React.Suspense fallback={<LoadingFallback />}><ResourceAllocatorPage /></React.Suspense>} />
                                    <Route path="infrastructure" element={<React.Suspense fallback={<LoadingFallback />}><SystemHealthPage /></React.Suspense>} />
                                    <Route path="audit" element={<React.Suspense fallback={<LoadingFallback />}><ActivityLogPage /></React.Suspense>} />
                                    <Route path="happiness" element={<React.Suspense fallback={<LoadingFallback />}><LitigantHappinessWrapper /></React.Suspense>} />
                                    <Route path="history" element={<React.Suspense fallback={<LoadingFallback />}><HistoryWrapper /></React.Suspense>} />
                                    <Route path="quantum" element={<React.Suspense fallback={<LoadingFallback />}><QuantumVerifyPage /></React.Suspense>} />
                                    <Route path="transition" element={<React.Suspense fallback={<LoadingFallback />}><BNSTransitionPage /></React.Suspense>} />
                                    <Route path="pendency" element={<React.Suspense fallback={<LoadingFallback />}><PendencyMapPage /></React.Suspense>} />
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
                    <Route path="/about" element={<AboutWrapper />} />
                    <Route path="/team" element={<React.Suspense fallback={<LoadingFallback />}><TeamPage /></React.Suspense>} />

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
        <AppErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <Router>
                    <AuthProvider>
                        <ScrollToTop />
                        <AppContent />
                    </AuthProvider>
                </Router>
            </QueryClientProvider>
        </AppErrorBoundary>
    );
};

export default App;
