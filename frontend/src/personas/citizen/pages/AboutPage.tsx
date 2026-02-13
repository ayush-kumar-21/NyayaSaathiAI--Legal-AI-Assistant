// src/personas/citizen/pages/AboutPage.tsx
// NyayaSahayak - About Us Page
// Professional, Accessible, Animated - Mission: Justice for All
import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Scale,
    Shield,
    Zap,
    Globe,
    Clock,
    FileText,
    Lock,
    Brain,
    Users,
    CheckCircle,
    XCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
const AboutPage: React.FC = () => {
    const prefersReducedMotion = useReducedMotion();
    // Animation variants with accessibility support
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.15,
                delayChildren: prefersReducedMotion ? 0 : 0.1
            }
        }
    };
    const itemVariants = {
        hidden: {
            opacity: 0,
            y: prefersReducedMotion ? 0 : 30
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: prefersReducedMotion ? 0 : 0.6,
                ease: [0.4, 0, 0.2, 1]
            }
        }
    };
    const cardHoverVariants = {
        rest: { scale: 1 },
        hover: {
            scale: prefersReducedMotion ? 1 : 1.02,
            transition: { duration: 0.3 }
        }
    };
    const pillars = [
        {
            icon: Brain,
            title: 'AI Intelligence',
            description: 'Advanced Large Language Models analyze legal documents, predict case outcomes, and provide instant legal guidance in multiple Indian languages.',
            color: 'from-violet-500 to-purple-600',
            glowColor: 'shadow-violet-500/20'
        },
        {
            icon: Lock,
            title: 'Blockchain Trust',
            description: 'Immutable evidence storage using blockchain technology. Every document, photo, and record is cryptographically secured and tamper-proof.',
            color: 'from-emerald-500 to-cyan-600',
            glowColor: 'shadow-emerald-500/20'
        },
        {
            icon: Zap,
            title: 'Speed & Compliance',
            description: 'Automated BNSS timeline enforcement. Zero-FIR registration in minutes, not days. NyayaPath Timer ensures statutory deadlines are never missed.',
            color: 'from-amber-500 to-orange-600',
            glowColor: 'shadow-amber-500/20'
        },
        {
            icon: Users,
            title: 'Justice for All',
            description: 'Accessible to every citizen regardless of tech literacy. Voice-based FIR filing, multilingual support, and NALSA-integrated free legal aid.',
            color: 'from-rose-500 to-pink-600',
            glowColor: 'shadow-rose-500/20'
        }
    ];
    const oldWayFeatures = [
        'Days waiting at police stations',
        'Complex paperwork and procedures',
        'Evidence tampering risks',
        'Unclear case status updates',
        'Limited legal guidance',
        'Language barriers'
    ];
    const newWayFeatures = [
        'Zero-FIR in under 10 minutes',
        'AI-assisted form completion',
        'Blockchain-secured evidence',
        'Real-time case tracking',
        '24/7 NyayaBot legal assistant',
        'Hindi + 22 regional languages'
    ];
    return (
        <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden" role="main" aria-label="About NyayaSahayak">
            {/* Skip Link for Accessibility */}
            <a
                href="#core-pillars"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-emerald-600 focus:text-white focus:rounded-xl focus:font-bold"
            >
                Skip to core features
            </a>
            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Emerald glow - top left */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px]" aria-hidden="true" />
                {/* Cyan glow - bottom right */}
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" aria-hidden="true" />
                {/* Saffron accent - subtle patriotic hint */}
                <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px]" aria-hidden="true" />
            </div>
            {/* HERO SECTION */}
            <section className="relative px-6 pt-16 pb-12 md:pt-24 md:pb-20" aria-labelledby="hero-heading">
                <motion.div
                    className="max-w-6xl mx-auto text-center"
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: [0.4, 0, 0.2, 1] }}
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
                    >
                        <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                        <span className="text-sm font-semibold text-emerald-400">Government of India Initiative</span>
                    </motion.div>
                    {/* Main Heading */}
                    <h1
                        id="hero-heading"
                        className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                    >
                        <span className="text-white">Justice at the</span>{' '}
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400">
                            Speed of Light
                        </span>
                    </h1>
                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Operationalizing the Bharatiya Nagarik Suraksha Sanhita (BNSS) through
                        <span className="text-emerald-400 font-semibold"> Artificial Intelligence</span> and{' '}
                        <span className="text-cyan-400 font-semibold">Blockchain Technology</span>.
                        Empowering the Citizen, Enabling the State.
                    </p>
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/citizen/file"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1 min-w-[200px] justify-center"
                        >
                            <FileText className="w-5 h-5" aria-hidden="true" />
                            File Zero-FIR Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>
                        <Link
                            to="/citizen/track"
                            className="flex items-center gap-2 px-8 py-4 bg-slate-800/80 hover:bg-slate-700/80 text-white font-semibold rounded-2xl transition-all border border-slate-700 hover:border-slate-600 min-w-[200px] justify-center"
                        >
                            <Clock className="w-5 h-5 text-cyan-400" aria-hidden="true" />
                            Track Your Case
                        </Link>
                    </div>
                    {/* Mission Statement */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: prefersReducedMotion ? 0 : 0.5 }}
                        className="mt-12 p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800 max-w-4xl mx-auto"
                    >
                        <p className="text-slate-300 text-base md:text-lg leading-relaxed">
                            <span className="text-2xl text-emerald-400 font-serif">"</span>
                            Our mission is to solve the <span className="text-white font-semibold">Compliance Crisis</span> in the Indian legal system
                            by enforcing strict timelines and evidence integrity mandated by the new criminal laws.
                            We believe every citizen deserves swift, transparent, and accessible justice.
                            <span className="text-2xl text-emerald-400 font-serif">"</span>
                        </p>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                            <Scale className="w-4 h-4" aria-hidden="true" />
                            <span>Satyameva Jayate — Truth Alone Triumphs</span>
                        </div>
                    </motion.div>
                </motion.div>
            </section>
            {/* PROBLEM VS SOLUTION SECTION */}
            <section className="relative px-6 py-12 md:py-20" aria-labelledby="comparison-heading">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 id="comparison-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Transforming Indian Justice
                        </h2>
                        <p className="text-slate-400">See how NyayaSahayak changes everything</p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                        {/* Old Way */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="p-6 md:p-8 rounded-2xl bg-slate-900/60 border border-slate-800"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-slate-800">
                                    <XCircle className="w-6 h-6 text-red-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-300">The Old Way</h3>
                            </div>
                            <ul className="space-y-4" role="list" aria-label="Problems with traditional system">
                                {oldWayFeatures.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        variants={itemVariants}
                                        className="flex items-start gap-3 text-slate-400"
                                    >
                                        <XCircle className="w-5 h-5 text-red-500/70 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* New Way */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-emerald-950/50 to-cyan-950/50 border border-emerald-500/30"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/20">
                                    <CheckCircle className="w-6 h-6 text-emerald-400" aria-hidden="true" />
                                </div>
                                <h3 className="text-xl font-bold text-white">The NyayaSahayak Way</h3>
                            </div>
                            <ul className="space-y-4" role="list" aria-label="NyayaSahayak solutions">
                                {newWayFeatures.map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        variants={itemVariants}
                                        className="flex items-start gap-3 text-slate-300"
                                    >
                                        <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>
            {/* CORE PILLARS SECTION */}
            <section
                id="core-pillars"
                className="relative px-6 py-12 md:py-20"
                aria-labelledby="pillars-heading"
            >
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 id="pillars-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Four Pillars of{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                                Digital Justice
                            </span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Built on cutting-edge technology to ensure every Indian citizen has access to swift,
                            fair, and transparent justice.
                        </p>
                    </motion.div>
                    <div className="grid md:grid-cols-2 gap-6">
                        {pillars.map((pillar, index) => (
                            <motion.div
                                key={pillar.title}
                                initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{
                                    duration: prefersReducedMotion ? 0 : 0.6,
                                    delay: prefersReducedMotion ? 0 : index * 0.1
                                }}
                                whileHover={prefersReducedMotion ? {} : "hover"}
                                variants={cardHoverVariants}
                                className={`
                  group relative p-6 md:p-8 rounded-2xl 
                  bg-slate-800/60 backdrop-blur-xl 
                  border border-slate-700/50
                  hover:border-slate-600/50 transition-all duration-300
                  cursor-pointer
                `}
                            >
                                {/* Glow effect on hover */}
                                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} aria-hidden="true" />

                                <div className="relative z-10">
                                    <div className={`
                    w-14 h-14 rounded-2xl flex items-center justify-center mb-6
                    bg-gradient-to-br ${pillar.color} shadow-lg ${pillar.glowColor}
                    group-hover:scale-110 transition-transform duration-300
                  `}>
                                        <pillar.icon className="w-7 h-7 text-white" aria-hidden="true" />
                                    </div>

                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                                        {pillar.title}
                                    </h3>

                                    <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                        {pillar.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
            {/* BNSS COMPLIANCE SECTION */}
            <section className="relative px-6 py-12 md:py-20" aria-labelledby="bnss-heading">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: prefersReducedMotion ? 0 : 0.7 }}
                        className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-950/30 to-orange-950/30 border border-amber-500/20"
                    >
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm font-semibold mb-4">
                                    <Shield className="w-4 h-4" aria-hidden="true" />
                                    BNSS 2023 Compliant
                                </div>
                                <h2 id="bnss-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
                                    Enforcing the New Criminal Laws
                                </h2>
                                <p className="text-slate-400 mb-6 leading-relaxed">
                                    The Bharatiya Nagarik Suraksha Sanhita (BNSS) mandates strict timelines for FIR registration,
                                    evidence handling, and case disposal. NyayaSahayak automates these requirements, ensuring
                                    <span className="text-amber-400 font-semibold"> zero compliance violations</span>.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <div className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-sm text-slate-300">
                                        <span className="text-amber-400 font-bold">3 Days</span> - FIR Signing Deadline
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-sm text-slate-300">
                                        <span className="text-amber-400 font-bold">24/7</span> - Zero-FIR Available
                                    </div>
                                    <div className="px-4 py-2 rounded-lg bg-slate-900/60 border border-slate-700 text-sm text-slate-300">
                                        <span className="text-amber-400 font-bold">100%</span> - Evidence Integrity
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square max-w-[300px] mx-auto relative">
                                    {/* Animated circles */}
                                    <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-pulse" aria-hidden="true" />
                                    <div className="absolute inset-4 rounded-full border-2 border-amber-500/30" aria-hidden="true" />
                                    <div className="absolute inset-8 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                                        <Scale className="w-20 h-20 text-amber-400" aria-hidden="true" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
            {/* CALL TO ACTION */}
            <section className="relative px-6 py-16 md:py-24" aria-labelledby="cta-heading">
                <motion.div
                    initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <Globe className="w-16 h-16 text-emerald-400 mx-auto mb-6" aria-hidden="true" />
                    <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Justice Should Know No Boundaries
                    </h2>
                    <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
                        Whether you're in a metro city or rural village, NyayaSahayak brings the power of
                        AI and blockchain to your fingertips. Your right to swift justice is now a reality.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/citizen/home"
                            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/25 hover:-translate-y-1"
                        >
                            Get Started Now
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                        </Link>
                        <a
                            href="tel:100"
                            className="flex items-center gap-2 px-8 py-4 bg-red-600/90 hover:bg-red-500 text-white font-bold rounded-2xl transition-all"
                        >
                            Emergency: Call 100
                        </a>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-800">
                        <p className="text-sm text-slate-500">
                            A Government of India Initiative | Ministry of Home Affairs | Digital India
                        </p>
                        <p className="text-xs text-slate-600 mt-2">
                            © 2024 NyayaSahayak. Empowering Citizens, Enabling Justice.
                        </p>
                    </div>
                </motion.div>
            </section>
        </main>
    );
};
export default AboutPage;
