# Website — Proje Yönergesi

Çatı yönergesi (`../CLAUDE.md`) ve web kuralları (`../.claude/rules/web.md`) burada da geçerlidir. Aşağıdakiler yalnızca bu projeye özgü eklerdir.

## Ne olduğu

Astro tabanlı kişisel site ve oyun rehberleri. GitHub Pages üzerinden `marcoladatema.com` adresinde yayınlanır.

## Komutlar

| Komut | İş |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi |
| `npm run preview` | Derlenmiş çıktıyı önizle |

**Push öncesi `npm run build` çalıştır.** Site tek bir derlemeden çıkar; rehberdeki bozuk bir içerik kaydı şema doğrulamasına takılırsa tüm sitenin yayını durur. Hatayı yerelde yakalamak, GitHub Actions'ta yakalamaktan ucuzdur.

`main` dalına push, GitHub Actions ile otomatik yayınlar.

## Yapı

- **i18n:** `defaultLocale: "tr"`, `prefixDefaultLocale: true` — her sayfa `/tr/` veya `/en/` önekiyle yayınlanır
- **Yönlendirme:** `src/pages/[dil]/[sayfa].astro` ve `src/pages/[dil]/[sayfa]/[kimlik].astro` — bölüm gövdeleri `src/components/Sections/` altındadır
- **Adres:** Bölüm segmentleri dile göre değişir (`/tr/iletişim` ↔ `/en/contact`) ve tek otorite `src/i18n/adresHaritası.ts`'dir. Hiçbir dosya kendi yolunu elle yazmaz; dil değiştirme ve `hreflang` de haritadan geçer
- **İçerik:** `src/content/` altında JSON ve Markdown, şemalar `src/content.config.ts` içinde Zod ile
- **Çeviri:** `src/i18n/tr.json`, `en.json` ve `çeviriAraçları.ts`
- **Belgeler:** `Documentation/` — proje kararları, lisans politikası, yol haritası

## Oyun rehberleri — ayrılabilirlik kuralı

Rehberler bu projeye entegre edilir ama ileride temiz ayrılabilmelidir. Tek yönlü bağımlılık: **rehber ana siteye bağımlı olabilir, ana site rehbere ASLA bağımlı olmaz.**

- Rehberin **kendi kök klasörü** vardır: `src/BG3/` — şema, adres haritası, çeviriler, bileşenler ve stiller buradadır. Bileşenler `src/components/` altında DEĞİLDİR; bu bilinçli bir sapmadır (karar 23).
- Ortak klasörlerde yalnızca kaçınılmaz iki iz bulunur: `src/content/BG3/` (Astro şartı) ve `src/pages/[dil]/[rehberler]/[...yol].astro` (tek rota dosyası, karar 21)
- `content.config.ts` rehber şemalarını içine YAZMAZ — `src/BG3/` içindeki dosyadan `import` eder. Ayırma anında silinecek şey tek bir import satırı olmalıdır.
- Rehber çevirileri ana `tr.json`/`en.json` dosyalarına karışmaz; rehberin kendi kökünde durur
- Rehber adresleri ana `adresHaritası.ts` dosyasına girmez; rehber kendi haritasını taşır (karar 20)
- Ana siteden rehbere giden bağlantı tek bir kapıdan geçer: `src/BG3/anaSiteBağlantısı.ts`. Ana site rehberin ne adresini ne adını kendi dosyalarında tutar; `Gezinti.astro` yalnızca bu dosyayı tanır (karar 24)

**Ayırma işleminin tamamı** — bu liste dışında hiçbir dosyaya dokunulmaz:

1. `src/BG3/` ve `src/content/BG3/` klasörleri silinir
2. `src/pages/[dil]/[rehberler]/[...yol].astro` silinir
3. `content.config.ts`: bir `import` satırı ve koleksiyon listesindeki `...rehberKoleksiyonları` yayılımı silinir
4. `Gezinti.astro`: bir `import` satırı ve `bağlantılar` dizisindeki `rehberBağlantısı(dil)` satırı silinir

`TemelDüzen`, `Gezinti` ve `AltBilgi`'nin rehber için kazandığı isteğe bağlı prop ve slot GERİ ALINMAZ — bunlar rehbere özgü değildir, düzenin "her sayfa bir ana site bölümüdür" varsayımını kaldırır (karar 20).

## Lisans zorunluluğu

Oyun rehberi sayfaları fan içeriğidir ve üç katmanlı bir politikaya tabidir. Alt bilgide WotC/Larian bildirimi **zorunlu**; bağış, reklam veya Patreon bağlantısı **yasak**. bg3.wiki'den metin kopyalanmaz — bilgi doğrulanır, cümle bize aittir.

Ayrıntı: `Documentation/Decisions/LisansPolitikası.md`
