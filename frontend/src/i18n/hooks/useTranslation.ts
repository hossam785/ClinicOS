import { useContext } from 'react';
import { LocalizationContext } from '../providers/LocalizationProvider';

export const useTranslation = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LocalizationProvider');
  }
  return {
    t: context.t,
    language: context.language,
    direction: context.direction,
    isRTL: context.isRTL
  };
};
