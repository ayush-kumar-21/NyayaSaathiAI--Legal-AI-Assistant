import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight, LucideIcon } from 'lucide-react';

interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
}

interface NavSection {
    title: string;
    items: NavItem[];
}

interface CollapsibleNavSectionProps {
    section: NavSection;
    isCollapsed: boolean;
}

const CollapsibleNavSection: React.FC<CollapsibleNavSectionProps> = ({ section, isCollapsed }) => {
    const location = useLocation();

    // Auto-expand if a child is active
    const [isOpen, setIsOpen] = useState(
        section.items.some(item => location.pathname.startsWith(item.path))
    );

    // If sidebar is collapsed, we don't show the accordion behavior in the same way,
    // but we still render the items (often as icons only). 
    // However, the design usually implies showing just the icons in a collapsed state.
    // If the sidebar is collapsed, we render items directly without the section header?
    // Or we render the section header as a separator?
    // The prompt's proposed design has logic:
    // "If isCollapsed, render icons centered"

    // Implementation strategy:
    // If collapsed: Render nothing for the header, just render the items as icons.
    // If expanded: Render header with toggle, then items.

    // Wait, if collapsed, we probably want to group them visually or just show them.
    // Let's following the prompt's layout roughly:
    // The prompt's CollapsibleSection code handled both states.

    return (
        <div className="mb-2">
            {!isCollapsed && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full px-4 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider hover:text-slate-300 transition-colors"
                >
                    {section.title}
                    {isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                </button>
            )}

            {/* Separator for collapsed state */}
            {isCollapsed && (
                <div className="px-2 py-2 mt-2 mb-1 border-t border-slate-700/50 first:mt-0 first:border-0">
                    <div className="w-full h-px bg-slate-700/50 mb-2" />
                </div>
            )}

            {(isOpen || isCollapsed) && (
                <nav className="space-y-1">
                    {section.items.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all mx-2
                                ${isActive
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-900/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                                } 
                                ${isCollapsed ? 'justify-center px-2 mx-0' : ''}`
                            }
                            title={isCollapsed ? item.label : undefined}
                        >
                            <item.icon className={`w-4 h-4 flex-shrink-0 ${isCollapsed ? 'w-5 h-5' : ''}`} />
                            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>
            )}
        </div>
    );
};

export default CollapsibleNavSection;
