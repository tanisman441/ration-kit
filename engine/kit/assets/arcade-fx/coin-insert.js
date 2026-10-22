// arcade-fx/coin-insert — retro arcade kabini: jeton yuvasına yatay kayarak girer,
// at anında (0.9 sn) jeton kayar + yuvada flaş halkası + LED'ler yeşile döner.
// Boşta: marquee ışıkları kovalamaca, ekrandaki jeton ikonu nabız atar, LED'ler yanıp söner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; taban (0,0), kabin yukarı uzar.
export default {
  name: 'coin-insert', category: 'arcade-fx',
  desc: 'Retro arcade kabini; jeton yuvaya kayar, LED ve ekran tepki verir',
  tags: ['jeton', 'arcade', 'atari', 'oyun makinesi', 'jeton atma', 'coin', 'insert coin', 'arcade machine', 'token', 'slot'],
  box: [-120, -320, 120, 10],
  bleed: 60,
  anchor: 'taban (0,0); kabin yukarı uzar',
  points: { slot: [72, -102], screen: [0, -210] },
  params: {
    at: { type: 'time', default: null, desc: 'jetonun yuvaya giriş anı (0.9 sn: kayma + flaş)' },
    color: { type: 'color', default: 'purple', desc: 'kabinin yan şerit ve marquee vurgu rengi' },
  },
  draw(ctx, t, p, k) {
    const LW = 7, line = k.rgba('bg', 0.55), acc = k.rgba(p.color);
    const d = p.at == null ? 1e9 : t - p.at;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // zemin gölgesi
    ctx.fillStyle = k.rgba('bg', 0.35);
    ctx.beginPath(); ctx.ellipse(0, -2, 105, 10, 0, 0, k.TAU); ctx.fill();

    // gövde
    blob(-95, -310, 190, 300, 16, k.rgba('panel2'));
    // sol üst parlama (alfa 0.10) + sağ alt gölge (%12)
    ctx.save();
    ctx.beginPath(); k.rrect(-95, -310, 190, 300, 16); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-52, -272, 36, 22, -0.4, 0, k.TAU); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)';
    ctx.fillRect(15, -175, 80, 165);
    ctx.restore();

    // yan şeritler
    ctx.fillStyle = acc;
    ctx.beginPath(); k.rrect(-95, -306, 16, 292, 8); ctx.fill();
    ctx.beginPath(); k.rrect(79, -306, 16, 292, 8); ctx.fill();

    // marquee: vurgu bant + kovalamaca ışıkları
    blob(-80, -305, 160, 34, 10, acc);
    for (let i = 0; i < 3; i++) {
      const on = ((t * 2 + i) % 3) < 1;
      ctx.fillStyle = on ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)';
      ctx.beginPath(); ctx.arc(-40 + i * 40, -288, 7, 0, k.TAU); ctx.fill();
    }

    // ekran: çerçeve + yüzey
    blob(-78, -262, 156, 104, 10, k.rgba('ink'));
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(-70, -254, 140, 88, 6); ctx.fill();
    // ekrandaki jeton ikonu: nabız atar, at anında büyüyüp onaylar
    let coinPop = 0;
    if (d >= 0.35 && d < 0.65) coinPop = Math.sin(((d - 0.35) / 0.3) * Math.PI) * 0.55;
    const cp = 1 + 0.08 * Math.sin(t * k.TAU / 2.4) + coinPop;
    ctx.save(); ctx.translate(0, -212); ctx.scale(cp, cp);
    ctx.fillStyle = k.rgba('yellow');
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = k.rgba('bg', 0.55); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, 16, 0, k.TAU); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(0, 0, 9, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-5, -6, 5, 3.5, -0.5, 0, k.TAU); ctx.fill();
    ctx.restore();
    // kredi noktaları
    for (let i = 0; i < 3; i++) {
      const on = k.hash(Math.floor(t * 3) + i * 7) > 0.45;
      ctx.fillStyle = k.rgba('yellow', on ? 0.9 : 0.25);
      ctx.beginPath(); k.rrect(-30 + i * 24, -182, 12, 8, 3); ctx.fill();
    }

    // LED sırası (ekran altı)
    const eventGlow = d >= 0.35 && d < 1.3;
    for (let i = 0; i < 4; i++) {
      const x = -66 + i * 28;
      const on = eventGlow ? true : k.hash(Math.floor(t * 2.5) + i * 3) > 0.5;
      const c = eventGlow ? 'green' : (i % 2 ? 'red' : 'green');
      ctx.fillStyle = k.rgba(c, on ? 0.95 : 0.25);
      ctx.beginPath(); ctx.arc(x, -138, 7, 0, k.TAU); ctx.fill();
      if (on) k.glow(x, -138, 16, c, 0.3);
    }

    // jeton yuvası plakası + delik
    blob(44, -140, 56, 80, 8, k.rgba('dim'));
    ctx.fillStyle = k.rgba('bg', 0.9);
    ctx.beginPath(); k.rrect(65, -130, 14, 56, 5); ctx.fill();

    // kırmızı buton
    ctx.fillStyle = k.rgba('red');
    ctx.beginPath(); ctx.arc(-56, -95, 17, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(-56, -95, 17, 0, k.TAU); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-62, -101, 6, 4, -0.5, 0, k.TAU); ctx.fill();

    // jeton iade tepsisi
    blob(40, -52, 64, 30, 8, k.rgba('dim'));
    ctx.fillStyle = k.rgba('bg', 0.5);
    ctx.beginPath(); k.rrect(48, -46, 48, 14, 4); ctx.fill();

    // hoparlör delikleri
    ctx.fillStyle = k.rgba('bg', 0.35);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      ctx.beginPath(); ctx.arc(-84 + c * 14, -40 + r * 13, 3.2, 0, k.TAU); ctx.fill();
    }

    // === OLAY: jeton kayarak yuvaya girer ===
    if (d >= 0 && d < 0.9) {
      let cx, cr = 15;
      if (d < 0.35) {
        const q = k.E.outCubic(d / 0.35);
        cx = 140 + (72 - 140) * q;
      } else if (d < 0.55) {
        cx = 72; cr = 15 * (1 - ((d - 0.35) / 0.2) * 0.85);
      }
      if (d < 0.55) {
        ctx.fillStyle = k.rgba('yellow');
        ctx.beginPath(); ctx.arc(cx, -102, cr, 0, k.TAU); ctx.fill();
        ctx.strokeStyle = line; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(cx, -102, cr, 0, k.TAU); ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath(); ctx.ellipse(cx - cr * 0.3, -102 - cr * 0.3, cr * 0.3, cr * 0.22, -0.5, 0, k.TAU); ctx.fill();
      }
      // yuvada flaş halkası
      if (d >= 0.35) {
        const q = (d - 0.35) / 0.55;
        ctx.strokeStyle = k.rgba('yellow', (1 - q) * 0.7); ctx.lineWidth = 5;
        ctx.beginPath(); ctx.arc(72, -102, 12 + q * 45, 0, k.TAU); ctx.stroke();
        k.glow(72, -102, 40 * (1 - q) + 10, 'yellow', (1 - q) * 0.4);
      }
      // hareket çizgileri
      if (d < 0.35) {
        ctx.strokeStyle = k.rgba('yellow', 0.5); ctx.lineWidth = 4;
        for (let i = 0; i < 2; i++) {
          const lx = 148 - d * 140 + i * 16;
          ctx.beginPath(); ctx.moveTo(lx, -112); ctx.lineTo(lx + 12, -112); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(lx, -92); ctx.lineTo(lx + 12, -92); ctx.stroke();
        }
      }
    }

    ctx.restore();
  },
};
