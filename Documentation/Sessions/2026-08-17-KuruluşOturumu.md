# 17 Ağustos 2026 — Kuruluş Oturumu

## Bu belge ne için

Bu oturum `C:\Users\Vini\Documents\Baldurs Gate 3 Guide` klasöründe açıldı ve o klasör artık kapatıldı ve silindi. Claude Code oturum kayıtları `~/.claude/projects/<yol>/` altında saklandığı ve **taşınamadığı** için (denendi, çalışmadı — aşağıda), oturumun bağlamı bu belgeye aktarıldı.

Ham kayıt 3,2 MB boyutunda ve 1124 satır uzunluğunda bu yüzden doğrudan okunması pratik değildir. **Bu belge o oturumun Website ve BG3 rehberine ait yarısının özüdür.**

Aynı oturumda markanın tümünü ilgilendiren bir yeniden yapılandırma da yapıldı (standardın birleştirilmesi, bağlam katmanlarının kurulması). O kısım çatıya aittir ve ayrı bir belgededir: `C:\MarcoLadatema\Documentation\Sessions\2026-08-17-BağlamYapısıKuruluşu.md`. Bu ayrım 2026-08-18'de yapıldı; anlatı değiştirilmedi, yalnızca ait olduğu adrese taşındı.

## Nasıl kullanılır

Yeni bir oturumda bağlamı geri kazanmak için okuma sırası:

1. Bu belge — ne yapıldı, ne reddedildi, ne öğrenildi
2. `Decisions/ProjeKararları.md` — 19 karar, gerekçeleri ve reddedilen alternatifleri
3. `Roadmap/YolHaritası.md` — 11 faz ve tamamlanma koşulları
4. `Decisions/LisansPolitikası.md` — bağlayıcı hukuki çerçeve

---

## Oturumun akışı

Kullanıcının altı isteği oturumu şekillendirdi:

1. **Proje tanıtımı** — Baldur's Gate 3 oyunu için iki dilli, görsel, kapsamlı rehber isteği
2. **Temel tercihler** — format önerisi istendi, iki dil, araştırma tabanlı veri, standart genişletilebilir
3. **Kurulum yönlendirmesi** — GitHub deposu, DNS ve adres yapısı soruldu; burada adres tercihi ortaya çıktı ve mimari kararı değiştirdi
4. **Ana site denetimi** — "madem aynı kod tabanına dokunacağız, siteyi de elden geçirelim" + rehberin ayrılabilir olması şartı
5. **İş dağılımı** — veri şeması ve slug haritası yeni oturuma, denetim düzeltmeleri önceki oturuma; ayrıca Memory katmanlama sorusu
6. **Ayar ve taşıma** — `cleanupPeriodDays` ve oturum taşıma denemesi

Çalışma düzeni baştan sona şuydu: **önce kararlar, sonra fazlara bölme, en son uygulama.**

---

## Yapılan işler

### Planlama

19 karar gerekçeleriyle kayda geçti, üç katmanlı fan içerik lisans çerçevesi araştırıldı, 11 fazlı yol haritası çıkarıldı. Yol haritasında **dikey dilim** yaklaşımı seçildi: tüm veriyi toplayıp sonra arayüz yazmak yerine, önce sınıflar uçtan uca bitirilecek.

### Yeniden yapılandırma — çatıya ait, ayrı belgede

Denetim sırasında geliştirici standardının iki kopyaya çatallandığı fark edildi ve iş markanın tümünü kapsayan bir yeniden yapılandırmaya dönüştü: standart birleştirildi, `Standards/` altına taşındı, dile göre kapsamlanan kural dosyaları ve katmanlı bağlam yapısı kuruldu.

Bu kısım Website'e ait olmadığı için burada anlatılmaz. Tam kayıt: `C:\MarcoLadatema\Documentation\Sessions\2026-08-17-BağlamYapısıKuruluşu.md`.

### Denetim

Astro 6.3.7 → 7.2.2, güvenlik zafiyetleri sıfırlandı, harici CDN bağımlılığı tamamen kaldırıldı. 11 bulgunun 10'u düzeltildi.

---

## Denetim bulguları

| #       | Bulgu                                                  | Sonuç                                                              |
| ------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| K1      | Kök sayfa JavaScript olmadan tamamen boştu             | `noscript` yedeği, `lang`, `title`, `viewport`, `hreflang` eklendi |
| K2      | Tabler Icons CDN'de `@latest` etiketiyle çekiliyordu   | Yerel pakete alındı, sürüm sabitlendi                              |
| K3      | Gezinti betiği tek bir eksik elemanda tamamen ölüyordu | Gerçek null kontrolü, adlandırılmış fonksiyonlar                   |
| Ö1      | `hreflang` ve `canonical` yoktu                        | Her sayfada üretiliyor                                             |
| Ö2      | Google Fonts + jsdelivr harici bağımlılığı             | Sıfır dış istek; latin + latin-ext alt kümeleri                    |
| Ö4      | Popup'ta dialog semantiği yoktu                        | `role`/`aria-modal`, odak yönetimi, Tab hapsi                      |
| Ö5      | Tema kodu üç dosyada kopyalanmıştı                     | `TemaBaşlatıcı.astro` bileşeninde tek yerde                        |
| Ö6      | `style.zoom` kullanılıyordu                            | `rem` tabanlı `font-size` ölçeklemesi                              |
| Ö7      | Astro sürümü geride                                    | 7.2.2 + 0 zafiyet                                                  |
| Ö11     | `core.quotepath` bu depoda ayarsızdı                   | Ayarlandı — Türkçe dosya adları git çıktısında okunabilir          |
| İ1      | README varsayılan Astro şablonuydu                     | Projeyi anlatan Türkçe README                                      |
| İ3      | `(window as any)` global kirliliği                     | Özel olay (`CustomEvent`) ile değiştirildi                         |
| S1      | İçerik klasörleri küçük harf                           | `Projects/`, `Achievements/`, `Blog/`, `SocialMedia/`              |
| S2, Ö10 | JSON adları camelCase, slug'lar okunaksız              | kebab-case; `/projects/derstakip/` → `/projects/ders-takip/`       |
| S3      | `i18n/utils.ts` İngilizce                              | `çeviriAraçları.ts`, 15 import güncellendi                         |

Tüm taşımalar `git mv` ile yapıldı, git hepsini rename olarak tanıdı — dosya geçmişleri korundu.

---

## Geri çekilen bulgular — tekrar gündeme getirme

Bunlar denetimde bulgu olarak açıldı ama **incelendikten sonra geçersiz sayıldı**. Kayıt altına alınmalarının sebebi, ileride yeniden "sorun" diye işaretlenmelerini önlemek:

- **Ö3 — Gizli paneller klavyeyle erişilebilir.** Yanlıştı. `.ayarlar-paneli` ve `.mobil-menü` `display: none` ile gizleniyor; bu zaten hem ekran okuyucudan gizler hem klavye odağını engeller. `inert` gerekmiyor.
- **S4 — Koleksiyon adı `blog` İngilizce.** Geçersiz. "Blog" Türkçede de kullanılan bir kelimedir, tutarsızlık değildir.
- **İ2 — `Website.html` amacı belirsiz.** Meşru: VS Code'un yerleşik tarayıcısından yayınlanmış siteyi açmak için kullanılıyor. `.gitignore` yorumu açıklayıcı hale getirildi, dosya korundu.
- **İ4 — `og-varsayılan.png` Türkçe karakter içeriyor.** Risk kesin değil; modern sosyal medya botları UTF-8 URL'leri işliyor. Standart da adreslerde Türkçe karakteri koruyor. Kullanıcı kararıyla değiştirilmedi.

---

## Öğrenilen teknik gerçekler

- **Astro 7 geçişi sorunsuzdu**, çünkü projede remark/rehype eklentisi yoktu.

Bu oturumda Claude Code'un bağlam mekanizmasına dair altı teknik gerçek daha doğrulandı (CLAUDE.md'nin yukarı yürümesi, `@` import davranışı, ayar dosyalarının yürümemesi, `paths` frontmatter, oturum kayıtlarının taşınamaması). Bunlar markanın tümünü ilgilendirdiği için çatı belgesindedir: `C:\MarcoLadatema\Documentation\Sessions\2026-08-17-BağlamYapısıKuruluşu.md`.

---

## Kalan işler

| #   | İş                      | Not                                                                                                                                                              |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 13  | Dile göre slug haritası | `/en/sosyal-medya` → `/en/social-media`, `/tr/projects` → `/tr/projeler`. Karar: merkezi slug haritası + `[lang]` yapısının korunması. Yönlendirme eklenmeyecek. |
| 3   | Veri şeması tasarımı    | Yol haritası Faz 1. Projenin en kritik adımı — yanlış şema sonraki her fazı zehirler.                                                                            |

Ayrıca yol haritasında açık bırakılan iki karar var: **"Baldurs Gate 3 Oyunu Rehberinde oyuncu karakterinin build'ine etki eder" ölçütünün** yazılı kurala bağlanması (Faz 1'de kapanır) ve **ekran görüntüsü/harita politikası** (Faz 9).

## Nereden devam edilmeli

Website deposunda 44 değişiklik commit edilmemiş durumda ve build 28 sayfa üretiyor. İlk iş, bu değişikliklerin gözden geçirilip commit edilmesi olabilir.

Ardından iş #13 (slug haritası) mantıklı bir başlangıç: rehber sayfaları da aynı mekanizmayı kullanacağı için, veri şemasından önce adres yapısının oturması işi kolaylaştırır.
