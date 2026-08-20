import type { Dil } from "../i18n/çeviriAraçları";

/**
 * Rehberin adres tablosu. Ana sitenin `src/i18n/adresHaritası.ts` dosyasına
 * girmez (karar 20) — ana site rehberin varlığını bilmez, rehber kendi
 * adreslerini kendi taşır.
 */

/** Rehberlerin barındığı üst segment. */
const rehberlerSegmenti: Record<Dil, string> = {
  tr: "oyun-rehberleri",
  en: "game-guides",
};

interface RehberKaydı {
  /** İçerik koleksiyonundaki kaydın kimliğiyle birebir eşleşir. */
  kimlik: string;
  /** Üst segmentin altındaki adres parçası; dile göre ayrışabilir (karar 7). */
  altYol: Record<Dil, string>;
}

const rehberler: RehberKaydı[] = [
  { kimlik: "bg3", altYol: { tr: "bg3", en: "bg3" } },
];

/** Rehberin ana sayfasının altındaki sabit sayfalar. */
const lisansSlugu: Record<Dil, string> = { tr: "lisans", en: "license" };

const diller: Dil[] = ["tr", "en"];

/** Rehber içindeki bir sayfanın kimliği; adres üretimi bunun üzerinden yapılır. */
export type RehberKonumu =
  | { tür: "liste" }
  | { tür: "rehberAna"; kimlik: string }
  | { tür: "rehberLisansı"; kimlik: string };

export function rehberlerSlugu(dil: Dil): string {
  return rehberlerSegmenti[dil];
}

export function rehberlerYolu(dil: Dil): string {
  return `/${dil}/${rehberlerSlugu(dil)}`;
}

export function rehberAnaYolu(dil: Dil, kimlik: string): string {
  const kayıt = rehberler.find((aday) => aday.kimlik === kimlik);
  if (!kayıt) throw new Error(`Adres haritasında rehber yok: ${kimlik}`);

  return `${rehberlerYolu(dil)}/${kayıt.altYol[dil]}`;
}

export function rehberLisansYolu(dil: Dil, kimlik: string): string {
  return `${rehberAnaYolu(dil, kimlik)}/${lisansSlugu[dil]}`;
}

/** Bir konumun verilen dildeki adresi. Dil değiştirme bu fonksiyondan geçer. */
export function rehberKonumYolu(dil: Dil, konum: RehberKonumu): string {
  if (konum.tür === "liste") return rehberlerYolu(dil);
  if (konum.tür === "rehberLisansı") {
    return rehberLisansYolu(dil, konum.kimlik);
  }

  return rehberAnaYolu(dil, konum.kimlik);
}

interface RehberYolu {
  params: { dil: Dil; rehberler: string; yol: string | undefined };
  props: { dil: Dil; konum: RehberKonumu };
}

/**
 * Tek yakalayıcı rota dosyasının ürettiği adreslerin tamamı (karar 21).
 * Liste sayfası yakalayıcının boş değerine karşılık gelir.
 */
export function rehberYolları(): RehberYolu[] {
  return diller.flatMap((dil) => {
    const listeYolu: RehberYolu = {
      params: { dil, rehberler: rehberlerSlugu(dil), yol: undefined },
      props: { dil, konum: { tür: "liste" } },
    };

    const rehberYolları = rehberler.flatMap((kayıt) => [
      {
        params: { dil, rehberler: rehberlerSlugu(dil), yol: kayıt.altYol[dil] },
        props: {
          dil,
          konum: { tür: "rehberAna" as const, kimlik: kayıt.kimlik },
        },
      },
      {
        params: {
          dil,
          rehberler: rehberlerSlugu(dil),
          yol: `${kayıt.altYol[dil]}/${lisansSlugu[dil]}`,
        },
        props: {
          dil,
          konum: { tür: "rehberLisansı" as const, kimlik: kayıt.kimlik },
        },
      },
    ]);

    return [listeYolu, ...rehberYolları];
  });
}
