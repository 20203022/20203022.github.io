import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import en from '../i18n/en.json';
import zh from '../i18n/zh.json';

const translations = { en, zh };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('lang');
    if (saved && (saved === 'en' || saved === 'zh')) return saved;
    const browserLang = navigator.language || navigator.languages?.[0] || 'en';
    return browserLang.startsWith('zh') ? 'zh' : 'en';
  });

  const setLang = useCallback((l) => {
    setLangState(l);
    localStorage.setItem('lang', l);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === 'en' ? 'zh' : 'en');
  }, [lang, setLang]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useCallback((key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (const k of keys) {
      if (value == null) break;
      value = value[k];
    }
    return value ?? key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
