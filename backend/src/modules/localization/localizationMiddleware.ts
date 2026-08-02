import type { Request, Response, NextFunction } from 'express';
import { BackendLanguageResolver } from './localizationResolver';
import { BackendLocalizationCache } from './localizationCache';
import type { BackendTextDirection } from './localization.types';

export const localizationMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
  const language = BackendLanguageResolver.resolveLanguage(req);
  const direction: BackendTextDirection = language === 'ar' ? 'rtl' : 'ltr';

  req.localization = {
    language,
    direction,
    isRTL: direction === 'rtl',
    t: (key: string, params?: Record<string, string | number>) =>
      BackendLocalizationCache.translate(language, key, params)
  };

  next();
};
