// kitchen-fx-2/cheese-pull — pizza dilimi kaldırma: idle'da dilim hafif sallanır, pull anında peynir iplikleri gerilir ve uzar.
// NOT: canvas y-aşağıdır; dilim yukarı kaldırılır, peynir iplikleri dilim ile alttaki kütle arasında gerilir.
export default {
  name: 'cheese-pull', category: 'kitchen-fx-2',
  desc: 'Uzayan peynir: pull anında kaldırılan pizza dilimi yükselir, peynir iplikleri gerilip uzar',
  tags: ['peynir', 'pizza', 'uzayan peynir', 'cheese pull', 'yemek', 'stretchy cheese', 'pizza slice', 'yummy'],
  box: [-145, -160, 145, 145],
  bleed: 45,
  anchor: 'alttaki peynir kütlesinin merkezi (0,60)',
  points: { slice: [0, -95], strings: [0, -25], cheese: [0, 60], plate: [0, 95] },
  params: {
    pull: { type: 'time', default: null, desc: 'uzatma anı (1.0 sn): dilim yükselir, peynir iplikleri gerilir ve damlar' },
    color: { type: 'color', default: 'dim' },
  },
  draw(ctx, t, p, k) {
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const line = k.rgba('bg', 0.55);
    const d = p.pull == null ? -1 : t - p.pull;
    const pulling = d >= 0 && d <= 1.0;
    const g = pulling ? k.prog(d, 0, 1.0) : -1;

    // dilim yüksekliği: idle'da hafif salınım, pull'da yükselme
    const lift = pulling ? 46 * k.E.outCubic(Math.min(g * 1.4, 1)) : Math.sin(t * 1.9) * 4;
    const topY = -104 - lift, topW = 76;   // dilim üst kenarı (hamur tarafı)
    const tipY = -8 - lift;                 // dilim ucu (aşağı sarkar)
    const cheeseTop = 30;                   // kütle üstü

    // iplik çizici: sarkık/gergin bezier (yana hafif salınımlı)
    const strand = (x0, y0, x1, y1, sag, w, bow) => {
      ctx.strokeStyle = line; ctx.lineWidth = w + 4;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + bow, (y0 + y1) / 2 + sag, x1, y1); ctx.stroke();
      ctx.strokeStyle = k.rgba('yellow', 1); ctx.lineWidth = w;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + bow, (y0 + y1) / 2 + sag, x1, y1); ctx.stroke();
      // parlama çizgisi
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = Math.max(w * 0.3, 1.5);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + bow, (y0 + y1) / 2 + sag, x1, y1); ctx.stroke();
    };

    // --- 1) tabak + gölge
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(6, 102, 118, 24, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath(); ctx.ellipse(0, 96, 118, 24, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-70, 88, 34, 8, -0.15, 0, k.TAU); ctx.fill();

    // --- 2) alttaki peynir kütlesi
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.beginPath(); ctx.ellipse(6, 72, 78, 30, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('yellow', 1);
    ctx.beginPath(); ctx.ellipse(0, 66, 78, 30, 0, 0, k.TAU); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 6; ctx.stroke();
    // kütle damlaları (kenarlardan)
    for (let i = 0; i < 3; i++) {
      const dx = -46 + i * 46;
      const dl = 8 + k.hash(i * 3 + 1) * 8 + (pulling ? g * 10 : Math.sin(t * 2 + i * 2) * 2);
      ctx.fillStyle = k.rgba('yellow', 1);
      k.rrect(dx - 7, 84, 14, dl, 7); ctx.fill();
      ctx.strokeStyle = line; ctx.lineWidth = 4; ctx.stroke();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-24, 56, 22, 9, -0.2, 0, k.TAU); ctx.fill();

    // --- 3) peynir iplikleri (7 adet): dilim alt kenarına tutunur; idle'da kalın ve sarkık, pull'da gerilir
    const sdef = [
      [-1, 0.10], [1, 0.18], [-1, 0.26], [1, 0.34],
      [-1, 0.42], [1, 0.24], [0, 0],
    ];
    const bottoms = [-38, 36, -18, 16, -48, 46, 0];
    for (let i = 0; i < sdef.length; i++) {
      const [s, f] = sdef[i];
      const xa = s === 0 ? 0 : s * topW * f;
      const ya = s === 0 ? tipY + 2 : tipY + f * (topY - tipY);
      const sag = pulling
        ? 10 * (1 - g) + k.noise1(t * 6 + i * 9) * 3
        : 30 + k.noise1(t * 2.4 + i * 7) * 8;
      const bow = k.noise1(t * 3.1 + i * 13) * 9;
      const w = pulling ? 9.5 - g * 3 : 9.5;
      strand(xa, ya, bottoms[i], cheeseTop, sag, w, bow);
    }
    // pull'da kopan ince iplikler + düşen damla
    if (pulling) {
      for (let i = 0; i < 2; i++) {
        const xi = -30 + i * 62;
        const th = k.prog(d - 0.25 - i * 0.1, 0, 0.6);
        if (th > 0) {
          ctx.strokeStyle = k.rgba('yellow', 0.85 * (1 - th * 0.5));
          ctx.lineWidth = 3.5;
          const dropY = tipY + 20 + 90 * th * th;
          ctx.beginPath(); ctx.moveTo(xi, tipY + 14); ctx.lineTo(xi, dropY); ctx.stroke();
          ctx.fillStyle = k.rgba('yellow', 0.9 * (1 - th * 0.4));
          ctx.beginPath(); ctx.arc(xi, dropY + 4, 5, 0, k.TAU); ctx.fill();
        }
      }
    }

    // --- 4) kaldırılan pizza dilimi (uzun üçgen, ucu aşağı)
    const slicePath = () => {
      ctx.beginPath();
      ctx.moveTo(-topW, topY); ctx.lineTo(topW, topY); ctx.lineTo(0, tipY); ctx.closePath();
    };
    ctx.fillStyle = k.rgba('bg', 0.15);
    ctx.save(); ctx.translate(6, 6); slicePath(); ctx.fill(); ctx.restore();
    ctx.fillStyle = k.rgba('yellow', 1);
    slicePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 7; ctx.stroke();
    // kenar (hamur) bandı — üstte şerit
    ctx.fillStyle = k.rgba(p.color, 1);
    ctx.beginPath();
    ctx.moveTo(-topW, topY); ctx.lineTo(topW, topY);
    ctx.lineTo(topW - 12, topY + 20); ctx.lineTo(-topW + 12, topY + 20); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = line; ctx.lineWidth = 5; ctx.stroke();
    // sucuk dilimleri (ink detay)
    const pep = [[-28, topY + 48, 10], [22, topY + 54, 9], [-2, topY + 78, 8]];
    for (let i = 0; i < pep.length; i++) {
      ctx.fillStyle = k.rgba('ink', 0.55);
      ctx.beginPath(); ctx.arc(pep[i][0], pep[i][1], pep[i][2], 0, k.TAU); ctx.fill();
    }
    // dilim parlaması
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-34, topY + 32, 20, 8, -0.35, 0, k.TAU); ctx.fill();
    ctx.restore();
  },
};
