import type { Request } from 'express';
import type { BackendLanguageCode } from './localization.types';

export class BackendLanguageResolver {
  public static resolveLanguage(req: Request): BackendLanguageCode {
    // 1. Query parameter override (?lang=ar)
    const queryLang = req.query.lang as string;
    if (queryLang === 'ar' || queryLang === 'en') {
      return queryLang;
    }

    // 2. HTTP Accept-Language Header
    const acceptHeader = req.headers['accept-language'];
    if (acceptHeader && acceptHeader.startsWith('ar')) {
      return 'ar';
    }

    // 3. User JWT Token Preference
    const userPref = (req as unknown as { user?: { preferredLanguage?: string } }).user?.preferredLanguage;
    if (userPref === 'ar' || userPref === 'en') {
      return userPref as BackendLanguageCode;
    }

    // 4. Default Fallback
    return 'ar';
  }
}
