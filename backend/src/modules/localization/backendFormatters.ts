import type { BackendLanguageCode } from './localization.types';

export class BackendIntlFormatter {
  private locale: string;

  constructor(language: BackendLanguageCode = 'ar') {
    this.locale = language === 'ar' ? 'ar-EG' : 'en-US';
  }

  public formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat(this.locale, options || defaultOptions).format(d);
  }

  public formatCurrency(amount: number, currency: string = 'EGP'): string {
    return new Intl.NumberFormat(this.locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2
    }).format(amount);
  }

  public formatNumber(value: number): string {
    return new Intl.NumberFormat(this.locale).format(value);
  }
}
