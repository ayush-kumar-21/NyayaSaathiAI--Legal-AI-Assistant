import React from 'react';
import ParticleHeader from '../../../shared/components/3d/ParticleHeader';
import GlassCard from '../../../shared/components/3d/GlassCard';
import { HelpCircle, Phone, Mail, MessageSquare } from 'lucide-react';

const CitizenSupport: React.FC = () => {
    return (
        <div className="space-y-6">
            <ParticleHeader
                title="Help Center"
                subtitle="24/7 Support & Legal Assistance"
                icon={<HelpCircle className="w-6 h-6 text-cyan-400" />}
                variant="blue"
            />

            <div className="grid md:grid-cols-3 gap-6">
                <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Phone className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">Call Support</h3>
                    <p className="text-slate-400 text-sm mt-2">1800-NYAYA-HELP</p>
                </GlassCard>

                <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <Mail className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">Email Us</h3>
                    <p className="text-slate-400 text-sm mt-2">support@nyaya.gov.in</p>
                </GlassCard>

                <GlassCard className="p-6 text-center hover:scale-105 transition-transform cursor-pointer">
                    <MessageSquare className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white">Live Chat</h3>
                    <p className="text-slate-400 text-sm mt-2">Chat with Legal Asst.</p>
                </GlassCard>
            </div>

            <GlassCard className="p-6 mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <details className="group bg-slate-800/50 rounded-xl">
                        <summary className="flex items-center justify-between p-4 cursor-pointer">
                            <span className="font-medium text-slate-200">How to file a new complaint?</span>
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-slate-400 text-sm">
                            Go to 'Legal Action' in the sidebar and click on "New Complaint". You can use voice or text to file.
                        </div>
                    </details>
                    <details className="group bg-slate-800/50 rounded-xl">
                        <summary className="flex items-center justify-between p-4 cursor-pointer">
                            <span className="font-medium text-slate-200">Is my data secure?</span>
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="p-4 pt-0 text-slate-400 text-sm">
                            Yes, all data is encrypted and stored on the Akhand Ledger blockchain for maximum security.
                        </div>
                    </details>
                </div>
            </GlassCard>
        </div>
    );
};

export default CitizenSupport;
