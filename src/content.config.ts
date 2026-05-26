import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const çeviriMetni = z.object({
  ad: z.string(),
  açıklama: z.string(),
});

const projeler = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/projects" }),
  schema: z.object({
    tr: çeviriMetni,
    en: çeviriMetni,
    kategori: z.enum(["oyun", "uygulama", "eklenti", "cihaz"]),
    durum: z.enum([
      "gelistiriliyor",
      "tamamlandi",
      "rafa-kaldirildi",
      "prototip",
    ]),
    ikon: z.string(),
    görseller: z
      .array(
        z.object({
          yol: z.string(),
          kapak: z.boolean(),
          detaydaGöster: z.boolean().optional(),
        }),
      )
      .optional(),
    bağlıBaşarılar: z.array(z.string()).optional(),
    detaylıAçıklama: z
      .object({
        tr: z.string(),
        en: z.string(),
      })
      .optional(),
    sıra: z.number().optional(),
  }),
});

const başarıçevirisi = z.object({
  ad: z.string(),
  açıklama: z.string(),
});

const başarılar = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/achievements" }),
  schema: z.object({
    tr: başarıçevirisi,
    en: başarıçevirisi,
    tarih: z.string(),
    tür: z.enum(["ödül", "kilometre-taşı", "yayın"]),
    ikon: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    başlık: z.string(),
    tarih: z.date(),
    açıklama: z.string(),
    etiketler: z.array(z.string()),
    dil: z.enum(["tr", "en"]),
  }),
});

const sosyalMedya = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/social-media" }),
  schema: z.object({
    platform: z.string(),
    kullanıcıAdı: z.string(),
    url: z.string().url(),
    ikon: z.string(),
    açıklama: z.string().optional(),
    sıra: z.number(),
    renk: z.string().optional(),
    hazır: z.boolean().optional(),
  }),
});

export const collections = { projeler, başarılar, blog, sosyalMedya };
