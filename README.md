# Marco La'datema — Kişisel Site

[marcoladatema.com](https://marcoladatema.com) adresinde yayınlanan iki dilli (Türkçe / İngilizce) kişisel site ve oyun rehberleri.

Astro ile üretilir, GitHub Pages üzerinde barındırılır. `main` dalına yapılan her push GitHub Actions ile otomatik olarak yayınlanır.

## Kurulum

```bash
npm install
```

Node 22.12 veya üstü gerekir.

## Komutlar

| Komut | İş |
| --- | --- |
| `npm run dev` | Geliştirme sunucusunu başlatır |
| `npm run build` | Üretim derlemesini `dist/` içine üretir |
| `npm run preview` | Derlenmiş çıktıyı yerelde önizler |

Push öncesi `npm run build` çalıştırılması önerilir: site tek bir derlemeden çıktığı için içerik şemasına takılan bir kayıt tüm yayını durdurur.

## Yapı

```
src/
├── components/       Astro bileşenleri
│   └── Sections/     Sayfa bölümlerinin gövdeleri
├── content/          İçerik verisi (JSON, Markdown) ve Zod şemaları
├── i18n/             Çeviriler, çeviri yardımcıları ve adres haritası
├── layouts/          Sayfa düzenleri
├── pages/[dil]/      Dile göre yönlendirilen sayfalar
└── styles/           CSS
```

Adresler dil önekiyle başlar: `/tr/...` ve `/en/...`. Varsayılan dil Türkçe olup o da önek alır, böylece hiçbir sayfanın iki farklı adresi olmaz.

Bölüm adresleri her dilde kendi dilindedir (`/tr/iletişim`, `/en/contact`) ve tek bir kaynaktan üretilir: `src/i18n/adresHaritası.ts`. Dosya adı sabit olduğu için tek bir sayfa dosyası iki farklı adres üretemez; bu yüzden sayfalar dinamiktir (`[dil]/[sayfa].astro`) ve somut adresleri haritadan alır. Dil değiştirme ve `hreflang` etiketleri de aynı haritadan geçer.

İçerik koda gömülmez; `src/content/` altında veri dosyalarında yaşar ve her koleksiyon derleme zamanında Zod şemasıyla doğrulanır.

## Belgeler

| Belge | İçerik |
| --- | --- |
| `Documentation/Decisions/ProjeKararları.md` | Oyun rehberi projesinin kuruluş kararları ve gerekçeleri |
| `Documentation/Decisions/LisansPolitikası.md` | Fan içerik lisans çerçevesi ve bağlayıcı kurallar |
| `Documentation/Roadmap/YolHaritası.md` | Faz planı ve tamamlanma koşulları |

Kod standardı `C:\MarcoLadatema\Standards\GeliştiriciStandardı.md` dosyasındadır ve tüm projelerde geçerlidir.

## Yazı tipleri ve ikonlar

Outfit, Inter ve Tabler Icons harici bir CDN'den değil, npm paketlerinden yerel olarak sunulur. Bu, sürümü sabitler ve ziyaretçinin isteğinin üçüncü taraf sunuculara gitmesini önler.

## Lisans

Site içeriği ve kodu kişiseldir. Oyun rehberi bölümleri, Wizards of the Coast ve Larian Studios fan içerik politikalarına tabi olan ticari olmayan fan içeriğidir; ayrıntılar `Documentation/Decisions/LisansPolitikası.md` içindedir.
