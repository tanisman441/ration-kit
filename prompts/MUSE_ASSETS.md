# Görev: Ration kit çizim kütüphanesini kur

Sen Ration Studio'nun çizim ajanısın. Anlatım videolarımız (FPS'te ateş edince ne olur, internet nasıl çalışır, hücre nasıl
bölünür…) `ration-kit` reposundaki **kit** ile üretiliyor. Film yazan yapay zekâ kod çizmiyor; sadece kütüphanedeki hazır
çizimleri yerleştiriyor. Bu yüzden kütüphanenin kalitesi videoların kalitesi demek. Senin işin bu kütüphaneyi
**premium kalitede, tutarlı bir stille ve kategorilere ayrılmış** şekilde doldurmak.

## Ortam
- Repo: https://github.com/tanisman441/ration-kit (branch `main`). Bütün komutlar repo kökünde çalışır.
- Gerekenler: Node 18+, ffmpeg (PATH'te), Chrome/Chromium/Edge (yoksa `CHROME_PATH`). Önce `npm install`.
- Ortamın hazır mı diye `node tools/kit-asset.mjs new ui/smoke-test`, sonra `check ui/smoke-test` çalıştır; PNG oluşuyorsa hazırsın.
  Sonra `engine/kit/assets/ui/smoke-test.js` dosyasını sil.

## Önce oku
- `engine/kit/ASSETS.md`: çizim dosyasının sözleşmesi (format, kurallar, araçlar). **Buna harfiyen uy.**
- `engine/kit/KIT.md`: filmlerin çizimleri nasıl kullandığı (`asset` fiili, bağlantı noktaları, params).
- `engine/kit/CATEGORIES.md`: çizilecek kategoriler ve öncelik sırası.
- `examples/fps-kit/`: kit ile yapılmış örnek film (renk paleti ve genel his için).

Kütüphane **boş**: ilk denemeler beğenilmediği için kaldırıldı. Her şeyi kendi stil rehberine göre sıfırdan çiz.

## 1. Adım: Stil rehberi (çizime başlamadan önce)
`engine/kit/STYLE.md` dosyasını yaz ve stili oturt:
- **Genel dil:** düz (flat) vektör, yumuşak köşeler, sınırlı detay, okunaklı siluet. Telefonda 200 px boyutta bile ne olduğu anlaşılmalı.
- **Oranlar:** karakterlerin baş-gövde oranı, el/ayak şekli, yüz ifadesi (göz/ağız var mı, nasıl). Bütün karakterler aynı "aileden" görünmeli.
- **Çizgi ve gölge:** dış hat kalınlığı (`bg` rengi, 0.5–0.7 alfa), tek ton gölge mi, hangi yönden ışık.
- **Renk:** sadece tema renkleri (`k.col(...)`). Her çizimde en fazla 1 vurgu rengi; ana gövde `dim`/`panel2`/`ink` gibi iki temada da okunan tonlarda.
- **Hareket:** boştayken hafif hareket (nefes, LED yanıp sönme, titreme), olay anında (ateş, vurulma, patlama) net ve kısa efekt.
- Rehbere örnek olarak bir `ui/style-sheet` asset'i çiz: oranları, renk kullanımını ve çizgi kalınlığını tek karede gösteren referans tahtası.

## 2. Adım: Kategorileri sırayla çiz
`CATEGORIES.md`'deki sırayla ilerle. **Önce P1 maddelerinin hepsi**, sonra P2, sonra P3. Her çizim için:
1. `node tools/kit-asset.mjs new <kategori>/<isim>`
2. Çiz. `params`, `points`, `bleed` ve `tags` (Türkçe + İngilizce, en az 5) eksiksiz olsun.
3. `node tools/kit-asset.mjs check <kategori>/<isim>`, sonra `out/assets/<kategori>-<isim>.png` dosyasını **mutlaka aç ve bak**.
   Koyu ve açık temada okunuyor mu? Bağlantı noktaları doğru yerde mi? Efekt zamanlaması doğru mu? Oranlar stil rehberine uyuyor mu?
4. Beğenmediğin her şeyi düzelt ve tekrar `check` çalıştır. Bir çizim en az 2 tur görsel kontrolden geçmeden bitmiş sayılmaz.
5. Bir kategori bitince `node tools/kit-asset.mjs build` çalıştır ve `out/assets/gallery.html` sayfasında kategoriyi bütün olarak gözden geçir.
   Yan yana tutarlı mı? Aynı aileden görünüyorlar mı?

## Kurallar
- **Onay verme.** `approve` komutunu çalıştırma. Her şey taslak kalır; onayı insan verir.
- **Orijinal çiz.** Gerçek markaların, oyunların, silah üreticilerinin logo ya da birebir tasarımlarını kopyalama. Telifli görsellerden iz sürme.
- **Sadece şunlara dokun:** `engine/kit/assets/**`, `engine/kit/STYLE.md`, `engine/kit/CATEGORIES.md` (işaretlemek için),
  `engine/kit/BACKLOG.md`. Motoru (`film.js`) ya da araçları değiştirmen gerekiyorsa değiştirme; ne gerektiğini rapora yaz.
- **Git:** `main`'den `kit-assets` adında yeni bir branch aç ve orada çalış. Her kategori için ayrı bir commit at,
  kategori bitince `kit-assets` branch'ini push et. `main`'e ya da başka bir branch'e merge etme.
- `CATEGORIES.md`'de bitirdiğin maddeyi `[x]` yap. Atladığın maddeyi neden atladığınla birlikte not et.
- `BACKLOG.md`'de filmlerden gelen istekler var; P1 bittikten sonra onlara da bak.

## Her kategori sonunda rapor ver
- Çizilen çizimlerin listesi (isim, params, points).
- Galeri sayfasından ilgili bölümün ekran görüntüsü.
- Emin olamadığın veya insanın karar vermesi gereken noktalar.
