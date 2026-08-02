import { useContext, useMemo } from 'react';
import { LocalizationContext } from '../providers/LocalizationProvider';
import { IntlFormatterService } from '../utils/formatters';

export const useFormatter = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useFormatter must be used within a LocalizationProvider');
  }

  const formatter = useMemo(() => new IntlFormatterService(context.language), [context.language]);

  return {
    formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => formatter.formatDate(date, options),
    formatTime: (date: Date | string, options?: Intl.DateTimeFormatOptions) => formatter.formatTime(date, options),
    formatCurrency: (amount: number, currency?: string) => formatter.formatCurrency(amount, currency),
    formatNumber: (value: number) => formatter.formatNumber(value)
  };
};
