import type { ILanguageInfo, LanguageCode } from '../types/localization.types';

export const SUPPORTED_LANGUAGES: Record<LanguageCode, ILanguageInfo> = {
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    fontFamily: "'Cairo', 'Readex Pro', sans-serif",
    flagCode: 'EG'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    fontFamily: "'Inter', 'Outfit', sans-serif",
    flagCode: 'US'
  }
};

export const DEFAULT_LANGUAGE: LanguageCode = 'ar';
export const FALLBACK_LANGUAGE: LanguageCode = 'en';
