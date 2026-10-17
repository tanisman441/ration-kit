# Kit çizim kategorileri

Anlatım videolarında en sık ihtiyaç duyulan çizimler, öncelik sırasıyla. **P1** = önce bunlar (her videoda lazım),
**P2** = sık lazım, **P3** = konuya özel. İsimler `kategori/isim` biçiminde; dosya `engine/kit/assets/<kategori>/<isim>.js`.
Bitince `[x]`.

## characters — insanlar (hepsi aynı stil ailesinden)
- [x] P1 characters/person — sade, cinsiyetsiz insan; pozlar: stand|walk|point|think|cheer; params: color, mood (happy|neutral|sad|surprised)
- [x] P1 characters/crowd — 5–12 kişilik kalabalık; params: count, color
- [x] P1 characters/gamer — kulaklıklı, masada oyun oynayan kişi; params: active (tıklama/tepki zamanı)
- [x] P2 characters/soldier — FPS askeri; pozlar: idle|aim|run; params: team, hit (vurulma zamanı)
- [x] P2 characters/scientist — önlüklü bilim insanı; pozlar: explain|experiment
- [x] P2 characters/hacker — kapüşonlu, laptop başında
- [x] P2 characters/worker — baretli işçi
- [ ] P3 characters/doctor, characters/teacher, characters/kid, characters/robot

## tech — teknoloji ve ağ
- [x] P1 tech/server-rack — LED'li sunucu kabini; params: load 0–1, alert (zaman)
- [x] P1 tech/laptop — params: screen (code|chart|game|blank)
- [x] P1 tech/phone — params: screen (chat|app|call|blank), notify (zaman)
- [x] P1 tech/router — anten ve trafik ışıkları; params: traffic 0–1
- [x] P1 tech/cloud — bulut sunucu; params: sync (zaman)
- [x] P1 tech/database — params: activity 0–1
- [x] P2 tech/chip — işlemci; params: activity 0–1
- [x] P2 tech/satellite, tech/cable-bundle, tech/monitor-setup, tech/gpu, tech/keyboard-mouse
- [ ] P3 tech/data-center (geniş sahne), tech/fiber-line

## fx — efektler
- [x] P1 fx/explosion — flaş, ateş topu, duman halkası, parçalar; params: at (zaman), size
- [x] P1 fx/fire — döngülü alev; params: intensity 0–1
- [x] P1 fx/smoke — yükselen duman; params: density
- [x] P1 fx/sparks — kıvılcım patlaması; params: at (zaman)
- [x] P1 fx/electric — elektrik arkı / yıldırım; params: at (zaman)
- [x] P2 fx/water-splash, fx/dust-puff, fx/confetti, fx/shockwave-ground, fx/speed-lines
- [ ] P3 fx/portal, fx/magic-burst

## weapons — silahlar (orijinal tasarım, marka yok)
- [x] P2 weapons/rifle — params: fire (zaman); points: muzzle, grip
- [x] P2 weapons/pistol — params: fire (zaman); points: muzzle, grip
- [x] P2 weapons/sniper — params: fire (zaman), scope glint
- [ ] P3 weapons/shotgun, weapons/grenade (params: throw, explode), weapons/knife, weapons/bullet (uçan mermi + iz)

## environment — mekân ve nesneler
- [x] P1 environment/wall — beton duvar/siper; params: hit (zaman: toz + parça)
- [x] P1 environment/crate — kasa; variant: wood|metal
- [x] P1 environment/door — params: open 0–1
- [x] P1 environment/building — bina cephesi; variant: house|office|factory; params: lights 0–1
- [x] P2 environment/tree, environment/road (yatay şerit), environment/bridge, environment/fence, environment/barrel
- [ ] P3 environment/city-skyline, environment/mountain, environment/room-interior

## maps — haritalar ve kuşbakışı
- [x] P2 maps/arena-topdown — FPS haritası: duvarlar, iki doğma noktası, koridorlar; params: highlight (none|a|b|mid)
- [x] P2 maps/world — basit dünya haritası; params: highlight (bölge)
- [ ] P3 maps/city-grid, maps/network-topology

## science — bilim
- [x] P2 science/atom — params: electrons, spin
- [x] P2 science/cell — params: divide (zaman)
- [x] P2 science/dna — dönen sarmal
- [x] P2 science/beaker — params: bubbles, color
- [ ] P3 science/magnet, science/planet, science/microscope, science/virus

## economy — para ve ekonomi
- [ ] P2 economy/coin — params: flip (zaman)
- [ ] P2 economy/money-stack — params: amount 0–1
- [ ] P2 economy/bank — banka binası
- [ ] P2 economy/shopping-cart, economy/credit-card, economy/price-tag
- [ ] P3 economy/stock-ticker, economy/factory-line

## transport — ulaşım
- [ ] P3 transport/car, transport/truck, transport/plane, transport/ship, transport/rocket (params: launch zaman)

## ui — arayüz parçaları
- [x] P1 ui/style-sheet — stil rehberi referans tahtası (bkz. STYLE.md)
- [x] P1 ui/chat-bubble — params: text, side (left|right), at (zaman)
- [x] P1 ui/notification — params: title, text, at (zaman)
- [ ] P2 ui/killfeed — params: killer, victim, at (zaman)
- [ ] P2 ui/health-bar-hud — oyun içi HUD can/zırh
- [ ] P2 ui/loading-spinner, ui/progress-ring, ui/cursor-click, ui/browser-window
