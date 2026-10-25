// bakery-fx/cookie-cut — yıldız kalıp `at` anında hamura basar; kurabiye şekli belirir. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) hamur tabakasının merkezidir.
export default {
  name: 'cookie-cut', category: 'bakery-fx',
  desc: 'Yıldız kurabiye kalıbı `at` anında hamura basar; yıldız kurabiye belirir, kırıntılar sıçrar',
  tags: ['kurabiye', 'kalıp', 'yıldız', 'hamur', 'pastane', 'tatlı', 'cookie', 'cutter', 'star', 'dough', 'bake', 'bakery'],
  box: [-130, -100, 130, 100],
  bleed: 20,
  anchor: 'hamur tabakasının merkezi (0,0); kalıp üstten basar',
  points: { cutter: [0, -30], cookie: [0, 55], dough: [0, 55] },
  params: {
    color: { type: 'color', default: 'yellow' },
    at: { type: 'time', default: null, desc: 'kalıbın hamura basma anı' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const d = p.at == null ? -1 : t - p.at;

    const star = (cx, cy, R, r, rot) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = rot + i * Math.PI / 5 - Math.PI / 2;
        const rad = i % 2 === 0 ? R : r;
        const x = cx + rad * Math.cos(a), y = cy + rad * Math.sin(a);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
    };

    // kalıp basma ilerlemesi: 0 = havada, 1 = hamurda
    let press = 0;
    if (d >= 0) {
      if (d < 0.35) press = k.E.inCubic(d / 0.35);
      else if (d < 0.7) press = 1;
      else press = 1 - 0.55 * k.E.outCubic(Math.min(1, (d - 0.7) / 0.4));
    }
    const cutterY = -32 + 62 * press;

    // hamur tabakası
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };
    blob(-115, 32, 230, 50, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-84, 38, 28, 6, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(70, 68, 42, 9, 5); ctx.fill();
    // un serpintisi
    ctx.fillStyle = k.rgba('ink', 0.3);
    for (let i = 0; i < 5; i++) {
      ctx.beginPath(); ctx.arc(-100 + k.hash(i * 3 + 1) * 200, 40 + k.hash(i * 3 + 2) * 8, 2.5, 0, k.TAU); ctx.fill();
    }

    // yıldız kurabiye: basıldıktan sonra belirir
    if (d >= 0.35) {
      const pop = Math.min(1, (d - 0.35) / 0.3);
      const s = 1 + 0.18 * Math.sin(pop * Math.PI); // hafif taşma efekti
      ctx.save(); ctx.translate(0, 57); ctx.scale(s * pop, s * pop);
      star(0, 0, 34, 15, 0);
      ctx.fillStyle = line; ctx.fill();
      star(0, 0, 30, 13, 0);
      ctx.fillStyle = body; ctx.fill();
      ctx.restore();
      // kurabiye üstü parlama
      ctx.fillStyle = `rgba(255,255,255,${0.10 * pop})`;
      ctx.beginPath(); ctx.ellipse(-10, 48, 12, 4, 0, 0, k.TAU); ctx.fill();
      // kırıntılar: basma anında sıçrar
      const crumbA = d > 0.5 ? Math.max(0, 1 - (d - 0.5) * 0.8) : 0;
      ctx.fillStyle = k.rgba('ink', 0.6 * crumbA);
      for (let i = 0; i < 4; i++) {
        const ang = k.hash(i + 11) * k.TAU;
        const dist = 42 + 10 * k.hash(i + 21);
        ctx.beginPath(); ctx.arc(Math.cos(ang) * dist, 57 + Math.sin(ang) * dist * 0.4, 2.5, 0, k.TAU); ctx.fill();
      }
    } else {
      // basılmadan önce: yıldız izi silik görünür (kalıp hedefi)
      ctx.save(); ctx.globalAlpha = 0.18;
      star(0, 57, 34, 15, 0);
      ctx.strokeStyle = k.rgba('ink'); ctx.lineWidth = 2.5; ctx.stroke();
      ctx.restore();
    }

    // kalıp: yıldız çerçeve + sap
    // sap
    ctx.strokeStyle = line; ctx.lineWidth = 15;
    ctx.beginPath(); ctx.moveTo(0, cutterY - 34); ctx.lineTo(0, cutterY - 62); ctx.stroke();
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(0, cutterY - 34); ctx.lineTo(0, cutterY - 62); ctx.stroke();
    // sap topuzu
    ctx.fillStyle = line; ctx.beginPath(); ctx.arc(0, cutterY - 66, 11, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.arc(0, cutterY - 66, 8, 0, k.TAU); ctx.fill();
    // yıldız çerçeve (çift kontur)
    star(0, cutterY, 38, 17, 0);
    ctx.strokeStyle = line; ctx.lineWidth = 13; ctx.stroke();
    star(0, cutterY, 38, 17, 0);
    ctx.strokeStyle = k.rgba('dim'); ctx.lineWidth = 8; ctx.stroke();
    // kalıp üstü parlama
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-14, cutterY - 22, 12, 4, -0.5, 0, k.TAU); ctx.fill();
  },
};
