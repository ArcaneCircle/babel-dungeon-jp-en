import es from "./langs/es.json";
import de from "./langs/de.json";
const langs = { es, de };

type LangCode = keyof typeof langs;
type TranslationKey = keyof (typeof langs)[LangCode];
const lang = ((window.navigator && window.navigator.language) || "en")
  .split("-")[0]
  .toLowerCase() as LangCode;

export function _(key: TranslationKey): string {
  return (langs[lang] || {})[key] || key;
}
