// src/pages/TeamPage.tsx
// NyayaSaathiAI - Meet the Team / Authors Page

import { ArrowLeft, Linkedin, GraduationCap, Code2, Scale, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const authors = [
    {
        name: 'Ayush Das',
        role: 'Co-Creator & Full-Stack Developer',
        linkedin: 'https://www.linkedin.com/in/ayush-das-11121a337/',
        avatar: '/ayush-das.jpeg',
        bio: 'Passionate about leveraging AI and modern web technologies to build impactful solutions for India\'s judicial ecosystem.',
        skills: ['React', 'FastAPI', 'AI/ML', 'Blockchain'],
        color: 'orange',
    },
    {
        name: 'Sai Swarup Shroff',
        role: 'Co-Creator & Full-Stack Developer',
        linkedin: 'https://www.linkedin.com/in/sai-swarup-shroff-3b5270322/',
        avatar: '/sai-swarup-shroff.png',
        bio: 'Driven by the vision of accessible justice through technology, specializing in scalable systems and intelligent interfaces.',
        skills: ['TypeScript', 'Python', 'System Design', 'DevOps'],
        color: 'blue',
    },
];

const TeamPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 selection:bg-orange-200">
            {/* Background accents */}
            <div className="absolute top-0 left-1/2 w-[900px] h-[900px] bg-orange-200/30 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 z-0" />
            <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-blue-200/30 rounded-full blur-3xl translate-y-1/3 translate-x-1/4 z-0" />
            <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-200/20 rounded-full blur-3xl -translate-x-1/3 z-0" />

            {/* Navbar */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <img src="/logo.png" alt="NyayaSaathiAI" className="w-8 h-8 rounded-lg" />
                    <span className="text-lg font-bold tracking-tight text-slate-900">NyayaSaathiAI</span>
                </button>
                <div className="text-sm font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">
                    Meet the Team
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 text-center px-6 pt-8 pb-4 md:pt-14 md:pb-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-xs font-bold text-purple-600 uppercase tracking-wide mb-6">
                    <GraduationCap size={14} />
                    Vellore Institute of Technology, Vellore
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-4">
                    Built by{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-500 to-blue-600">
                        Students
                    </span>
                    , for{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Justice.
                    </span>
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    NyayaSaathiAI is crafted by two engineering students who believe technology
                    can transform India's judicial system — making it faster, fairer, and accessible to every citizen.
                </p>
            </section>

            {/* Author Cards */}
            <section className="relative z-10 max-w-5xl mx-auto px-6 py-10 md:py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    {authors.map((author) => (
                        <AuthorCard key={author.name} author={author} />
                    ))}
                </div>
            </section>

            {/* Project Section */}
            <section className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-lg p-8 md:p-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-600 uppercase tracking-wide mb-5">
                        <Scale size={13} />
                        About the Project
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-4">
                        NyayaSaathiAI{' '}
                        <span className="text-slate-400 font-medium">— न्याय साथी AI</span>
                    </h2>
                    <p className="text-slate-500 leading-relaxed max-w-2xl mx-auto mb-6">
                        India's first AI-powered judicial interface that enables citizens to file FIRs via voice,
                        visualize bail conditions, and predict case delays — all secured by a quantum-safe blockchain ledger.
                        Built for the National Hackathon to reimagine how justice is delivered.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {['React + Vite', 'FastAPI', 'PostgreSQL', 'Redis', 'Gemini AI', 'Blockchain', 'Docker'].map((tech) => (
                            <span
                                key={tech}
                                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600"
                            >
                                <Code2 size={11} />
                                {tech}
                            </span>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300"
                    >
                        <Sparkles size={16} />
                        Explore NyayaSaathiAI
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 text-center py-8 text-sm text-slate-400">
                © 2026 NyayaSaathiAI · Built with ❤️ at VIT Vellore
            </footer>
        </div>
    );
};

/* ─── Author Card Component ─── */
const AuthorCard = ({ author }: { author: typeof authors[0] }) => {
    const borderHover = author.color === 'orange'
        ? 'hover:border-orange-400 hover:shadow-orange-500/15'
        : 'hover:border-blue-400 hover:shadow-blue-500/15';

    const gradientBg = author.color === 'orange'
        ? 'from-orange-500 to-amber-500'
        : 'from-blue-500 to-indigo-500';

    const tagBg = author.color === 'orange'
        ? 'bg-orange-50 text-orange-600 border-orange-200'
        : 'bg-blue-50 text-blue-600 border-blue-200';

    return (
        <div
            className={`group bg-white rounded-3xl border border-slate-200 shadow-md p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl ${borderHover}`}
        >
            {/* Avatar + Gradient Ring */}
            <div className="flex justify-center mb-6">
                <div className={`relative p-1 rounded-full bg-gradient-to-br ${gradientBg}`}>
                    <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-28 h-28 rounded-full bg-white border-4 border-white object-cover"
                    />
                    {/* Pulse ring on hover */}
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradientBg} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-700`} />
                </div>
            </div>

            {/* Name & Role */}
            <div className="text-center mb-4">
                <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-1">
                    {author.name}
                </h3>
                <p className="text-sm font-semibold text-slate-400">{author.role}</p>
            </div>

            {/* University */}
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-600 mb-4">
                <GraduationCap size={13} />
                VIT Vellore
            </div>

            {/* Bio */}
            <p className="text-sm text-slate-500 text-center leading-relaxed mb-5">
                {author.bio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
                {author.skills.map((skill) => (
                    <span
                        key={skill}
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tagBg}`}
                    >
                        {skill}
                    </span>
                ))}
            </div>

            {/* LinkedIn Button */}
            <div className="flex justify-center">
                <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r ${gradientBg} text-white text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
                >
                    <Linkedin size={15} />
                    Connect on LinkedIn
                </a>
            </div>
        </div>
    );
};

export default TeamPage;
