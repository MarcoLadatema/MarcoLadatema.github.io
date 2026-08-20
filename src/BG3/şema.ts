import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

/**
 * Rehberin Zod şemaları. Ana `content.config.ts` bu dosyayı yalnızca
 * `import` eder; şema gövdesi oraya yazılmaz (karar 23).
 *
 * TODO: İçerik türlerinin şemaları (sınıf, büyü, eşya, feat, ırk, geçmiş)
 * burada tanımlanacak. Faz 0 yalnızca iskeleti kurduğu için henüz alan
 * listeleri tasarlanmadı. Çıkış koşulu: Faz 1 — Veri Şeması.
 */

const rehberMetni = z.object({
  ad: z.string(),
  açıklama: z.string(),
});

/**
 * Rehberin kendi tanıtım kaydı. Desen özyinelemeli değildir: içerik
 * koleksiyonları alt klasörlerde yaşayacağı için burada yalnızca kök
 * seviyesindeki dosyalar taranır.
 */
const rehberler = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/content/BG3" }),
  schema: z.object({
    tr: rehberMetni,
    en: rehberMetni,
    ikon: z.string(),
    durum: z.enum(["hazırlanıyor", "yayında"]),
    sıra: z.number(),
  }),
});

export const rehberKoleksiyonları = { rehberler };
