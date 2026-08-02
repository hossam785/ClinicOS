export type BackendLanguageCode = 'ar' | 'en';
export type BackendTextDirection = 'rtl' | 'ltr';

export interface IBackendLocalizationContext {
  language: BackendLanguageCode;
  direction: BackendTextDirection;
  isRTL: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}

declare module 'express-serve-static-core' {
  interface Request {
    localization?: IBackendLocalizationContext;
  }
}
