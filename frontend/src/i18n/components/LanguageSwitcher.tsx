import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { SUPPORTED_LANGUAGES } from '../config/languages.config';
import type { LanguageCode } from '../types/localization.types';

export const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLangInfo = SUPPORTED_LANGUAGES[language];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl + Shift + L
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'L') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:bg-slate-800/80 transition-colors text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        aria-label="Select Application Language"
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-blue-400" />
        <span>{currentLangInfo.nativeName}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-44 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl z-50 py-1 overflow-hidden backdrop-blur-md">
          <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Select Language / اختر اللغة
          </div>
          {(Object.keys(SUPPORTED_LANGUAGES) as LanguageCode[]).map(code => {
            const info = SUPPORTED_LANGUAGES[code];
            const isActive = language === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => handleSelect(code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs transition-colors text-start ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 font-bold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{info.nativeName}</span>
                  <span className="text-[10px] text-slate-500">({info.name})</span>
                </div>
                {isActive && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
