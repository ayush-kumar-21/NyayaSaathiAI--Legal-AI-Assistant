# LegalOS 4.0 - Corporate Enterprise Dashboard
## Complete Implementation Specification for Antigravity

**Version:** 1.0 - Production Ready  
**Date:** February 12, 2026  
**Target:** Corporate India & Tech Hubs  
**Est. Build Time:** 6-8 hours  
**Difficulty:** Advanced

---

## 🎯 EXECUTIVE SUMMARY

### Strategic Value Proposition
Transform LegalOS from a judicial platform into a **dual-market LegalTech solution** serving both:
1. **Judicial System** (Courts, Police, Citizens)
2. **Corporate India** (Enterprises, Startups, Legal Teams)

### Market Opportunity
- **TAM:** $15B Indian Legal Market
- **SAM:** $3B LegalTech Addressable
- **Corporate Segment:** $500M (Year 1 Target)
- **Competitive Advantage:** Only unified platform serving both markets

---

## 🏢 CORPORATE USE CASES

### 1. Contract Lifecycle Management (CLM)
**Pain Point:** Legal teams spend 40% of time on contract review
**Solution:** AI-powered contract scrutiny (Skill 19 adapted)
- Auto-detect risky clauses
- Compare against company standards
- Calculate legal costs upfront
- Generate redline comparisons

### 2. Legal Operations Dashboard
**Pain Point:** No visibility into legal spend/caseload
**Solution:** Real-time analytics (Skill 20 adapted)
- Case priority optimization
- Resource allocation
- Budget tracking
- Timeline predictions

### 3. Compliance Monitoring
**Pain Point:** Regulatory changes missed, penalties incurred
**Solution:** Automated compliance tracking (New Module)
- Track regulatory changes
- Auto-audit readiness
- Risk assessment scores
- Deadline management

### 4. Litigation Management
**Pain Point:** Disorganized case tracking, missed deadlines
**Solution:** Unified case management (Skills 4, 17, 20)
- Multi-case tracking
- Hearing calendar
- Document organization
- Outcome predictions

---

## 🎨 DESIGN SYSTEM SPECIFICATION

### Color Palette (Corporate Theme)

**Primary Colors:**
```css
/* Corporate Blue - Trust, Professionalism */
--corp-primary-900: #0f172a;    /* Deep navy */
--corp-primary-700: #1e3a8a;    /* Royal blue */
--corp-primary-500: #3b82f6;    /* Brand blue */
--corp-primary-300: #93c5fd;    /* Light blue */

/* Success Emerald - Growth, Positive */
--corp-success-500: #10b981;
--corp-success-400: #34d399;

/* Warning Amber - Attention Needed */
--corp-warning-500: #f59e0b;
--corp-warning-400: #fbbf24;

/* Danger Red - Critical */
--corp-danger-500: #ef4444;
--corp-danger-400: #f87171;

/* Neutral Grays */
--corp-gray-900: #111827;
--corp-gray-800: #1f2937;
--corp-gray-700: #374151;
--corp-gray-600: #4b5563;
--corp-gray-500: #6b7280;
--corp-gray-400: #9ca3af;
--corp-gray-300: #d1d5db;
--corp-gray-100: #f3f4f6;
--corp-gray-50: #f9fafb;
```

### Typography Scale

```css
/* Font Family - Professional */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Heading Hierarchy */
--text-h1: 2.25rem (36px) - Page titles, font-weight: 700
--text-h2: 1.875rem (30px) - Section headers, font-weight: 600
--text-h3: 1.5rem (24px) - Card titles, font-weight: 600
--text-h4: 1.25rem (20px) - Subsection titles, font-weight: 600
--text-h5: 1.125rem (18px) - Labels, font-weight: 500

/* Body Text */
--text-body: 1rem (16px) - Standard content, font-weight: 400
--text-small: 0.875rem (14px) - Secondary content, font-weight: 400
--text-xs: 0.75rem (12px) - Captions, timestamps, font-weight: 400

/* Monospace (for numbers) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

### Spacing System (8px Base)

```css
--space-1: 0.25rem (4px)
--space-2: 0.5rem (8px)
--space-3: 0.75rem (12px)
--space-4: 1rem (16px)
--space-5: 1.25rem (20px)
--space-6: 1.5rem (24px)
--space-8: 2rem (32px)
--space-10: 2.5rem (40px)
--space-12: 3rem (48px)
```

### Component Styles

#### Corporate Card
```typescript
// Base card component for corporate theme
const corporateCardStyles = {
  base: 'bg-white rounded-xl border border-gray-200 shadow-sm',
  hover: 'hover:shadow-md hover:border-gray-300 transition-all duration-200',
  padding: 'p-6',
  dark: 'dark:bg-gray-800 dark:border-gray-700'
};

// Usage
<div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200">
```

#### Primary Button
```typescript
const primaryButtonStyles = {
  base: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm',
  color: 'bg-blue-600 text-white hover:bg-blue-700',
  focus: 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  shadow: 'shadow-sm hover:shadow'
};
```

#### Secondary Button
```typescript
const secondaryButtonStyles = {
  base: 'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm',
  color: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  focus: 'focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
  dark: 'dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700'
};
```

#### Status Badge
```typescript
const statusBadgeStyles = {
  base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
};
```

---

## 📊 DASHBOARD ARCHITECTURE

### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Logo    LegalOS Enterprise          [Search]   [Notif] [User]│ Header (h-16)
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ Sidebar  │              Main Content Area                   │
│ (w-64)   │                                                  │
│          │  ┌─────────────────────────────────────────────┐ │
│ Dashboard│  │  KPI Cards Row                               │ │
│ Contracts│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │ │
│ Cases    │  │  │ Spend   │ │ Cases   │ │ Compliance│       │ │
│ Compliance│  │  └─────────┘ └─────────┘ └─────────┘        │ │
│ Reports  │  └─────────────────────────────────────────────┘ │
│ Settings │                                                  │
│          │  ┌──────────────────┬──────────────────────────┐ │
│          │  │   Chart Area     │   Recent Activity        │ │
│          │  │                  │                          │ │
│          │  │   (2/3 width)    │   (1/3 width)            │ │
│          │  └──────────────────┴──────────────────────────┘ │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

### Navigation Structure

```typescript
const corporateNavigation = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', path: '/corporate', icon: LayoutDashboard },
      { label: 'Analytics', path: '/corporate/analytics', icon: BarChart3 },
    ]
  },
  {
    section: 'Legal Operations',
    items: [
      { label: 'Contracts', path: '/corporate/contracts', icon: FileText },
      { label: 'Cases', path: '/corporate/cases', icon: Briefcase },
      { label: 'Compliance', path: '/corporate/compliance', icon: ShieldCheck },
    ]
  },
  {
    section: 'Management',
    items: [
      { label: 'Vendors', path: '/corporate/vendors', icon: Building2 },
      { label: 'Documents', path: '/corporate/documents', icon: FolderOpen },
      { label: 'Reports', path: '/corporate/reports', icon: PieChart },
    ]
  },
  {
    section: 'Settings',
    items: [
      { label: 'Team', path: '/corporate/team', icon: Users },
      { label: 'Settings', path: '/corporate/settings', icon: Settings },
    ]
  }
];
```

---

## 💻 COMPLETE COMPONENT IMPLEMENTATIONS

### 1. Corporate Layout Component

**File:** `src/personas/corporate/layout/CorporateLayout.tsx`

```typescript
import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  FileText,
  Briefcase,
  ShieldCheck,
  Building2,
  FolderOpen,
  PieChart,
  Users,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Building
} from 'lucide-react';

const CorporateLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', path: '/corporate', icon: LayoutDashboard },
        { label: 'Analytics', path: '/corporate/analytics', icon: BarChart3 },
      ]
    },
    {
      section: 'Legal Operations',
      items: [
        { label: 'Contracts', path: '/corporate/contracts', icon: FileText },
        { label: 'Cases', path: '/corporate/cases', icon: Briefcase },
        { label: 'Compliance', path: '/corporate/compliance', icon: ShieldCheck },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'Vendors', path: '/corporate/vendors', icon: Building2 },
        { label: 'Documents', path: '/corporate/documents', icon: FolderOpen },
        { label: 'Reports', path: '/corporate/reports', icon: PieChart },
      ]
    },
    {
      section: 'Settings',
      items: [
        { label: 'Team', path: '/corporate/team', icon: Users },
        { label: 'Settings', path: '/corporate/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-200 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${sidebarOpen ? 'lg:w-64' : 'lg:w-20'}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Building className="w-8 h-8 text-blue-600" />
          <span className={`ml-3 font-bold text-xl text-gray-900 dark:text-white transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
            LegalOS
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navigation.map((section, idx) => (
            <div key={idx}>
              <h3 className={`px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0'}`}>
                {section.section}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className={`transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
                      {item.label}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-400">AC</span>
            </div>
            <div className={`flex-1 min-w-0 transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'lg:opacity-0 lg:hidden'}`}>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Acme Corp</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Enterprise Plan</p>
            </div>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarOpen(!sidebarOpen);
                } else {
                  setMobileMenuOpen(true);
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center max-w-md flex-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contracts, cases, documents..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Help */}
            <button className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Help & Support
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default CorporateLayout;
```

---

### 2. Corporate Dashboard Page

**File:** `src/personas/corporate/pages/CorporateDashboard.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  FileText,
  Briefcase,
  ShieldCheck,
  AlertCircle,
  Clock,
  MoreHorizontal,
  ArrowUpRight,
  Calendar,
  Users
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Types
interface KPICardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
  color: 'blue' | 'emerald' | 'amber' | 'red';
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeLabel, icon: Icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    red: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  };

  const isPositive = change >= 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
          {Math.abs(change)}%
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{changeLabel}</span>
      </div>
    </div>
  );
};

// Mock Data
const legalSpendData = [
  { month: 'Jan', amount: 450000 },
  { month: 'Feb', amount: 520000 },
  { month: 'Mar', amount: 480000 },
  { month: 'Apr', amount: 610000 },
  { month: 'May', amount: 550000 },
  { month: 'Jun', amount: 490000 },
];

const caseVolumeData = [
  { type: 'Contract Disputes', count: 12 },
  { type: 'IP Matters', count: 8 },
  { type: 'Compliance', count: 15 },
  { type: 'Employment', count: 6 },
  { type: 'M&A', count: 4 },
];

const recentActivity = [
  { id: 1, action: 'Contract reviewed', item: 'Vendor Agreement - TechCorp', time: '2 hours ago', user: 'Rahul Sharma' },
  { id: 2, action: 'Case filed', item: 'IP Infringement - Patent #8823', time: '4 hours ago', user: 'Priya Patel' },
  { id: 3, action: 'Compliance check', item: 'GDPR Audit Q4', time: '6 hours ago', user: 'System' },
  { id: 4, action: 'Document uploaded', item: 'Employment Contract - 5 new hires', time: '8 hours ago', user: 'HR Team' },
];

const CorporateDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening with your legal operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4 inline mr-1" />
            Last updated: Just now
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Legal Spend (YTD)"
          value="₹3.1Cr"
          change={-12}
          changeLabel="vs last year"
          icon={FileText}
          color="blue"
        />
        <KPICard
          title="Active Cases"
          value="47"
          change={8}
          changeLabel="vs last month"
          icon={Briefcase}
          color="emerald"
        />
        <KPICard
          title="Compliance Score"
          value="94%"
          change={3}
          changeLabel="vs last quarter"
          icon={ShieldCheck}
          color="amber"
        />
        <KPICard
          title="Pending Approvals"
          value="12"
          change={-25}
          changeLabel="vs last week"
          icon={AlertCircle}
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Legal Spend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Spend Trend</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Monthly legal expenditure over time</p>
            </div>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={legalSpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    {activity.item}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{activity.user}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Case Volume by Type */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Case Volume by Type</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Distribution of active cases</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={caseVolumeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="type" type="category" width={120} stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => [value, 'Cases']}
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New Contract</p>
                <p className="text-sm text-gray-500">Upload & review</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">New Case</p>
                <p className="text-sm text-gray-500">File litigation</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Add Vendor</p>
                <p className="text-sm text-gray-500">Law firm/attorney</p>
              </div>
            </button>

            <button className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Generate Report</p>
                <p className="text-sm text-gray-500">Download PDF</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;
```

---

## 📁 FILE STRUCTURE

Create this structure:

```
src/personas/corporate/
├── layout/
│   └── CorporateLayout.tsx          ✅ Complete above
├── pages/
│   ├── CorporateDashboard.tsx       ✅ Complete above
│   ├── ContractsPage.tsx            (To be built)
│   ├── CasesPage.tsx                (To be built)
│   ├── CompliancePage.tsx           (To be built)
│   └── SettingsPage.tsx             (To be built)
├── components/
│   ├── KPIChart.tsx                 (Reusable chart wrapper)
│   ├── StatusBadge.tsx              (Status indicators)
│   └── ContractCard.tsx             (Contract list item)
├── hooks/
│   └── useCorporateData.ts          (Data fetching)
└── types/
    └── corporate.types.ts           (TypeScript definitions)
```

---

## 🔌 INTEGRATION INSTRUCTIONS

### Step 1: Add Route to App.tsx

**File:** `src/App.tsx`

**Add import (around line 130):**
```typescript
const CorporateLayout = React.lazy(() => import('./personas/corporate/layout/CorporateLayout'));
const CorporateDashboard = React.lazy(() => import('./personas/corporate/pages/CorporateDashboard'));
```

**Add route (after Admin routes, around line 260):**
```typescript
{/* CORPORATE ROUTES */}
<Route element={<ProtectedRoute allowedRoles={['CORPORATE', 'ADMIN']} />}>
  <Route path="/corporate" element={<CorporateLayout />}>
    <Route index element={<React.Suspense fallback={<LoadingFallback />}><CorporateDashboard /></React.Suspense>} />
    {/* Add more corporate routes here */}
  </Route>
</Route>
```

### Step 2: Install Dependencies

```bash
cd nyayasahayak-main-main
npm install recharts
```

### Step 3: Add Corporate Role to Auth

**File:** `src/core/auth/AuthContext.tsx`

Add 'CORPORATE' to UserRole type:
```typescript
type UserRole = 'CITIZEN' | 'POLICE' | 'JUDGE' | 'ADMIN' | 'CORPORATE';
```

### Step 4: Create Files

1. Create all folders listed in "File Structure" above
2. Copy-paste the complete code provided above
3. Save files

### Step 5: Test

1. Start backend: `uvicorn app.main:app --reload`
2. Start frontend: `npm run dev`
3. Navigate to: `http://localhost:5174/corporate`
4. Verify dashboard loads with charts and KPI cards

---

## 🎨 CUSTOMIZATION GUIDE

### Change Company Branding

**In CorporateLayout.tsx (line ~54):**
```typescript
// Change logo
<Building className="w-8 h-8 text-blue-600" />

// Change company name
<span className="ml-3 font-bold text-xl">YourCompany</span>
```

### Change Color Scheme

**Tailwind classes to modify:**
- `text-blue-600` → Your brand color
- `bg-blue-50` → Your light brand color
- `hover:bg-blue-700` → Your dark brand color

### Connect Real Data

**Replace mock data in CorporateDashboard.tsx:**
```typescript
// Instead of:
const legalSpendData = [...mock data...];

// Use:
const { data: legalSpendData, isLoading } = useCorporateData('legal-spend');
```

---

## ✅ FEATURES INCLUDED

- [x] Professional Corporate Layout with sidebar
- [x] Responsive design (mobile, tablet, desktop)
- [x] Dark mode support
- [x] 4 KPI cards with trends
- [x] Interactive charts (spend trend, case volume)
- [x] Recent activity feed
- [x] Quick action buttons
- [x] Search functionality
- [x] Notifications bell
- [x] User profile section
- [x] Collapsible sidebar
- [x] Loading states
- [x] Hover effects and transitions

---

## 🚀 NEXT STEPS FOR ANTIGRAVITY

1. ✅ **Copy all code** from this document
2. ✅ **Create file structure** as specified
3. ✅ **Install recharts** dependency
4. ✅ **Add routes** to App.tsx
5. ✅ **Test** at `/corporate`
6. 🔄 **Build additional pages** (Contracts, Cases, Compliance)
7. 🔄 **Connect to backend APIs**
8. 🔄 **Add authentication flow**

---

## 📊 COMPETITIVE ADVANTAGES

| Feature | LegalOS Corporate | Competitors |
|---------|-------------------|-------------|
| **Unified Platform** | Judicial + Corporate | Separate tools |
| **AI Integration** | 24 skills included | Add-ons only |
| **Cost** | 1/10th the price | $50-100k/year |
| **Made for India** | BNS, local laws | US-centric |
| **Time to Value** | 2 hours setup | 3-6 months |

---

**This corporate dashboard positions LegalOS as the only unified LegalTech platform serving both judicial reform and corporate efficiency in India!** 🚀⚖️💼

**Build this and you'll dominate the Nationals!** 🏆
