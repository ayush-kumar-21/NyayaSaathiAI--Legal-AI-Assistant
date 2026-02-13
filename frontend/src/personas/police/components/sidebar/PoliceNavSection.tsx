import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

export interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
    skill?: number | string;
}

export interface NavSection {
    title: string;
    items: NavItem[];
    defaultOpen?: boolean;
}

interface PoliceNavSectionProps {
    section: NavSection;
    isCollapsed: boolean;
}

const PoliceNavSection: React.FC<PoliceNavSectionProps> = ({ section, isCollapsed }) => {
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
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-bold text-blue-400/80 uppercase tracking-widest hover:text-blue-300 transition-colors"
                >
                    <span>{section.title}</span>
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            )}

            {/* Separator for collapsed state */}
            {isCollapsed && (
                <div className="px-2 py-2 mt-2 mb-1 border-t border-blue-900/30 first:mt-0 first:border-0">
                    <div className="w-full h-px bg-blue-500/10 mb-2" />
                </div>
            )}

            {(isOpen || isCollapsed) && (
                <nav className="space-y-1 mt-1">
                    {section.items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative group
                                ${isActive
                                    ? 'bg-blue-600/20 text-blue-300 border-l-2 border-blue-500'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-blue-200'
                                } ${isCollapsed ? 'justify-center px-2' : ''}`
                            }
                            title={isCollapsed ? item.label : undefined}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-blue-300'}`} />

                                    {!isCollapsed && (
                                        <span className="font-medium text-sm">{item.label}</span>
                                    )}

                                    {/* Skill Badge if active and not collapsed */}
                                    {!isCollapsed && item.skill && (
                                        <span className={`absolute right-2 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/20 
                                            ${isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800/50 text-slate-500'}`}>
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

export default PoliceNavSection;
