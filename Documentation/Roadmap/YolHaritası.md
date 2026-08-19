# Yol Haritası

Baldur's Gate 3 Rehberi'nin faz planı. Kararlar için `Decisions/ProjeKararları.md`, hukuki çerçeve için `Decisions/LisansPolitikası.md` belgelerine bakılır.

**Kayıt tarihi:** 17 Ağustos 2026

---

## Planlama yaklaşımı

Proje yaklaşık 2000 kayıt içeriyor. Bütün veriyi toplayıp sonra arayüz yazmak, tasarım hatalarını ancak en sonda ortaya çıkarır — o noktada 2000 kaydı yeniden biçimlendirmek gerekir.

Bunun yerine **dikey dilim** yaklaşımı uygulanır: önce tek bir içerik türü (sınıflar) uçtan uca bitirilir — veri, şema, sayfa, arayüz. Bu dilim çalıştığında desen kanıtlanmış olur ve kalan türler aynı deseni tekrarlar.

### Faz kuralları

- Bir faz, **tamamlanma koşulu** karşılanmadan kapanmaz.
- Bir faz kapanırken o faza ait tüm kod etiketleri (`TODO:` / `FIXME:`) kapatılmış olmalıdır — bu, standart §4'ün gereğidir.
- Fazlar sıralı ilerler; bağımlılığı karşılanmayan faz başlatılmaz.
- Kod etiketleri bu belgedeki faz adlarına atıf verir.

---

## Faz genel görünümü

| Faz | Ad                          | Bağımlılık | Çıktı                                        |
| --- | --------------------------- | ---------- | -------------------------------------------- |
| 0   | Kuruluş                     | —          | Website içinde ayrılabilir rehber iskeleti   |
| 1   | Veri Şeması                 | 0          | Doğrulanmış şema tanımları                   |
| 2   | Veri Çıkarma Altyapısı      | 1          | Ham oyun verisinden JSON üreten hat          |
| 3   | Dikey Dilim — Sınıflar      | 2          | Uçtan uca çalışan sınıf bölümü               |
| 4   | Irklar, Geçmişler, Feat'ler | 3          | Karakter oluşturma verisi tamam              |
| 5   | Büyü Veritabanı             | 3          | 600+ büyü kaydı                              |
| 6   | Eşya Veritabanı             | 3          | Build'e etki eden eşyalar                    |
| 7   | Güçlendirmeler ve Origin    | 6          | Kalıcı güçlendirmeler, karaktere özel içerik |
| 8   | Yorum Katmanı               | 4, 5, 6, 7 | Multiclass rehberi ve build önerileri        |
| 9   | Görseller ve Arayüz         | 3          | İkonlar, filtre, arama                       |
| 10  | Yayın                       | Tümü       | Topluluğa açık rehber                        |

---

## Faz 0 — Kuruluş

**Amaç:** Mevcut Website projesinin içinde, boş ama yayınlanan ve **ayrılabilirlik kuralına uyan** bir rehber iskeleti kurmak. Deploy hattı, i18n yapılandırması ve temel düzen zaten çalışıyor; bu faz onların üzerine rehberin kendi ayrık alanını açar.

**İşler:**

- Rehber klasörlerinin açılması: `src/content/BG3/`, `src/components/BG3/`, `src/pages/[lang]/oyun-rehberleri/`, `src/styles/bg3/`
- Rehber şemalarının **ayrı bir dosyada** tanımlanması; `content.config.ts` bu dosyayı yalnızca `import` eder — ayırma anında silinecek şey tek satır olmalıdır
- Rehber çevirilerinin ana `tr.json` / `en.json` dışında, kendi dosyasında tutulması
- Dile göre yol farkının slug haritasına bağlanması: `/tr/oyun-rehberleri/bg3` ve `/en/game-guides/bg3` (karar 3)
- Alt bilgiye WotC/Larian lisans bildiriminin yerleştirilmesi — rehber sayfalarında **zorunlu**
- Ana siteden rehbere bağlantı verilmesi (bağlantı tek yönlüdür; ana site rehberin veri veya bileşenlerine bağımlı olmaz)

**Bağlı olduğu iş:** Slug haritası — **tamamlandı (19 Ağustos 2026)**. Ana site adresleri `src/i18n/adresHaritası.ts` üzerinden üretiliyor; rehber bölümleri bu haritaya `oyunRehberleri` anahtarı eklenerek bağlanır, ayrı bir mekanizma kurulmaz.

**Tamamlanma koşulu:** `/tr/oyun-rehberleri/bg3` ve `/en/game-guides/bg3` yayınlanan sitede açılıyor, dil değiştirme rehber sayfaları arasında doğru yola gidiyor, alt bilgi lisans bildirimi görünüyor, `main`'e push otomatik yayınlıyor. Ayrılabilirlik denetimi geçiliyor: `src/content/BG3`, `src/components/BG3`, `src/pages/[lang]/oyun-rehberleri`, `src/styles/bg3` ve rehber şema/çeviri dosyaları silindiğinde ana site tek bir `import` satırının kaldırılmasıyla derleniyor.

---

## Faz 1 — Veri Şeması

**Amaç:** Tüm içerik türlerinin alan listelerini tasarlamak ve Zod şemalarına dökmek. Bu, projenin en kritik fazıdır — yanlış şema, sonraki her fazı zehirler.

**İşler:**

- İçerik türlerinin alan listeleri: sınıf, alt sınıf, seviye kaydı, feat, büyü, eşya, güçlendirme, ırk, geçmiş, origin karakter, build önerisi
- Ortak alan deseninin oturtulması: _Ne / Nerede / Nasıl alınır / Koşullar / Avantaj / Dezavantaj_
- Çok dilli alan yapısı (`{ tr, en }`) ve dil başına slug alanı
- `patchSürümü` alanı — ileride hangi kayıtların yeniden doğrulanacağını belirlemek için
- Enum değerlerinin sabitlenmesi (nadirlik, act, eşya türü, okul, hasar türü)
- **"Build'e etki eder" ölçütünün yazılı kurala bağlanması** — açık karar, burada kapanır
- Her tür için elle yazılmış birkaç örnek kayıtla şemanın sınanması

**Tamamlanma koşulu:** `content.config.ts` tüm koleksiyonları tanımlıyor, her tür için en az üç örnek kayıt şemayı geçiyor, ölçüt belgesi yazılmış.

---

## Faz 2 — Veri Çıkarma Altyapısı

**Amaç:** Oyun dosyalarından JSON üreten, tekrar çalıştırılabilir bir hat kurmak.

**İşler:**

- LSLib / `divine.exe` kurulumu
- `Shared.pak` ve `Gustav.pak` çıkarımı
- Stats dosyalarının çözümlenmesi
- `english.loca` ve `turkish.loca` dosyalarının XML'e dönüştürülmesi
- Tanıtıcı (handle) eşleştirmesiyle iki dilli metin birleştirme
- Şema uyumlu JSON üreten betik
- Betiğin belgelenmesi — oyun güncellenirse yeniden çalıştırılabilmeli

**Risk:** Stats dosyalarının yapısı beklenenden dağınık çıkabilir. Bu durumda bazı alanlar wiki doğrulamasına veya elle girişe kayar; faz kapsamı buna göre daraltılır ve durum belgeye yazılır.

**Tamamlanma koşulu:** Betik çalıştırıldığında şemayı geçen, iki dilli, doğrulanabilir JSON üretiyor.

---

## Faz 3 — Dikey Dilim: Sınıflar

**Amaç:** Tek bir içerik türünü uçtan uca bitirerek deseni kanıtlamak.

**İşler:**

- 12 sınıf ve 46 alt sınıfın veri kayıtları
- Seviye 1–12 ilerleme tabloları (~550 kayıt)
- Sınıf liste sayfası ve detay sayfası
- Seviye ilerleme tablosunun arayüz bileşeni
- İki dilli yönlendirmenin gerçek veriyle sınanması
- Avantaj/dezavantaj yorumlarının sınıflar için yazılması

**Neden burada:** Sınıflar hem yapısal olarak en karmaşık tür (iç içe seviye kayıtları) hem de rehberin omurgası. Burada çalışan desen, kalan türlerde tekrarlanır.

**Tamamlanma koşulu:** Bir oyuncu siteye girip herhangi bir sınıfın tüm seviye ilerlemesini iki dilde okuyabiliyor.

---

## Faz 4 — Irklar, Geçmişler, Feat'ler

**Amaç:** Karakter oluşturma verisini tamamlamak.

**İşler:** ~40 ırk ve alt ırk, ~11 geçmiş, ~40 feat kaydı ve sayfaları.

**Tamamlanma koşulu:** Karakter oluşturma ekranında karşılaşılan her seçenek rehberde karşılığını buluyor.

---

## Faz 5 — Büyü Veritabanı

**Amaç:** 600+ büyü ve cantrip kaydı.

**İşler:**

- Büyü kayıtlarının çıkarılması
- Seviye, okul, hasar türü, konsantrasyon, ritüel filtreleri
- Sınıf ilerleme tablolarından büyü sayfalarına bağlantı kurulması

**Tamamlanma koşulu:** Sınıf sayfasında "bu seviyede şu büyüleri seçebilirsin" satırındaki her büyü tıklanabilir ve kendi sayfasına gidiyor.

---

## Faz 6 — Eşya Veritabanı

**Amaç:** Build'e etki eden tüm eşyalar, konum ve edinme bilgisiyle.

**İşler:**

- Mekanik verinin oyun dosyalarından çıkarılması
- Konum, nasıl alınır ve koşul bilgisinin bg3.wiki üzerinden **doğrulanması** — metin kendi cümlelerimizle yazılır (bkz. `LisansPolitikası.md`)
- Act, tür, nadirlik ve sınıf uygunluğu filtreleri
- Avantaj/dezavantaj yorumları

**Uyarı:** Bu faz en uzun sürecek olandır. Act bazında alt fazlara bölünmesi (6a: Act 1, 6b: Act 2, 6c: Act 3) uygulama sırasında değerlendirilecek.

**Tamamlanma koşulu:** Her eşya kaydı altı ortak alanı da dolu olarak taşıyor.

---

## Faz 7 — Güçlendirmeler ve Origin Karakterler

**Amaç:** Eşya olmayan kalıcı güçlendirmeler ve karaktere özel içerik.

**İşler:** Kalıcı güçlendirmeler (~40), Origin karakterlerin kişisel questlerinden gelen ödüller ve karar dallanmaları (~11 karakter).

**Not:** Bu fazın verisi oyun dosyalarından büyük ölçüde çıkarılamaz; quest mantığına bağlı olduğu için ağırlıklı olarak araştırma ve kişisel deneyimle yazılır.

**Tamamlanma koşulu:** Kalıcı güçlendirmelerin tamamı, koşulları ve dallanmalarıyla kayıtlı.

---

## Faz 8 — Yorum Katmanı

**Amaç:** Rehberi bir veri dökümünden ayıran kısmı yazmak.

**İşler:** Multiclass rehberi (sınıf kombinasyonları, seçim sırası, tuzaklar), hazır build önerileri (seviye seviye kurulum).

**Not:** Bu fazın tamamı elle yazılır; otomatik veri kaynağı yoktur. Diğer tüm veri fazlarına bağımlıdır çünkü build önerileri eşya, büyü ve sınıf kayıtlarına bağlantı verir.

**Tamamlanma koşulu:** Her build önerisi, kullandığı her eşya ve büyü için rehberin kendi sayfasına bağlantı veriyor.

---

## Faz 9 — Görseller ve Arayüz

**Amaç:** İkonların yerleştirilmesi ve arayüzün olgunlaştırılması.

**İşler:**

- İkon atlaslarının oyun dosyalarından çıkarılması ve web formatına dönüştürülmesi
- Arama altyapısı (iki dilde eşleşen)
- Filtre bileşenlerinin olgunlaştırılması
- Karanlık/aydınlık tema uyumu
- Mobil düzen

**Not:** Bu faz 3'ten sonra herhangi bir noktada paralel yürütülebilir; sıralamada burada durması zorunluluk değil, varsayılan.

**Açık karar:** Ekran görüntüsü ve harita görseli politikası bu fazda karara bağlanır.

**Tamamlanma koşulu:** Her kayıt ikonuyla görünüyor, arama iki dilde çalışıyor, mobilde okunabilir.

---

## Faz 10 — Yayın

**Amaç:** Rehberi topluluğa açmak.

**İşler:**

- Lisans bildiriminin doğrulanması
- Sitemap ve meta etiketleri
- İçerik denetimi: eksik alan taraması
- Topluluk paylaşımı

**Tamamlanma koşulu:** Rehber paylaşıldı ve dış bağlantılarla erişilebiliyor.

---

## Süre hakkında

Faz süreleri bilinçli olarak yazılmadı. Bu proje bir kişinin boş zamanında yürüttüğü bir iş ve gerçekçi olmayan tarihler yol haritasını değersizleştirir. Fazlar sırayla ilerler; her fazın tamamlanma koşulu karşılandığında bir sonrakine geçilir.

Ölçek hakkında gerçekçi beklenti: veri fazlarının (3–7) her biri, otomatik çıkarma çalıştıktan sonra bile ciddi bir doğrulama ve yorum yazma emeği gerektirir. Faz 6 tek başına diğerlerinin toplamı kadar sürebilir.
