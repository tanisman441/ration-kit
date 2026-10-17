# Ration kit — stil rehberi

Bütün çizimler bu rehbere uyar. Amaç: telefonda 200 px boyutta bile ne olduğu anlaşılan,
iki temada (night/paper) da okunan, aynı "aileden" görünen düz (flat) vektör çizimler.

## Genel dil
- Düz vektör, yumuşak köşeler (`k.rrect`, köşe yarıçapı ≥ 8 local units), sınırlı detay.
- Bir çizim = 5–9 şekil. Siluet tek başına tanınmalı; iç detay minimum.
- Arka plan boyanmaz. Canvas state'i `save`/`restore` ile korunur.
- `draw` saf fonksiyondur: `Math.random` yok — varyasyon için `k.hash(n)` / `k.noise1(x)`.

## Oranlar — karakter ailesi
- Baş : gövde ≈ 1 : 2.6. Baş = hafif basık daire (rx = ry × 0.92). Gövde = rrect.
- Kol/bacak = kalın çizgi; kalınlık = baş genişliğinin ~0.28'i, uçlar yuvarlak (`lineCap: 'round'`).
- El = çizgi ucundaki yuvarlaklık; ayak = kısa yatay rrect. Parmak çizilmez.
- Yüz: iki nokta göz (r = baş genişliğinin 0.055'i, göz aralığı = baş genişliğinin 0.22'si),
  ağız = kısa yay. `mood` paramı yüzü değiştirir:
  - happy: gözler `^` (yukarı yay), ağız gülümseme yayı
  - neutral: nokta gözler, düz kısa çizgi ağız
  - sad: nokta gözler, ters yay ağız
  - surprised: nokta gözler (hafif büyük), `O` ağız
- Bütün karakterler aynı kafa/gövde oranını ve aynı yüz dilini kullanır — crowd'daki
  her figür, gamer, person hep bu ailedendir.

## Çizgi ve gölge
- Dış hat: `bg` rengi, alfa 0.55, kalınlık = box genişliğinin ~0.03'ü (4–8 px eşdeğeri).
  İç ayrım çizgileri aynı renk, alfa 0.35, daha ince.
- Gölge: tek ton, %12 koyultma (`k.rgba` ile aynı rengin koyusu), sağ alta 6 units offset.
  Işık sol üstten gelir varsayılır.
- Glow sadece anlamlı ışıklarda (LED, ateş, elektrik): `k.glow(x, y, r, renk, alfa ≤ 0.5)`.

## Renk
- Sadece tema renkleri: `k.col('ink' | 'dim' | 'bg' | 'panel' | 'panel2' | 'accent' |
  'red' | 'cyan' | 'yellow' | 'green' | 'purple')`.
- Ana gövde iki temada da okunan tonlarda: `dim`, `panel2`, `ink` (sıralama: önce `dim` dene).
- Çizim başına **en fazla 1 vurgu rengi**; vurgu anlam taşır (tehlike = red, veri = cyan,
  enerji = yellow). `color` paramı ana rengi değiştirir.
- Efektler (ateş, patlama) sıcak renkler (yellow → red) kullanır; duman `dim`'dir.

## Hareket
- Boşta (idle) hareket hafif ve döngülü: nefes (gövde ±2 units, ~2.4 sn periyot),
  göz kırpma (3–5 sn'de bir, 0.12 sn), LED yanıp sönme (`k.hash` tabanlı), titreme
  (`k.noise1`, ±1.5 units). Asla dikkat dağıtacak kadar büyük değil.
- Olay anı net ve kısa: ateş/flaş 0.12–0.2 sn, geri tepme 0.25 sn, parçacıklar 0.4–0.8 sn
  sonra sönümlenir. `time` paramları asset'in kendi `t`'sine göredir.

## Sözleşme detayları
- `box`: çizimin kapladığı alan; efekt taşması için `bleed` verilir. `anchor` açıklamasında
  (0,0)'ın neresi olduğu yazılır (örn. "ayaklar", "gövde merkezi", "taban").
- `points`: başka öğelerin bağlanacağı noktalar (`muzzle`, `head`, `top`…). İsimler küçük harf.
- `tags`: en az 5, Türkçe + İngilizce karışık.
- `desc`: tek cümle, çizimin neye benzediği.
- `params`: filmin ayarlayabileceği her şey; her birine `default` şart.

## Premium finish (17 Ekim 2026 — çıta yükseltme)
- Her ana formda sol üstten **yumuşak parlama**: beyaz, alfa 0.10–0.12, kontursuz elips.
  Işık her çizimde aynı yönden (sol üst) gelir; parlama da hep sol üsttedir.
- Gölgeyle parlama birlikte kullanılır: sağ alt %12 koyultma + sol üst %10 aydınlatma =
  hafif hacim hissi, hâlâ düz (flat) görünüm.
- Parlama asla metin/ekran gibi bilgi taşıyan yüzeylere uygulanmaz.
- İç detay çizgileri (yüz, klavye tuşu vb.) `ink` rengi, alfa 0.75, ince (3–4 birim).

## Referans tahtası
`ui/style-sheet` asset'i bu rehberin görsel özetidir: oran çubuğu (baş/gövde),
renk paleti (iki temada), çizgi kalınlıkları, dört yüz ifadesi, gölge yönü.
Yeni çizer önce bu tahtaya bakar.
