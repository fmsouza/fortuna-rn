import { useMemo } from "react";
import _get from 'lodash/get';

import * as Translations from "../transalations";
import { useLocale } from "./useLocale";

function createStringFromTemplate(template: string, variables: Record<string, string>): string {
  return template.replace(new RegExp("\{([^\{]+)\}", "g"), (_unused, varName: string) => variables[varName]);
}

export function useText() {
  const locale = useLocale();
  const contents = useMemo(() => Translations[locale.selectedLanguage], [locale]);

  return function getText(key: string, variables?: Record<string, string>) {
    const text = _get(contents, key);
    if (!text) return key;
    return createStringFromTemplate(text, variables || {});
  };
}