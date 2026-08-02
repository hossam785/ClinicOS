import type { LanguageCode } from '../types/localization.types';

export class LanguageResolver {
  private static STORAGE_KEY = 'clinicos_preferred_language';

  public static resolveInitialLanguage(): LanguageCode {
    // 1. User Preference Local Storage
    const stored = localStorage.getItem(LanguageResolver.STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') {
      return stored;
    }

    // 2. Navigator Browser Default
    if (typeof navigator !== 'undefined') {
      const navLang = navigator.language || (navigator as any).userLanguage || '';
      if (navLang.startsWith('ar')) {
        return 'ar';
      }
    }

    // 3. System Fallback
    return 'ar';
  }

  public static persistLanguage(lang: LanguageCode): void {
    localStorage.setItem(LanguageResolver.STORAGE_KEY, lang);
  }
}
