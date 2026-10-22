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
- [x] P3 characters/doctor, characters/teacher, characters/kid, characters/robot

## tech — teknoloji ve ağ
- [x] P1 tech/server-rack — LED'li sunucu kabini; params: load 0–1, alert (zaman)
- [x] P1 tech/laptop — params: screen (code|chart|game|blank)
- [x] P1 tech/phone — params: screen (chat|app|call|blank), notify (zaman)
- [x] P1 tech/router — anten ve trafik ışıkları; params: traffic 0–1
- [x] P1 tech/cloud — bulut sunucu; params: sync (zaman)
- [x] P1 tech/database — params: activity 0–1
- [x] P2 tech/chip — işlemci; params: activity 0–1
- [x] P2 tech/satellite, tech/cable-bundle, tech/monitor-setup, tech/gpu, tech/keyboard-mouse
- [x] P3 tech/data-center (geniş sahne), tech/fiber-line

## fx — efektler
- [x] P1 fx/explosion — flaş, ateş topu, duman halkası, parçalar; params: at (zaman), size
- [x] P1 fx/fire — döngülü alev; params: intensity 0–1
- [x] P1 fx/smoke — yükselen duman; params: density
- [x] P1 fx/sparks — kıvılcım patlaması; params: at (zaman)
- [x] P1 fx/electric — elektrik arkı / yıldırım; params: at (zaman)
- [x] P2 fx/water-splash, fx/dust-puff, fx/confetti, fx/shockwave-ground, fx/speed-lines
- [x] P3 fx/portal, fx/magic-burst

## weapons — silahlar (orijinal tasarım, marka yok)
- [x] P2 weapons/rifle — params: fire (zaman); points: muzzle, grip
- [x] P2 weapons/pistol — params: fire (zaman); points: muzzle, grip
- [x] P2 weapons/sniper — params: fire (zaman), scope glint
- [x] P3 weapons/shotgun, weapons/grenade (params: pin, explode), weapons/knife, weapons/bullet (uçan mermi + iz)

## environment — mekân ve nesneler
- [x] P1 environment/wall — beton duvar/siper; params: hit (zaman: toz + parça)
- [x] P1 environment/crate — kasa; variant: wood|metal
- [x] P1 environment/door — params: open 0–1
- [x] P1 environment/building — bina cephesi; variant: house|office|factory; params: lights 0–1
- [x] P2 environment/tree, environment/road (yatay şerit), environment/bridge, environment/fence, environment/barrel
- [x] P3 environment/city-skyline, environment/mountain, environment/room-interior

## maps — haritalar ve kuşbakışı
- [x] P2 maps/arena-topdown — FPS haritası: duvarlar, iki doğma noktası, koridorlar; params: highlight (none|a|b|mid)
- [x] P2 maps/world — basit dünya haritası; params: highlight (bölge)
- [x] P3 maps/city-grid, maps/network-topology

## science — bilim
- [x] P2 science/atom — params: electrons, spin
- [x] P2 science/cell — params: divide (zaman)
- [x] P2 science/dna — dönen sarmal
- [x] P2 science/beaker — params: bubbles, color
- [x] P3 science/magnet, science/planet, science/microscope, science/virus

## economy — para ve ekonomi
- [x] P2 economy/coin — params: spin (0-1)
- [x] P2 economy/money-stack — params: amount 0–1
- [x] P2 economy/bank — banka binası
- [x] P2 economy/shopping-cart, economy/credit-card, economy/price-tag
- [x] P3 economy/stock-ticker, economy/factory-line

## transport — ulaşım
- [x] P3 transport/car, transport/truck, transport/plane, transport/ship, transport/rocket (params: launch zaman)

## ui — arayüz parçaları
- [x] P1 ui/style-sheet — stil rehberi referans tahtası (bkz. STYLE.md)
- [x] P1 ui/chat-bubble — params: text, side (left|right), at (zaman)
- [x] P1 ui/notification — params: title, text, at (zaman)
- [x] P2 ui/killfeed — params: killer, victim, at (zaman)
- [x] P2 ui/health-bar-hud — oyun içi HUD can/zırh
- [x] P2 ui/loading-spinner, ui/progress-ring, ui/cursor-click, ui/browser-window

## GENİŞLEME — sürekli büyüme kuyruğu (7/24 iş buradan beslenir)
Kural: listedeki ilk `[ ]` kategori alınır, çizilir, `[x]` yapılır, commit + push edilir.
Her kategori 4–6 çizim; stil STYLE.md'ye uyar; her çizim 2 tur görsel kontrol.

- [x] X1 sports — ball (params: bounce time), goal, trophy, whistle, medal, stadium
- [x] X2 animals — cat, dog, bird (params: fly time), fish, horse, bee
- [x] X3 food — apple, burger, pizza, coffee (params: steam time), cake, bread
- [x] X4 nature — flower, rain (params: intensity), snow, sun, moon, star
- [x] X5 music — note, guitar, drum (params: hit time), speaker, microphone, headphones
- [x] X6 home — bed, chair, lamp (params: on 0-1), sofa, tv (params: screen), fridge
- [x] X7 office — desk, folder, printer (params: print time), calendar, clock (params: time)
- [x] X8 school — book, pencil, backpack, blackboard (params: text), ruler, graduation-cap
- [x] X9 health — heart (params: beat time), pill, syringe, ambulance, mask, thermometer
- [x] X10 fantasy — sword, shield, crown, dragon, castle, wand (params: cast time), potion
- [x] X11 icons — check, cross, warning, info, question, star-rating (params: rating), heart-like, thumbs-up
- [x] X12 professions — police, firefighter, chef, pilot, nurse, farmer (characters ailesinden)
- [x] X13 vehicles-2 — bicycle, motorcycle, bus, train, helicopter, tractor
- [x] X14 weather-fx — rainbow, lightning-storm, fog, tornado, hail, aurora
- [x] X15 space — astronaut, ufo, galaxy, satellite-dish, space-station, comet (params: fly time)
- [x] X16 fx-2 — teleport, heal-glow, poison-cloud, frost, shockwave-air, energy-beam (hepsi animasyonlu)
- [x] X17 character-actions — run-cycle, jump, fall, wave, sit, dance (person ailesi, time-param aksiyonlar)
- [x] X18 nature-fx — waterfall, leaves-fall, waves, clouds-drift, sunrise, volcano (döngüsel animasyonlar)
- [x] X19 ui-animated — toast, tooltip, modal-pop, skeleton-loader, toggle-switch, tab-bar (at ile giriş animasyonu)
- [x] X20 combat-fx — slash, punch-impact, block-shield, dash-trail, charge-up, ko-stars (vuruş efektleri)
- [x] X21 vehicle-fx — exhaust-smoke, drift-skid, headlight-beam, siren-light, propeller-spin, tire-tracks
- [x] X22 magic-2 — summon-circle, spell-cast, levitate, morph, invisibility, time-rewind
- [x] X23 sports-fx — slowmo-run, score-flash, whistle-blast, crowd-wave, timer-countdown, replay-arrow (spor aksiyon efektleri)
- [x] X24 particle-fx — sparkle-burst, confetti-pop, smoke-puff, dust-devil, bubbles-rise, ember-drift (parçacık patlamaları)
- [x] X25 liquid-fx — splash-drop, pour-stream, ripple-ring, drip-fall, bubble-pop, wave-crash (sıvı animasyonları)
- [x] X26 ui-feedback — button-press, progress-ring, loading-dots, success-check, error-shake, pull-refresh (UI mikro animasyonlar)
- [x] X27 character-emote — jump-joy, shock-gasp, anger-vein, sweat-drop, heart-eyes, dizzy-spiral (duygu efektleri, characters ailesi)
- [x] X28 text-fx — typewriter-caret, highlight-sweep, shake-text, pop-word, count-up, glitch-text (metin animasyonları)
- [x] X29 gadget-fx — wifi-radiate, battery-charge, signal-bars, radar-sweep, touch-ripple, scan-line (cihaz mikro animasyonları)
- [x] X30 thought-fx — thought-bubble-pop, question-spin, lightbulb-flicker, idea-burst, brain-wave, memory-rewind (düşünce/fikir efektleri)
- [x] X31 construction-fx — drill-spark, hammer-hit, saw-dust, weld-flash, crane-swing, crumble (inşaat aksiyon efektleri)
- [x] X32 kitchen-fx — sizzle, chop, stir, steam-puff, crack-egg, whisk-spin (yemek hazırlık animasyonları)
- [x] X33 nature-cycle — day-night, seasons, tide, bloom, rain-shower, snowfall (döngüsel doğa sahneleri)
- [x] X34 music-fx — beat-pulse, vinyl-spin, equalizer-bars, sound-wave, note-float, speaker-thump (müzik ritim efektleri)
- [x] X35 gesture-fx — point-finger, wave-hand, swipe-arrow, pinch-zoom, fist-pump, thumbs-up-pop (el jest animasyonları; characters ailesi)
- [x] X36 money-fx — coins-fall, cash-rain, card-swipe, coin-spin-glow, price-drop, wallet-open (para/ödeme animasyonları)
- [x] X37 social-fx — like-burst, subscribe-bell, share-arrows, comment-typing, follow-pop, view-count-up (sosyal medya animasyonları)
- [x] X38 time-fx — countdown-ring, hourglass-flow, clock-tick, timer-alarm, calendar-flip, fast-forward (zaman/sayaç animasyonları)
- [x] X39 chat-fx — typing-dots, message-pop, emoji-react, voice-wave, read-checks, sticker-slam (mesajlaşma animasyonları)
- [x] X40 progress-fx — level-up, xp-bar-fill, trophy-shine, rank-badge, combo-counter, milestone-flag (ilerleme/başarı animasyonları)
- [x] X41 battle-fx — hit-spark, armor-crack, sword-clash, bullet-time, dodge-ghost, blast-shock (çarpışma/dövüş aksiyon efektleri)
- [x] X42 alert-fx — alarm-blink, danger-ping, warning-bar, sonar-ping, radar-alert, shield-up (uyarı/alarm animasyonları)
- [x] X43 pointer-fx — cursor-click-pop, drag-trail, hover-glow, loading-ring, double-click, scroll-flash (fare/imleç mikro animasyonları)
- [x] X44 celebration-fx — fireworks, balloon-rise, champagne-pop, banner-drop, trophy-glow, party-popper (kutlama animasyonları)
- [x] X45 fail-fx — crash-shatter, glitch-burst, red-x-stamp, down-arrow-fall, error-scan, smoke-fizzle (hata/başarısızlık efektleri)
- [x] X46 door-fx — door-slam, knock-wave, lock-click, creak-open, peek-eye, bell-ding (kapı/kilit aksiyon animasyonları)
- [x] X47 crowd-reactions — cheer-burst (params: at zaman), boo-shake, wave-pass, clap-sync, gasp-hands, sing-along (kalabalık tepki animasyonları)
- [x] X48 mechanics-fx — gear-turn (params: spin 0-1), piston-pump, belt-drive, spring-bounce (params: pull zaman), crank-rotate, valve-steam (params: open zaman) (makine hareket animasyonları)
- [x] X49 lab-fx — fizz-bubble, titration-drip (params: drop zaman), stir-spin, flame-test (params: ignite zaman), crystallize, spill-spread (laboratuvar deney animasyonları)
- [x] X50 disaster-fx — earthquake-shake (params: shake 0-1), lightning-strike (params: at zaman), tsunami-wave, wildfire-spread, landslide-tumble, flood-rise (afet animasyonları)
- [x] X51 travel-fx — ticket-scan (params: scan zaman), passport-stamp (params: stamp zaman), luggage-roll, boarding-pass-pop, takeoff-roll, landing-gear (params: down zaman) (seyahat aksiyon animasyonları)
- [x] X52 fire-fx — ignition-flare (params: at zaman), smoke-column, ember-burst, campfire-dance, extinguisher-spray, flame-fan (ateş/duman animasyonları)
- [x] X53 wind-fx — wind-gust, leaf-tumble, flag-flap, dust-blow, kite-dive, windsock-swing (rüzgar hareket animasyonları)
- [x] X54 electric-fx — arc-zap (params: at zaman), spark-shower, fuse-blow, circuit-trace, neon-flicker, plug-zap (elektrik animasyonları)
- [x] X55 water-fx-2 — whirlpool, geyser-burst, fountain-arcs, tidal-surge, drip-ripple, ice-spread (su animasyonları)
- [x] X56 space-fx-2 — meteor-burn (params: at zaman), thruster-burn, beam-up, solar-flare, blackhole-swirl, starfield-drift (uzay aksiyon efektleri)
- [x] X57 horror-fx — flicker-lights, shadow-lunge, ghost-float, blood-drip, candle-blow (params: at zaman), mirror-crack (korku animasyonları)
- [x] X58 cyber-fx — hack-pulse (params: at zaman), data-shred, firewall-block (params: at zaman), glitch-reveal, virus-infect, keygen-spin (siber saldırı efektleri)
- [x] X59 ocean-fx — bubble-column, jellyfish-drift, fish-school, coral-sway, sonar-ripple (params: at zaman), angler-glow (okyanus sahnesi animasyonları)
- [x] X60 factory-fx — conveyor-move, stamp-press (params: at zaman), robot-arm (params: grab zaman), safety-laser, weld-sparks, belt-blink (fabrika hattı animasyonları)
- [x] X61 traffic-fx — brake-skid (params: at zaman), turn-signal, wipers-swipe, airbag-pop (params: at zaman), horn-wave, drift-smoke (trafik aksiyon animasyonları)
- [x] X62 spell-duel — magic-missile (params: at zaman), shield-bubble (params: at zaman), ice-shard, lightning-arc (params: at zaman), summon-rune (params: at zaman), mana-burst (büyü düello efektleri)
- [x] X63 classroom-fx — chalk-write, paper-plane (params: fly zaman), hand-raise, eraser-wipe, page-flip, beaker-pop (params: at zaman) (sınıf sahnesi animasyonları)
- [x] X64 superhero-fx — cape-flutter (pelerin salınımı), power-punch (params: at zaman), laser-eyes (params: at zaman), hero-landing (params: at zaman), web-shot (params: at zaman), speed-lines (süper kahraman aksiyon animasyonları)
- [x] X65 robot-fx — drone-hover (havada asılı kalış), laser-scan (params: at zaman), hologram-flicker, mech-step (params: step zaman), charge-plug (params: charge 0-1), robot-eye-glow (robot sahnesi animasyonları)
- [x] X66 winter-fx — avalanche-roll (params: at zaman), snowman-build, snowball-throw (params: at zaman), penguin-slide, ice-skate (params: glide zaman), igloo-wind (kış sahnesi animasyonları)
- [x] X67 space-travel — wormhole-spin, rocket-dock (params: at zaman), gravity-float, comet-tail, moon-base-light, oxygen-bubble (uzay yolculuğu animasyonları)
- [x] X68 farm-fx — chicken-run (params: run zaman), tractor-bounce, scarecrow-wave, milk-splash (params: at zaman), sunflower-turn, chick-hatch (params: at zaman) (çiftlik animasyonları)
- [x] X69 arcade-fx — coin-insert (params: at zaman), pixel-explosion (params: at zaman), joystick-wiggle, game-over-flash, highscore-pop (params: at zaman), screen-crack (retro oyun animasyonları)
- [x] X70 circus-fx — juggling (params: throw zaman), trapeze-swing, clown-balloon (params: pop zaman), tightrope-walk, fire-breath (params: at zaman), hoop-jump (sirk aksiyon animasyonları)
- [x] X71 stage-fx — spotlight-sweep, curtain-open (params: at zaman), mic-drop (params: at zaman), stage-lights-flash, smoke-machine, crowd-surf (sahne/performans animasyonları)
- [x] X72 pet-fx — dog-tail-wag, cat-pounce (params: at zaman), fish-bowl-bubbles, parrot-flap, hamster-wheel (params: speed 0-1), tail-chase (evcil hayvan animasyonları)
- [x] X73 kitchen-fx-2 — pan-flip (params: at zaman), popcorn-pop (params: at zaman), blender-swirl, cheese-pull, soup-simmer, soda-fizz (mutfak/yemek aksiyon animasyonları)
- [ ] X74 garden-fx — sprinkler-spray, mower-pass, butterfly-flap, apple-pick (params: at zaman), worm-dig, rain-barrel-drip (bahçe animasyonları)
- [ ] X75 workout-fx — pushup, dumbbell-lift, jump-rope, plank-wobble, treadmill-run, yoga-stretch (params: rep zaman; egzersiz animasyonları, characters ailesi)
- [ ] X76 aquarium-fx — fish-glide, plant-sway, air-bubbles, octopus-ink (params: at zaman), treasure-glow, diver-light (akvaryum sahnesi animasyonları)
- [ ] X77 camping-fx — campfire-sparks, lantern-swing, marshmallow-toast (params: at zaman), hammock-sway, owl-hoot (params: at zaman), tent-pitch (kamp sahnesi animasyonları)
- [ ] X78 desert-fx — tumbleweed-roll, mirage-shimmer, cactus-sway, sandstorm-sweep, oasis-ripple, camel-walk (çöl sahnesi animasyonları)
- [ ] X79 volcano-fx — eruption-burst (params: at zaman), lava-flow, ash-fall, magma-bubble, steam-vent, pyroclast-surge (yanardağ animasyonları)
- [ ] X80 medieval-fx — knight-march, arrow-rain (params: at zaman), torch-flicker, trebuchet-launch (params: at zaman), drawbridge-lower (params: at zaman), shield-wall (ortaçağ savaş animasyonları)
