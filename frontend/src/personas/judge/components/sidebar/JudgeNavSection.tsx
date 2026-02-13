import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

export interface NavItem {
    path: string;
    label: string;
    labelHi: string;
    icon: LucideIcon;
    skill?: number | string;
}

export interface NavSection {
    title: string;
    titleHi: string;
    items: NavItem[];
    defaultOpen?: boolean;
}

interface JudgeNavSectionProps {
    section: NavSection;
    isCollapsed: boolean;
}

const JudgeNavSection: React.FC<JudgeNavSectionProps> = ({ section, isCollapsed }) => {
    const location = useLocation();

    // Auto-expand if a child is active or defaultOpen is true
    const [isOpen, setIsOpen] = useState(
        section.defaultOpen || section.items.some(item => location.pathname.startsWith(item.path))
    );

    return (
        <div className="mb-4">
            {!isCollapsed && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-amber-500/80 uppercase tracking-widest hover:text-amber-400 transition-colors"
                    style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
                >
                    <span className="flex flex-col items-start gap-0.5">
                        <span>{section.title}</span>
                        <span className="text-[10px] opacity-60 font-normal">{section.titleHi}</span>
                    </span>
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            )}

            {/* Separator for collapsed state */}
            {isCollapsed && (
                <div className="px-2 py-2 mt-2 mb-1 border-t border-amber-900/30 first:mt-0 first:border-0">
                    <div className="w-full h-px bg-amber-500/10 mb-2" />
                </div>
            )}

            {(isOpen || isCollapsed) && (
                <nav className="space-y-1 mt-1">
                    {section.items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative group
                                ${isActive
                                    ? 'bg-gradient-to-r from-purple-900/40 to-amber-900/40 text-amber-300 border-l-2 border-amber-500 shadow-lg'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-amber-100 hover:translate-x-1'
                                } ${isCollapsed ? 'justify-center px-2 py-3' : ''}`
                            }
                            title={isCollapsed ? `${item.label} (${item.labelHi})` : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-amber-200'}`} />

                                    {!isCollapsed && (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium leading-none">{item.label}</span>
                                            <span className="text-[10px] opacity-50 mt-1 font-serif">{item.labelHi}</span>
                                        </div>
                                    )}

                                    {/* Skill Badge if active and not collapsed */}
                                    {!isCollapsed && item.skill && (
                                        <span className={`absolute right-2 text-[9px] px-1.5 py-0.5 rounded border border-amber-500/20 
                                            ${isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800/50 text-slate-500'}`}>
                                            S{item.skill}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            )}
        </div>
    );
};

export default JudgeNavSection;
