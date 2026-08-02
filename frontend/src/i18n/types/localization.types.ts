export type LanguageCode = 'ar' | 'en';
export type TextDirection = 'rtl' | 'ltr';

export interface ILanguageInfo {
  code: LanguageCode;
  name: string;
  nativeName: string;
  direction: TextDirection;
  fontFamily: string;
  flagCode: string;
}

export type TranslationNamespace =
  | 'common'
  | 'auth'
  | 'dashboard'
  | 'patients'
  | 'appointments'
  | 'medicalRecords'
  | 'prescriptions'
  | 'reports'
  | 'notifications'
  | 'platformControl'
  | 'syncEngine'
  | 'bookingPortal'
  | 'aiAssistant'
  | 'validation'
  | 'errors'
  | 'printing';

export interface ILocalizationContextState {
  language: LanguageCode;
  direction: TextDirection;
  setLanguage: (lang: LanguageCode) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}
