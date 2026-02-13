import React from 'react';
import ParticleHeader from '../../../shared/components/3d/ParticleHeader';
import GlassCard from '../../../shared/components/3d/GlassCard';
import { User, Shield, Mail, Phone, Lock } from 'lucide-react';

const CitizenProfile: React.FC = () => {
    return (
        <div className="space-y-6">
            <ParticleHeader
                title="My Profile"
                subtitle="Manage your Digital Identity & Preferences"
                icon={<User className="w-6 h-6 text-emerald-400" />}
                variant="emerald"
            />

            <div className="grid md:grid-cols-2 gap-6">
                <GlassCard className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                            <User className="w-8 h-8 text-slate-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Citizen User</h2>
                            <p className="text-slate-400">+91 98765 43210</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                            <span className="text-slate-300">Aadhaar Linked</span>
                            <span className="text-emerald-400 font-bold">Verified</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                            <span className="text-slate-300">Location</span>
                            <span className="text-white">New Delhi, India</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 rounded-xl transition-all text-slate-300">
                        <Lock className="w-5 h-5" /> Privacy & Security
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-white/5 rounded-xl transition-all text-slate-300">
                        <Mail className="w-5 h-5" /> Notification Preferences
                    </button>
                </GlassCard>
            </div>
        </div>
    );
};

export default CitizenProfile;
