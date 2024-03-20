export enum Language {
  English = "en",
  Portuguese = "pt",
}

export const DEFAULT_LANGUAGE = Language.English;

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.English]: "English",
  [Language.Portuguese]: "Português",
};