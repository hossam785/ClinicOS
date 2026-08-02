import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { LanguageCode, TextDirection, ILocalizationContextState } from '../types/localization.types';
import { SUPPORTED_LANGUAGES } from '../config/languages.config';
import { LanguageResolver } from '../services/languageResolver';
import arCommon from '../locales/ar/common.json';
import arDashboard from '../locales/ar/dashboard.json';
import enCommon from '../locales/en/common.json';
import enDashboard from '../locales/en/dashboard.json';

export const LocalizationContext = createContext<ILocalizationContextState>({
  language: 'ar',
  direction: 'rtl',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
  isRTL: true
});

const dictionaries: Record<LanguageCode, Record<string, any>> = {
  ar: {
    common: arCommon,
    dashboard: arDashboard
  },
  en: {
    common: enCommon,
    dashboard: enDashboard
  }
};

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => LanguageResolver.resolveInitialLanguage());
  const direction: TextDirection = SUPPORTED_LANGUAGES[language]?.direction || 'rtl';

  const applyDomAttributes = useCallback((lang: LanguageCode, dir: TextDirection) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.style.setProperty('--font-family-primary', SUPPORTED_LANGUAGES[lang].fontFamily);
    }
  }, []);

  useEffect(() => {
    applyDomAttributes(language, direction);
  }, [language, direction, applyDomAttributes]);

  const setLanguage = useCallback((lang: LanguageCode) => {
    setLanguageState(lang);
    LanguageResolver.persistLanguage(lang);
    const newDir = SUPPORTED_LANGUAGES[lang]?.direction || 'rtl';
    applyDomAttributes(lang, newDir);
  }, [applyDomAttributes]);

  const toggleLanguage = useCallback(() => {
    const nextLang: LanguageCode = language === 'ar' ? 'en' : 'ar';
    setLanguage(nextLang);
  }, [language, setLanguage]);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const parts = key.split('.');
    let current: any = dictionaries[language];

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English dictionary
        let fallbackCurrent: any = dictionaries['en'];
        for (const fbPart of parts) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbPart in fallbackCurrent) {
            fallbackCurrent = fallbackCurrent[fbPart];
          } else {
            return key;
          }
        }
        current = fallbackCurrent;
        break;
      }
    }

    if (typeof current === 'string') {
      if (params) {
        let result = current;
        for (const [pKey, pVal] of Object.entries(params)) {
          result = result.replace(new RegExp(`{{${pKey}}}`, 'g'), String(pVal));
        }
        return result;
      }
      return current;
    }

    return key;
  }, [language]);

  return (
    <LocalizationContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        toggleLanguage,
        t,
        isRTL: direction === 'rtl'
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
