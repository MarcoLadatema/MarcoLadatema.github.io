import tr from "./tr.json";
import en from "./en.json";
import type { Dil } from "../i18n/çeviriAraçları";

/**
 * Rehberin çevirileri ana `tr.json` / `en.json` dosyalarına karışmaz; dil
 * türü ise ana siteden alınır — bağımlılık tek yönlüdür (karar 2).
 */
const çeviriler = { tr, en };

export function rehberÇevirisi(dil: Dil) {
  return çeviriler[dil];
}
