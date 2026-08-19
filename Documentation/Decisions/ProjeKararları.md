# Proje Kararları

Baldur's Gate 3 Rehberi projesinin kuruluş kararları. Her kayıt kararı, gerekçesini ve reddedilen alternatifleri taşır.

Bu belgenin amacı, ileride "bunu neden böyle seçmiştik" sorusunun cevapsız kalmamasıdır. Bir karar değişirse **yerinde** güncellenir: başlık ve gövde yeni kararı anlatır, altına **Geçersiz kılan karar** başlığıyla eski kararın ne olduğu ve neden çöktüğü yazılır. Numaralar kaymaz, gerekçe geçmişi silinmez.

**Kayıt tarihi:** 17 Ağustos 2026

---

## Özet

| #   | Konu                 | Karar                                                                                |
| --- | -------------------- | ------------------------------------------------------------------------------------ |
| 1   | Çıktı formatı        | Astro (statik site üreteci)                                                          |
| 2   | Yerleşim             | Website projesine entegre, tek yönlü ayrılabilir                                     |
| 3   | Adres                | `/tr/oyun-rehberleri/bg3` ve `/en/game-guides/bg3`                                   |
| 4   | Depo                 | Ayrı depo açılmaz — Website deposu kullanılır                                        |
| 5   | Diller               | Türkçe + İngilizce, varsayılan Türkçe                                                |
| 6   | Terminoloji          | Oyunun resmî Türkçe yerelleştirmesi                                                  |
| 7   | Adres kimliği        | Her dil kendi dilinde slug                                                           |
| 8   | Adres karakterleri   | Türkçe karakterler korunur                                                           |
| 9   | Veri kaynağı         | Oyun dosyaları + bg3.wiki Cargo API                                                  |
| 10  | Eşya kapsamı         | Build'e etki eden her eşya                                                           |
| 11  | Büyü kapsamı         | Tam veritabanı                                                                       |
| 12  | Ek bölümler          | Irklar, Geçmişler, Multiclass, Build önerileri                                       |
| 13  | Görseller            | İkonlar oyun dosyalarından çıkarılır                                                 |
| 14  | Lisans               | Üç katmanlı fan içerik politikası, ücretsiz                                          |
| 15  | Baz sürüm            | Patch 8 içeriği / Hotfix #36                                                         |
| 16  | Standart             | Mevcut standarda web bölümleri eklendi                                               |
| 17  | TypeScript fonksiyon | `camelCase`                                                                          |
| 18  | Parantez stili       | Web tarafında K&R                                                                    |
| 19  | Klasör adlandırma    | `PascalCase` + framework istisnası                                                   |

---

## 1. Çıktı formatı: Astro

**Karar:** Rehber, Astro ile üretilen statik bir site olacak.

**Gerekçe:** Proje yaklaşık 2000 yapılandırılmış kayıt üzerine kurulu ve her kayıt aynı alan setini taşıyor. Astro'nun Content Collections + Zod şema doğrulaması, veri tutarsızlığını **derleme zamanında** yakalar — yüzlerce kayıtta elle denetimin yerini alan tek mekanizma budur. Ayrıca i18n yönlendirmesi ve island mimarisi kutudan gelir.

**Reddedilenler:**

- _Bağımlılıksız vanilla site:_ En dayanıklı seçenek, ama arama, filtre, sayfalama ve i18n altyapısının tamamı elle yazılırdı.
- _MkDocs Material / Docusaurus:_ En hızlı başlangıç, ama görünüm dokümantasyon sitesine sabitlenir; kart tabanlı filtrelenebilir wiki hissi elde edilemez.
- _Saf Markdown deposu:_ "Görsel Wiki" hedefini karşılamıyor.

---

## 2. Yerleşim: Website projesine entegre, tek yönlü ayrılabilir

**Karar:** Rehber, mevcut biyografi sitesinin deposuna entegre edilecek. Ayrı bir depo ve ayrı bir Astro projesi kurulmayacak.

**Gerekçe:** Karar 3'teki adres yapısı bunu zorunlu kılıyor. GitHub Pages, proje sitelerini **zorunlu olarak** depo adının altına yerleştirir — ayrı bir depo `marcoladatema.com/BaldursGate3Guide/...` üretir. İstenen `/tr/oyun-rehberleri/bg3` yolu, ancak rehber ana sitenin deposunda yaşarsa mümkündür.

**Ayrılabilirlik kuralı:** Bağımlılık tek yönlüdür — **rehber ana siteye bağımlı olabilir, ana site rehbere ASLA bağımlı olmaz.** Bu kural, ileride ayrılma ihtiyacı doğarsa taşımayı mekanik bir işe indirger:

- Rehber dosyaları tek ad altında toplanır: `src/content/BG3/`, `src/components/BG3/`, `src/pages/[lang]/oyun-rehberleri/`, `src/styles/bg3/`
- `content.config.ts` rehber şemalarını **içine yazmaz**, ayrı bir dosyadan `import` eder — ayırma anında silinecek şey tek bir satır olmalıdır
- Rehber çevirileri ana `tr.json` / `en.json` dosyalarına karışmaz, ayrı dosyada durur
- Hiçbir rehber dosyası ortak klasörlere dağılmaz

**Bedeli:** İki projenin yaşam döngüsü ortaklaşır. Rehberdeki bir şema hatası derlemeyi kırarsa biyografi sitesinin yayını da durur. Bu bilinçli olarak kabul edildi; karşılığı, push öncesi `npm run build` çalıştırma zorunluluğudur. Ayrıca ~2600 ikon ve 2000+ sayfa deponun boyutunu ve geliştirme sunucusunun hızını etkileyecek.

**Geçersiz kılan karar:** Başlangıçta "ayrı depo, ayrı proje" seçilmişti; gerekçesi tam da yukarıda bedel olarak yazılan şeydi — yaşam döngülerinin ayrılması ve depo boyutunun izole edilmesi. Bu gerekçe geçerliliğini korumaktadır, ama GitHub Pages'in yol kısıtı karşısında uygulanabilir değildir: adres yapısından vazgeçmeden ayrı depoda kalmanın yolu yok. Ayrılabilirlik kuralı, kaybedilen izolasyonun yerine geçen telafidir.

---

## 3. Adres: `/tr/oyun-rehberleri/bg3` ve `/en/game-guides/bg3`

**Karar:** Rehber, ana sitenin alan adı altında dil önekli yolla yayınlanacak ve ana siteden bağlantı verilecek. Her dil kendi dilinde yol kullanır:

- Türkçe: `marcoladatema.com/tr/oyun-rehberleri/bg3`
- İngilizce: `marcoladatema.com/en/game-guides/bg3`

**Gerekçe:** Kimlik bütünlüğü korunur — rehber ana markanın parçası olarak görünür, ayrı bir siteye çıkmaz. Dile göre yol seçimi karar 7'nin ("her dil kendi dilinde slug") rehbere uygulanmasıdır; ana sitenin geri kalanı da aynı desene çekilecektir.

**Gerekenler:** Ana sitenin mevcut alan adı ve GitHub Pages ayarı yeterli — ek DNS kaydı, ek `CNAME` dosyası ve ek Pages yapılandırması gerekmez. Dil başına yol farkı, ana siteyle ortak bir **slug haritası** üzerinden çözülür; yönlendirme (redirect) eklenmez.

**Geçersiz kılan karar:** Başlangıçta adres `bg3.marcoladatema.com` alt alan adıydı ve DNS'te `bg3` için `marcoladatema.github.io` hedefli bir CNAME kaydı gerektiriyordu. Alt alan adı, rehberi teknik olarak bağımsız tutmak için seçilmişti (o zamanki karar 2). Yol tabanlı adres tercih edilince alt alan adı ve DNS işinin tamamı gereksizleşti.

---

## 4. Depo: Ayrı depo açılmaz — Website deposu kullanılır

**Karar:** Rehber için ayrı bir GitHub deposu açılmayacak; mevcut `Website` deposunda yaşayacak.

**Gerekçe:** Karar 2'nin doğrudan sonucu. Ayrı depo yoksa depo adı sorusu da yoktur.

**Geçersiz kılan karar:** Depoya `BaldursGate3Guide` adı verilmesi kararlaştırılmıştı; gerekçesi Standart §12'deki İngilizce `PascalCase` bitişik yazım kuralıydı. Ad seçimi doğruydu, ama depo hiç açılmayacağı için konusuz kaldı. Adlandırma kuralının kendisi geçerliliğini korur ve rehberin klasörlerine uygulanır (`src/content/BG3/`).

---

## 5. Diller: Türkçe + İngilizce

**Karar:** Site iki dilli olacak. Varsayılan dil Türkçe, her iki dil de adres öneki alacak (`/tr/`, `/en/`).

**Gerekçe:** Rehber hem kişisel kullanım hem topluluk paylaşımı için üretiliyor. Varsayılan dilin de önek alması (`prefixDefaultLocale: true`), aynı sayfanın iki farklı adresten erişilebilir olmasını engeller.

---

## 6. Terminoloji: Oyunun resmî Türkçe yerelleştirmesi

**Karar:** Türkçe terimler üretilmeyecek; oyunun kendi resmî Türkçe karşılıkları kullanılacak.

**Gerekçe:** Baldur's Gate 3, Patch 6 ile resmî Türkçe arayüz ve altyazı desteği aldı. Çeviriyi AiBell Game Localization yaptı; süreç 2,5 yıl sürdü ve ayrı bir terminoloji sorumlusu çevirmen barındırdı. Yani tutarlı ve oturmuş bir terminoloji zaten mevcut.

**Sonucu:** Terminoloji sözlüğü yazma ihtiyacı tamamen ortadan kalktı. Ayrıca Türkçe oynayan bir oyuncu, rehberde gördüğü adı oyunda birebir bulur — bu, "tam Türkçe çeviri" kararını (karar 8) yalnızca mümkün değil, doğru kılar.

---

## 7. Adres kimliği: Her dil kendi dilinde

**Karar:** Bir kayıt tek dosyada tutulur ama her dil için ayrı slug taşır.

```
/eşyalar/gecikmiş-sezgi
/items/belated-notion
```

**Gerekçe:** Türkçe sayfada İngilizce adres ne kadar yabancı duruyorsa, İngilizce sayfada Türkçe adres de o kadar yabancı durur. Her dil kendi içinde tutarlı olmalı.

**Bedeli:** Şemada dil başına slug alanı tutulur ve yönlendirme üretimi iki slug'ı da bilmek zorundadır.

---

## 8. Adres karakterleri: Türkçe karakterler korunur

**Karar:** Adreslerde Türkçe karakterler sadeleştirilmeyecek (`gecikmiş-sezgi`, `gecikmis-sezgi` değil).

**Gerekçe:** Türkçe sayfanın tam Türkçe olması tercih edildi.

**Bilinen bedeli:** Paylaşılan bağlantılar bazı platformlarda yüzde kodlamasıyla görünür (`gecikmi%C5%9F-sezgi`). Arama motorları bunu sorunsuz işler; SEO kaybı yoktur. Bu bedel bilinerek kabul edildi.

---

## 9. Veri kaynağı: Oyun dosyaları + wiki API

**Karar:** Veri elle araştırılıp yazılmayacak; iki yapılandırılmış kaynaktan toplanacak.

| Kaynak                        | Ne sağlar                                                         |
| ----------------------------- | ----------------------------------------------------------------- |
| Oyun `.pak` dosyaları (LSLib) | Mekanik veri: hasar, bonus, gereksinim, seviye tabloları, ikonlar |
| `.loca` dosyaları             | Türkçe ve İngilizce metinler, aynı tanıtıcıyla eşleşmiş           |
| bg3.wiki Cargo API            | İnsan bilgisi: konum, nasıl alınır, koşullar                      |
| Kişisel değerlendirme         | Yorum katmanı: avantaj, dezavantaj, build önerileri               |

**Gerekçe:** Yaklaşık 2000 kaydı elle araştırmak aylar sürer ve hata payı yüksektir. Oyun dosyaları en yüksek doğruluğu sağlar. `.loca` dosyaları iki dili aynı tanıtıcıdan verdiği için Türkçe ve İngilizce sürümler otomatik olarak tutarlı üretilir.

**Sonucu:** Elle yazılacak tek şey yorum katmanı kalır — rehberi bir wiki kopyasından ayıran kısım da zaten budur.

---

## 10. Eşya kapsamı: Build'e etki eden her şey

**Karar:** Eşya seçimi nadirlik eşiğine göre değil, oynanışa etkisine göre yapılacak. Erken oyunda güçlü olan Common eşyalar da dahildir.

**Gerekçe:** Nadirlik, gerçek gücün güvenilir bir göstergesi değil. Act 1'de bulunan bazı sıradan eşyalar, o aşamada Rare bir eşyadan daha belirleyici olabiliyor.

**Açık nokta:** "Build'e etki eder" ölçütü yazılı bir kurala bağlanmalı; aksi halde seçim keyfîleşir. Bu, veri şeması tasarımında çözülecek.

---

## 11. Büyü kapsamı: Tam veritabanı

**Karar:** 600+ büyü ve cantrip için ayrı kayıt ve sayfa açılacak.

**Gerekçe:** Sınıf ilerleme tablosu "bu seviyede şu büyüleri seçebilirsin" dediğinde, oyuncunun o büyülerin ne yaptığını aynı yerde görebilmesi gerekiyor. Ayrı bir kaynağa yönlendirmek rehberin bütünlüğünü bozar.

**Bedeli:** Proje kapsamı kabaca ikiye katlandı. Karar 9 sayesinde bu artışın büyük kısmı otomatik veri toplamayla karşılanıyor.

---

## 12. Ek bölümler

**Karar:** Şu bölümler de kapsama dahil: Irklar ve alt ırklar, Geçmişler, Multiclass rehberi, hazır build önerileri.

**Gerekçe:** İlk üçü sınıf bölümünün doğal tamamlayıcısı ve büyük kısmı otomatik veriyle geliyor. Multiclass ve build önerileri tamamen elle yazılacak, ama toplulukta en çok aranan içerik bunlar.

---

## 13. Görseller: İkonlar oyun dosyalarından

**Karar:** Eşya, büyü ve yetenek ikonları oyunun `.pak` arşivlerinden çıkarılacak.

**Gerekçe:** En tutarlı görsel dili sağlar ve wiki ikonlarını kopyalamaktan kaynaklanan atıf sorununu ortadan kaldırır. Zaten `.pak` çıkarma altyapısı karar 9 gereği kurulacak.

**Açık nokta:** Larian'ın telif durumu karar 14 kapsamında değerlendirilecek. Ekran görüntüleri ve harita görselleri ayrıca ele alınacak.

---

## 14. Lisans ve atıf

**Karar:** Rehber, üç katmanlı bir fan içerik çerçevesi altında ve tamamen ücretsiz olarak yayınlanacak. Ayrıntılar `LisansPolitikası.md` belgesindedir.

**Bulunanlar:**

- **Wizards of the Coast Fan Content Policy** D&D içeriğini (sınıflar, büyüler, ırklar) kapsıyor: yalnızca ticari olmayan kullanım, zorunlu bildirim metni, logo/marka yasağı.
- **Larian BG3 Fan Content Terms** oyun içeriğini kapsıyor ve WotC politikasını bütünüyle içine alıyor. Beş kural: ücretsiz tut, fan içeriği olduğunu belirt, dürüst ol, temiz tut, yasal ol. Fan içeriği için bedel alınamaz.
- **bg3.wiki** çift lisanslı: 20 Temmuz 2024 sonrası yazılan sayfalar CC BY-SA 4.0 veya CC BY-NC-SA 4.0 (seçim bizde), öncesi yalnızca CC BY-NC-SA 4.0.

**Alt kararlar:**

1. _Rehber ücretsizdir._ Reklam, ödeme duvarı veya ücretli katman olmaz.
2. _Rehber sitesinde bağış veya Patreon bağlantısı bulunmaz._ Larian tazminat konusunu WotC politikasına havale ettiği ve bağış durumunu açıkça düzenlemediği için bu gri alan tamamen kapatıldı.
3. _bg3.wiki metni kopyalanmaz._ Wiki yalnızca keşif ve doğrulama kaynağıdır; bilgiler kendi cümlelerimizle yazılır.

**Üçüncü kararın gerekçesi:** Telif olguları değil ifadeyi korur. "Bu eşya şu bölgede bulunur" bir olgudur ve kimsenin mülkiyetinde değildir; wiki'nin o cümlesi ise ifadedir ve lisansa tabidir. Metin kopyalanırsa ShareAlike şartı devreye girer ve rehberin tamamı aynı lisans altına girmek zorunda kalır. Metni kendimiz yazarak bu yükümlülük hiç doğmaz — ve bu zaten planlanan veri mimarisiyle uyumlu, çünkü wiki'den beklenen şey konum bilgisiydi, edebi metin değil.

**Zorunlu bildirim:** Her sayfanın alt bilgisinde WotC'nin istediği İngilizce kalıp ve Türkçe açıklaması yer alacak — metin `LisansPolitikası.md` içindedir.

---

## 15. Baz sürüm: Patch 8 / Hotfix #36

**Karar:** İçerik, Patch 8 (Nisan 2025) sürümü esas alınarak yazılacak. En son teknik güncelleme Hotfix #36'dır (26 Mart 2026).

**Gerekçe:** Patch 8 son büyük içerik güncellemesiydi ve her sınıfa birer tane olmak üzere 12 yeni alt sınıf ekledi (toplam 46 alt sınıf). Sonrasında gelenler içerik değil, save ve ilerleme hatalarını gideren teknik düzeltmelerdir. Yani içerik durağan — bir wiki projesinin en büyük riski olan "oyun dengesi sürekli değişiyor" sorunu burada yok.

**Sonucu:** Veri şemasına bir `patchSürümü` alanı konulacak; ileride bir güncelleme gelirse hangi kayıtların yeniden doğrulanması gerektiği belli olur.

---

## 16. Standart: Mevcut belgeye web bölümleri eklendi

**Karar:** Ayrı bir web standardı belgesi yazılmadı; `GeliştiriciStandardı.md` genişletildi.

**Gerekçe:** Tek standart belgesi tüm projelerde geçerli kalır. İki belge iki ayrı bakım yükü demektir ve zamanla birbirinden ayrışır.

**Yapılanlar:** §9 TypeScript ve Astro, §10 İçerik Verisi, §11 CSS ve Stil, §12 URL ve Yönlendirme bölümleri eklendi; eski §9–15 → §13–19 kaydırıldı; §13'e framework klasör istisnası, §14'e web dosya türleri, §15'e TypeScript `const`/`let` kuralı eklendi. Ayrıca §4 başlığındaki `FIX:` / `FIXME:` tutarsızlığı düzeltildi.

---

## 17. TypeScript fonksiyonları: `camelCase`

**Karar:** TypeScript fonksiyonları `camelCase` yazılır (`çeviriAl()`), C#'ın `PascalCase` metot kuralından bilinçli olarak sapılır.

**Gerekçe:** `camelCase`, TypeScript ekosisteminin evrensel konvansiyonu. Tip adlarının `PascalCase`, değer adlarının `camelCase` olması dilin okunma biçiminin parçası. Adın kendisi Türkçe kalır — yalnızca büyük/küçük harf düzeni dile uyar. Aynı mantık standartta `Async` sonekinde de uygulanmıştı.

---

## 18. Parantez stili: Web tarafında K&R

**Karar:** TypeScript, `.astro` ve CSS dosyalarında K&R stili kullanılır; açılış `{` bildirimle aynı satırda kalır. C# tarafında Allman kuralı değişmez.

**Gerekçe:** Araçsal zorunluluk. Bu ekosistemin standart biçimlendiricisi Prettier'ın parantez stili seçeneği yok — K&R'ı zorla uygular. Allman'da ısrar etmek Prettier'ı devre dışı bırakıp biçimlendirmeyi elle yönetmek demek; bu, 2000+ dosyalık bir projede tutarlılığı korumak yerine tehdit eder.

---

## 19. Klasör adlandırma: `PascalCase` + framework istisnası

**Karar:** Bizim açtığımız tüm klasörler İngilizce `PascalCase` olur. Framework'ün adını dayattığı klasörler (`src/pages`, `src/content`, `src/layouts`, `src/components`, `public`, `node_modules`) olduğu gibi bırakılır.

**Gerekçe:** Astro bu klasör adlarını sözleşme olarak bekler; `src/Pages/` yazılırsa sayfalar bulunamaz. Bu klasörler bizim adlandırmamız değildir. Kural yalnızca bize ait klasörlere uygulanır: `src/content/Items/` `PascalCase` olur, onu içeren `src/content` dokunulmaz.

---

## Açık kalan kararlar

Aşağıdakiler henüz karara bağlanmadı ve ilgili faz başlamadan önce çözülmesi gerekir:

| Konu                                 | Ne zaman gerekli        |
| ------------------------------------ | ----------------------- |
| "Build'e etki eder" ölçütü (10)      | Veri şeması tasarımında |
| Ekran görüntüsü ve harita politikası | Görsel fazında          |
| Veri şeması alan listeleri           | Bir sonraki adım        |
