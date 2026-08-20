import type { Dil } from "../i18n/çeviriAraçları";

/**
 * Lisans metinleri. Bunlar arayüz kopyası değil hukuki metindir; bu yüzden
 * `tr.json` / `en.json` içinde değil burada durur ve tek noktadan yönetilir.
 * Politika: Documentation/Decisions/LisansPolitikası.md
 */

/** Rehberin fan içeriği olarak adı; kalıptaki başlık yerine geçer. */
const ESER_ADI = "Baldur's Gate 3 Rehberi";

/**
 * WotC Fan Content Policy'nin yayımladığı kalıp, özgün hâliyle.
 * DEĞİŞTİRİLMEZ — politika bu metni birebir veriyor.
 */
export const WOTC_KALIBI = `${ESER_ADI} is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC`;

/**
 * Kalıbın dile göre karşılığı. Politika bildirimin dilini kısıtlamıyor ve
 * çeviriyi yasaklamıyor, bu yüzden Türkçe sayfada Türkçe gösterilir.
 * İngilizce karşılık özgün kalıbın kendisidir.
 */
const wotcBildirimleri: Record<Dil, string> = {
  tr: `${ESER_ADI}, Fan Content Policy kapsamında izin verilen, resmî olmayan hayran içeriğidir. Wizards tarafından onaylanmamış veya desteklenmemiştir. Kullanılan materyallerin bir bölümü Wizards of the Coast'un mülkiyetindedir. ©Wizards of the Coast LLC`,
  en: WOTC_KALIBI,
};

export function wotcBildirimi(dil: Dil): string {
  return wotcBildirimleri[dil];
}

/**
 * Özgün kalıp yalnızca bildirimin çevrildiği dillerde ayrıca gösterilir;
 * İngilizce sayfada bildirim zaten kalıbın kendisidir.
 */
export function özgünKalıpAyrıcaGösterilsinMi(dil: Dil): boolean {
  return wotcBildirimi(dil) !== WOTC_KALIBI;
}
