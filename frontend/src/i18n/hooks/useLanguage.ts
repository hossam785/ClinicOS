import { useContext } from 'react';
import { LocalizationContext } from '../providers/LocalizationProvider';

export const useLanguage = () => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LocalizationProvider');
  }
  return {
    language: context.language,
    direction: context.direction,
    setLanguage: context.setLanguage,
    toggleLanguage: context.toggleLanguage,
    isRTL: context.isRTL
  };
};
