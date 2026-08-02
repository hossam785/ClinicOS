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
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef} className={className}>
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '10px',
          backgroundColor: '#1e293b',
          border: '1px solid #334155',
          color: '#f8fafc',
          cursor: 'pointer',
          fontSize: '0.8125rem',
          fontWeight: 600,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
        aria-label="Select Application Language"
        aria-expanded={isOpen}
      >
        <Globe size={16} color="#3b82f6" />
        <span>{currentLangInfo.nativeName}</span>
        <ChevronDown
          size={14}
          color="#94a3b8"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 200ms ease',
          }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: '6px',
            width: '170px',
            borderRadius: '12px',
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            overflow: 'hidden',
            padding: '4px 0',
          }}
        >
          <div
            style={{
              padding: '6px 12px',
              borderBottom: '1px solid #334155',
              fontSize: '10px',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
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
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  color: isActive ? '#60a5fa' : '#cbd5e1',
                  backgroundColor: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'start',
                  fontWeight: isActive ? 700 : 400,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{info.nativeName}</span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>({info.name})</span>
                </div>
                {isActive && <Check size={14} color="#60a5fa" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
