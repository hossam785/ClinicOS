import type { BackendLanguageCode } from './localization.types';

export class BackendLocalizationCache {
  private static dictionaries: Record<BackendLanguageCode, Record<string, unknown>> = {
    ar: {
      common: {
        success: 'تمت العملية بنجاح',
        error: 'حدث خطأ غير متوقع',
        unauthorized: 'غير مصرح بالوصول',
        forbidden: 'الوصول محظور بحسب صلاحيات المنصة'
      },
      validation: {
        invalidEmail: 'البريد الإلكتروني غير صحيح',
        requiredField: 'هذا الحقل مطلوب'
      }
    },
    en: {
      common: {
        success: 'Operation completed successfully',
        error: 'An unexpected error occurred',
        unauthorized: 'Unauthorized access',
        forbidden: 'Access forbidden by platform policy'
      },
      validation: {
        invalidEmail: 'Invalid email address',
        requiredField: 'This field is required'
      }
    }
  };

  public static translate(
    lang: BackendLanguageCode,
    key: string,
    params?: Record<string, string | number>
  ): string {
    const parts = key.split('.');
    let current: unknown = BackendLocalizationCache.dictionaries[lang];

    for (const part of parts) {
      if (current && typeof current === 'object' && part in (current as Record<string, unknown>)) {
        current = (current as Record<string, unknown>)[part];
      } else {
        // Fallback to English
        let fallbackCurrent: unknown = BackendLocalizationCache.dictionaries.en;
        for (const fbPart of parts) {
          if (fallbackCurrent && typeof fallbackCurrent === 'object' && fbPart in (fallbackCurrent as Record<string, unknown>)) {
            fallbackCurrent = (fallbackCurrent as Record<string, unknown>)[fbPart];
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
  }
}
