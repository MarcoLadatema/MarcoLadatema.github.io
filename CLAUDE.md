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
- **Yönlendirme:** `src/pages/[lang]/...`
- **İçerik:** `src/content/` altında JSON, şemalar `src/content.config.ts` içinde Zod ile
- **Çeviri:** `src/i18n/tr.json`, `en.json` ve `utils.ts`
- **Belgeler:** `Documentation/` — proje kararları, lisans politikası, yol haritası

## Oyun rehberleri — ayrılabilirlik kuralı

Rehberler bu projeye entegre edilir ama ileride temiz ayrılabilmelidir. Tek yönlü bağımlılık: **rehber ana siteye bağımlı olabilir, ana site rehbere ASLA bağımlı olmaz.**

- Rehber dosyaları tek ad altında toplanır: `src/content/BG3/`, `src/components/BG3/`, `src/pages/[lang]/oyun-rehberleri/`, `src/styles/bg3/`
- `content.config.ts` rehber şemalarını içine YAZMAZ — ayrı bir dosyadan `import` eder. Ayırma anında silinecek şey tek bir import satırı olmalıdır.
- Rehber çevirileri ana `tr.json`/`en.json` dosyalarına karışmaz, ayrı dosyada durur
- Hiçbir rehber dosyası ortak klasörlere dağılmaz

## Lisans zorunluluğu

Oyun rehberi sayfaları fan içeriğidir ve üç katmanlı bir politikaya tabidir. Alt bilgide WotC/Larian bildirimi **zorunlu**; bağış, reklam veya Patreon bağlantısı **yasak**. bg3.wiki'den metin kopyalanmaz — bilgi doğrulanır, cümle bize aittir.

Ayrıntı: `Documentation/Decisions/LisansPolitikası.md`
