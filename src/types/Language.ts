export enum Language {
  PT = 'pt',
  EN = 'en'
}

export const SUPPORTED_LANGUAGES = Object.values(Language);

export const LANGUAGE_CONFIG = {
  [Language.PT]: { code: Language.PT, label: 'pt-BR', flag: '🇧🇷' },
  [Language.EN]: { code: Language.EN, label: 'en-US', flag: '🇺🇸' },
} as const;

export const isValidLanguage = (lang: string): lang is Language => {
  return SUPPORTED_LANGUAGES.includes(lang as Language);
};