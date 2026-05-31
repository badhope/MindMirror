import en from './en';
import zh from './zh';

export type Locale = 'en' | 'zh';
export type Translations = typeof en;

const translations: Record<Locale, Translations> = {
  en,
  zh
};

export function getTranslation(locale: Locale): Translations {
  return translations[locale] || translations.en;
}

export function t(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value: any = translations[locale] || translations.en;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return String(params[paramKey] || '');
    });
  }
  
  return value;
}
