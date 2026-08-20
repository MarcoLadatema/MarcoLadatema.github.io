import type { Dil } from "../i18n/çeviriAraçları";
import { rehberlerYolu } from "./adresHaritası";
import { rehberÇevirisi } from "./çeviri";

/**
 * Ana sitenin rehbere açtığı TEK kapı. Bağlantı tek yönlüdür (karar 2): ana
 * site rehberin adresini de adını da kendi dosyalarında tutmaz, buradan alır.
 * Ayırma anında ana sitede silinecek iz, bu dosyayı kullanan tek import
 * satırı ile onu tüketen tek satırdır.
 */

interface RehberBağlantısı {
  ad: string;
  yol: string;
}

export function rehberBağlantısı(dil: Dil): RehberBağlantısı {
  return {
    ad: rehberÇevirisi(dil).liste.başlık,
    yol: rehberlerYolu(dil),
  };
}
