import { getCollection } from "astro:content";
import type { Dil } from "./çeviriAraçları";

export type BölümAnahtarı =
  | "projeler"
  | "başarılar"
  | "blog"
  | "sosyalMedya"
  | "iletişim";

/**
 * Bölümlerin dile göre adres parçaları. Sitedeki her yol buradan üretilir;
 * hiçbir sayfa kendi adresini elle yazmaz.
 */
const bölümAdresleri: Record<BölümAnahtarı, Record<Dil, string>> = {
  projeler: { tr: "projeler", en: "projects" },
  başarılar: { tr: "başarılar", en: "achievements" },
  blog: { tr: "blog", en: "blog" },
  sosyalMedya: { tr: "sosyal-medya", en: "social-media" },
  iletişim: { tr: "iletişim", en: "contact" },
};

/** Altında kayıt detay sayfası bulunan bölümler. */
const detaylıBölümler: BölümAnahtarı[] = ["projeler", "blog"];

const diller: Dil[] = ["tr", "en"];

export function bölümAnahtarları(): BölümAnahtarı[] {
  return Object.keys(bölümAdresleri) as BölümAnahtarı[];
}

export function bölümSlugu(dil: Dil, anahtar: BölümAnahtarı): string {
  return bölümAdresleri[anahtar][dil];
}

export function bölümYolu(dil: Dil, anahtar: BölümAnahtarı): string {
  return `/${dil}/${bölümSlugu(dil, anahtar)}`;
}

export function kayıtYolu(
  dil: Dil,
  anahtar: BölümAnahtarı,
  kayıtSlugu: string,
): string {
  return `${bölümYolu(dil, anahtar)}/${kayıtSlugu}`;
}

export function detaylıBölümMü(anahtar: BölümAnahtarı): boolean {
  return detaylıBölümler.includes(anahtar);
}

interface ÇözülmüşYol {
  dil: Dil;
  anahtar: BölümAnahtarı;
  kayıtSlugu?: string;
}

/**
 * Bir adresi parçalarına ayırır. Ana sayfa ve tanınmayan adresler için null döner.
 * Gelen yolun yüzde kodlaması çözülmüş olması beklenir.
 */
export function bölümÇöz(yol: string): ÇözülmüşYol | null {
  const parçalar = yol.split("/").filter((parça) => parça.length > 0);
  if (parçalar.length < 2) return null;

  const [dilParçası, bölümParçası, kayıtParçası] = parçalar;
  if (!diller.includes(dilParçası as Dil)) return null;
  const dil = dilParçası as Dil;

  const anahtar = bölümAnahtarları().find(
    (aday) => bölümSlugu(dil, aday) === bölümParçası,
  );
  if (!anahtar) return null;

  return { dil, anahtar, kayıtSlugu: kayıtParçası };
}

/**
 * Blog yazılarının iki dilli eşi dosya adından bulunur: `ilk-yazi.tr.md` ile
 * `ilk-yazi.en.md` aynı kaydın iki dilidir, ama slug'ları ayrışabilir.
 */
function yazıAnahtarı(kimlik: string, dil: Dil): string {
  return kimlik.replace(`.${dil}.md`, "");
}

async function blogSluguÇevir(
  kayıtSlugu: string,
  kaynakDil: Dil,
  hedefDil: Dil,
): Promise<string | null> {
  const yazılar = await getCollection("blog");

  const kaynakYazı = yazılar.find(
    (yazı) => yazı.data.dil === kaynakDil && yazı.data.slug === kayıtSlugu,
  );
  if (!kaynakYazı) return null;

  const anahtar = yazıAnahtarı(kaynakYazı.id, kaynakDil);
  const hedefYazı = yazılar.find(
    (yazı) =>
      yazı.data.dil === hedefDil && yazıAnahtarı(yazı.id, hedefDil) === anahtar,
  );

  return hedefYazı ? hedefYazı.data.slug : null;
}

/**
 * Verilen adresin hedef dildeki karşılığını üretir. Karşılığı bulunamayan
 * kayıtlarda o bölümün liste sayfasına, çözülemeyen adreslerde ana sayfaya düşer.
 */
export async function diğerDilYolu(
  yol: string,
  hedefDil: Dil,
): Promise<string> {
  const çözüm = bölümÇöz(yol);
  if (!çözüm) return `/${hedefDil}/`;

  const { dil, anahtar, kayıtSlugu } = çözüm;
  if (!kayıtSlugu) return bölümYolu(hedefDil, anahtar);

  if (anahtar === "blog") {
    const hedefSlug = await blogSluguÇevir(kayıtSlugu, dil, hedefDil);
    return hedefSlug
      ? kayıtYolu(hedefDil, anahtar, hedefSlug)
      : bölümYolu(hedefDil, anahtar);
  }

  // Proje adları iki dilde de aynı ürün adıdır; slug dile göre ayrışmaz.
  return kayıtYolu(hedefDil, anahtar, kayıtSlugu);
}
