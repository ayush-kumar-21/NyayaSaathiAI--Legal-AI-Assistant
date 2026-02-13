import React, { useState, useRef, useEffect } from 'react';
import { Globe, X, Check, ChevronDown } from 'lucide-react';

// All 22 Scheduled Languages of India + English
const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
    { code: 'ks', name: 'Kashmiri', nativeName: 'कॉशुर', flag: '🇮🇳' },
    { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', flag: '🇮🇳' },
    { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', flag: '🇮🇳' },
    { code: 'mni', name: 'Manipuri', nativeName: 'মণিপুরী', flag: '🇮🇳' },
    { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', flag: '🇮🇳' },
    { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', flag: '🇮🇳' },
    { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', flag: '🇮🇳' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', flag: '🇮🇳' },
    { code: 'sat', name: 'Santhali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ', flag: '🇮🇳' },
    { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', flag: '🇮🇳' },
];

const TranslateWidget: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');
    const [searchQuery, setSearchQuery] = useState('');
    const panelRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Close panel on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Trigger Google Translate language change
    const changeLanguage = (langCode: string) => {
        setCurrentLang(langCode);
        setIsOpen(false);
        setSearchQuery('');

        if (langCode === 'en') {
            // Reset to English — remove translation
            const frame = document.querySelector('.goog-te-banner-frame') as HTMLIFrameElement;
            if (frame) {
                const closeBtn = frame.contentDocument?.querySelector('.goog-close-link') as HTMLElement;
                closeBtn?.click();
            }
            // Fallback: set cookie and reload
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
            // Try to find and click the restore button
            const restoreEl = document.getElementById(':1.restore') as HTMLElement;
            if (restoreEl) {
                restoreEl.click();
            } else {
                window.location.reload();
            }
            return;
        }

        // Set translation via Google Translate element
        const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (selectEl) {
            selectEl.value = langCode;
            selectEl.dispatchEvent(new Event('change'));
        } else {
            // Fallback: set cookie and reload
            document.cookie = `googtrans=/en/${langCode}; path=/;`;
            document.cookie = `googtrans=/en/${langCode}; path=/; domain=.${window.location.hostname}`;
            window.location.reload();
        }
    };

    const filteredLanguages = LANGUAGES.filter(lang =>
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentLanguage = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

    return (
        <>
            {/* Floating Translate Button */}
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="translate-fab"
                title="Translate Page"
                aria-label="Translate page"
            >
                <Globe className="w-5 h-5" />
                <span className="translate-fab-label">
                    {currentLanguage.nativeName}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Selection Panel */}
            {isOpen && (
                <div ref={panelRef} className="translate-panel">
                    {/* Panel Header */}
                    <div className="translate-panel-header">
                        <div className="flex items-center gap-2">
                            <Globe className="w-5 h-5 text-emerald-400" />
                            <h3 className="font-semibold text-white text-sm">
                                Translate Page / पृष्ठ अनुवाद
                            </h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 pb-2">
                        <input
                            type="text"
                            placeholder="Search language... / भाषा खोजें..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="translate-search"
                            autoFocus
                        />
                    </div>

                    {/* Language Grid */}
                    <div className="translate-lang-grid">
                        {filteredLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`translate-lang-btn ${currentLang === lang.code ? 'active' : ''}`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <div className="flex flex-col items-start min-w-0">
                                    <span className="text-xs font-medium text-white truncate w-full">
                                        {lang.name}
                                    </span>
                                    <span className="text-[10px] text-gray-400 truncate w-full">
                                        {lang.nativeName}
                                    </span>
                                </div>
                                {currentLang === lang.code && (
                                    <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto flex-shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="translate-panel-footer">
                        <span className="text-[10px] text-gray-500">
                            Powered by Google Translate • 22 Scheduled Languages
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default TranslateWidget;
