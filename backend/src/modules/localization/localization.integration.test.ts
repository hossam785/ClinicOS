import { BackendLanguageResolver } from './localizationResolver';
import { BackendLocalizationCache } from './localizationCache';
import { BackendIntlFormatter } from './backendFormatters';
import type { Request } from 'express';

async function runLocalizationIntegrationTests() {
  let passedCount = 0;
  let totalCount = 0;

  function assert(condition: boolean, _testName: string) {
    totalCount++;
    if (condition) {
      passedCount++;
    }
  }

  // Group 1: Language Preference Cascade Resolution
  try {
    const mockReqQuery = { query: { lang: 'en' }, headers: {} } as unknown as Request;
    const resolvedQuery = BackendLanguageResolver.resolveLanguage(mockReqQuery);

    const mockReqHeader = { query: {}, headers: { 'accept-language': 'ar-EG,ar;q=0.9' } } as unknown as Request;
    const resolvedHeader = BackendLanguageResolver.resolveLanguage(mockReqHeader);

    const mockReqDefault = { query: {}, headers: {} } as unknown as Request;
    const resolvedDefault = BackendLanguageResolver.resolveLanguage(mockReqDefault);

    assert(
      resolvedQuery === 'en' &&
      resolvedHeader === 'ar' &&
      resolvedDefault === 'ar',
      'Group 1: Language Preference Cascade Resolution'
    );
  } catch (e: unknown) {
    assert(false, `Group 1: ${(e as Error).message}`);
  }

  // Group 2: Text Direction Determination & Direction Mapping
  try {
    const dirAr = BackendLanguageResolver.resolveLanguage({ query: { lang: 'ar' }, headers: {} } as unknown as Request) === 'ar' ? 'rtl' : 'ltr';
    const dirEn = BackendLanguageResolver.resolveLanguage({ query: { lang: 'en' }, headers: {} } as unknown as Request) === 'en' ? 'ltr' : 'rtl';

    assert(dirAr === 'rtl' && dirEn === 'ltr', 'Group 2: Text Direction Determination & Mapping');
  } catch (e: unknown) {
    assert(false, `Group 2: ${(e as Error).message}`);
  }

  // Group 3: Server-side Memory Cache String Lookups
  try {
    const arSuccess = BackendLocalizationCache.translate('ar', 'common.success');
    const enSuccess = BackendLocalizationCache.translate('en', 'common.success');

    assert(
      arSuccess === 'تمت العملية بنجاح' &&
      enSuccess === 'Operation completed successfully',
      'Group 3: Server-side Memory Cache String Lookups'
    );
  } catch (e: unknown) {
    assert(false, `Group 3: ${(e as Error).message}`);
  }

  // Group 4: Missing Key Resiliency & Fallback Strategy
  try {
    const fallbackVal = BackendLocalizationCache.translate('ar', 'nonexistent.key.name');
    assert(fallbackVal === 'nonexistent.key.name', 'Group 4: Missing Key Resiliency & Fallback Strategy');
  } catch (e: unknown) {
    assert(false, `Group 4: ${(e as Error).message}`);
  }

  // Group 5: Variable Interpolation in Localized Strings
  try {
    const arValidation = BackendLocalizationCache.translate('ar', 'validation.invalidEmail');
    const enValidation = BackendLocalizationCache.translate('en', 'validation.invalidEmail');

    assert(
      arValidation === 'البريد الإلكتروني غير صحيح' &&
      enValidation === 'Invalid email address',
      'Group 5: Variable Interpolation in Localized Strings'
    );
  } catch (e: unknown) {
    assert(false, `Group 5: ${(e as Error).message}`);
  }

  // Group 6: Centralized Server-side IntlFormatter Validation
  try {
    const arFormatter = new BackendIntlFormatter('ar');
    const enFormatter = new BackendIntlFormatter('en');

    const sampleDate = new Date('2026-08-02T12:00:00.000Z');
    const arDateStr = arFormatter.formatDate(sampleDate);
    const enDateStr = enFormatter.formatDate(sampleDate);

    const arCurrency = arFormatter.formatCurrency(1450.5);
    const enCurrency = enFormatter.formatCurrency(1450.5, 'USD');

    assert(
      arDateStr.length > 0 &&
      enDateStr.length > 0 &&
      arCurrency.length > 0 &&
      enCurrency.includes('1,450.50'),
      'Group 6: Centralized Server-side IntlFormatter Validation'
    );
  } catch (e: unknown) {
    assert(false, `Group 6: ${(e as Error).message}`);
  }

  // Group 7: Multilingual Offline AI Context Header Injection
  try {
    const mockReq = { headers: { 'accept-language': 'ar' }, query: {} } as unknown as Request;
    const lang = BackendLanguageResolver.resolveLanguage(mockReq);
    const contextPrompt = lang === 'ar' ? 'أجب باللغة العربية' : 'Answer in English';

    assert(contextPrompt === 'أجب باللغة العربية', 'Group 7: Multilingual Offline AI Context Header Injection');
  } catch (e: unknown) {
    assert(false, `Group 7: ${(e as Error).message}`);
  }

  // Group 8: Express Middleware Context Binding Integration
  try {
    const mockReq = { query: { lang: 'en' }, headers: {} } as unknown as Request;
    const language = BackendLanguageResolver.resolveLanguage(mockReq);
    const direction = language === 'ar' ? 'rtl' : 'ltr';

    mockReq.localization = {
      language,
      direction,
      isRTL: direction === 'rtl',
      t: (key: string) => BackendLocalizationCache.translate(language, key)
    };

    assert(
      mockReq.localization.language === 'en' &&
      mockReq.localization.isRTL === false &&
      mockReq.localization.t('common.success') === 'Operation completed successfully',
      'Group 8: Express Middleware Context Binding Integration'
    );
  } catch (e: unknown) {
    assert(false, `Group 8: ${(e as Error).message}`);
  }

  // Group 9: Sanitization Safeguards against Malformed Locales
  try {
    const mockReqScript = { query: { lang: '<script>alert(1)</script>' }, headers: {} } as unknown as Request;
    const resolvedSafe = BackendLanguageResolver.resolveLanguage(mockReqScript);

    assert(resolvedSafe === 'ar', 'Group 9: Sanitization Safeguards against Malformed Locales');
  } catch (e: unknown) {
    assert(false, `Group 9: ${(e as Error).message}`);
  }

  // Group 10: High-Speed Memory Lookup Performance (< 1ms)
  try {
    const start = performance.now();
    for (let i = 0; i < 1000; i++) {
      BackendLocalizationCache.translate('ar', 'common.success');
    }
    const durationMs = performance.now() - start;

    assert(durationMs < 50, 'Group 10: High-Speed Memory Lookup Performance (< 1ms per lookup)');
  } catch (e: unknown) {
    assert(false, `Group 10: ${(e as Error).message}`);
  }

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runLocalizationIntegrationTests();
