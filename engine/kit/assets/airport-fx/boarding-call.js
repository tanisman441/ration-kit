// airport-fx/boarding-call — biniş anonsu: hoparlörden ses dalgaları yayılır, kapı işareti yeşil yanar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) kapı tabelasının merkezidir.
export default {
  name: 'boarding-call', category: 'airport-fx',
  desc: 'Biniş anonsu yapılır: hoparlörden yayılan ses dalgaları ve yeşile dönen kapı işaretiyle yolcular kapıya çağrılır',
  tags: ['biniş', 'anons', 'hoparlör', 'kapı', 'çağrı', 'havalimanı', 'boarding', 'announcement', 'speaker', 'gate', 'call', 'airport'],
  box: [-145, -105, 145, 105],
  bleed: 30,
  anchor: 'kapı tabelasının merkezi (0,0); hoparlör sol altta, kapı sağ alttadır',
  points: { speaker: [-80, 30], gate: [100, -63], door: [70, 30] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'anons anı: ses dalgaları yayılır, kapı işareti yeşil yanar' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const line = k.rgba('bg', 0.55);
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    const d = p.at == null ? -1 : t - p.at;
    const announced = d >= 0;

    // kapı tabelası (üst)
    blob(-120, -95, 240, 64, 12, k.rgba('panel2'));
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-96, -86, 24, 5, 0, 0, k.TAU); ctx.fill();
    // sağ alt gölge
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); k.rrect(60, -44, 52, 8, 4); ctx.fill();
    // "GATE A12" yazısı
    ctx.fillStyle = k.rgba('ink', 0.85);
    ctx.font = `700 30px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('GATE A12', -104, -63);
    // durum noktası: anons öncesi amber nabız, anonsla yeşil
    const pulse = 0.5 + 0.5 * Math.sin(t * k.TAU / 1.8);
    ctx.fillStyle = announced ? k.rgba('green') : k.rgba('yellow', 0.5 + 0.4 * pulse);
    ctx.beginPath(); ctx.arc(100, -63, 8, 0, k.TAU); ctx.fill();
    if (announced) k.glow(100, -63, 16, 'green', 0.5);

    // hoparlör (sol alt): gövde + koni
    const spkX = -80, spkY = 30;
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(spkX - 34, spkY - 22, 26, 44, 6); ctx.fill();
    ctx.fillStyle = k.rgba(p.color);
    ctx.beginPath(); k.rrect(spkX - 31, spkY - 19, 20, 38, 5); ctx.fill();
    // koni (sağa açılan)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(spkX - 8, spkY - 18); ctx.lineTo(spkX + 26, spkY - 34); ctx.lineTo(spkX + 26, spkY + 34); ctx.lineTo(spkX - 8, spkY + 18); ctx.closePath(); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.moveTo(spkX - 8, spkY - 14); ctx.lineTo(spkX + 22, spkY - 28); ctx.lineTo(spkX + 22, spkY + 28); ctx.lineTo(spkX - 8, spkY + 14); ctx.closePath(); ctx.fill();
    // hoparlör LED'i (idle nabız)
    ctx.fillStyle = k.rgba('cyan', 0.4 + 0.4 * Math.sin(t * k.TAU / 2.0));
    ctx.beginPath(); ctx.arc(spkX - 21, spkY - 28, 3.5, 0, k.TAU); ctx.fill();

    // ses dalgaları: anons anında 3 halka yayılır (0.9 sn)
    if (announced && d < 1.2) {
      for (let w = 0; w < 3; w++) {
        const wp = k.clamp((d - w * 0.18) / 0.7, 0, 1);
        if (wp <= 0 || wp >= 1) continue;
        const r = 30 + wp * 46;
        ctx.strokeStyle = k.rgba('cyan', 0.85 * (1 - wp));
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(spkX + 26, spkY, r, -0.9, 0.9); ctx.stroke();
      }
    }
    // idle: hoparlörden hafif dalga nabzı (her ~3 sn)
    if (!announced) {
      const ip = ((t % 3) / 3);
      if (ip < 0.5) {
        ctx.strokeStyle = k.rgba('cyan', 0.3 * (1 - ip * 2));
        ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(spkX + 26, spkY, 30 + ip * 30, -0.9, 0.9); ctx.stroke();
      }
    }

    // kapı (sağ alt): çerçeve + ok
    const doorX = 30, doorY = -10, doorW = 80, doorH = 80;
    blob(doorX, doorY, doorW, doorH, 10, k.rgba('panel2'));
    // kapı iç çizgisi: anonsla yeşil yanar
    ctx.strokeStyle = announced ? k.rgba('green', 0.95) : k.rgba('ink', 0.5);
    ctx.lineWidth = 4;
    ctx.beginPath(); k.rrect(doorX + 12, doorY + 10, doorW - 24, doorH - 20, 6); ctx.stroke();
    if (announced) k.glow(doorX + doorW / 2, doorY + doorH / 2, 30, 'green', 0.3);
    // kapıdan geçen ok (yukarı)
    const arrowBob = announced ? 3 * Math.sin(t * k.TAU / 1.1) : 0;
    ctx.fillStyle = announced ? k.rgba('green') : k.rgba('ink', 0.7);
    const ax = doorX + doorW / 2, ay = doorY + doorH / 2 + arrowBob;
    ctx.beginPath();
    ctx.moveTo(ax, ay - 20); ctx.lineTo(ax + 10, ay - 6); ctx.lineTo(ax + 4, ay - 6);
    ctx.lineTo(ax + 4, ay + 14); ctx.lineTo(ax - 4, ay + 14); ctx.lineTo(ax - 4, ay - 6);
    ctx.lineTo(ax - 10, ay - 6); ctx.closePath(); ctx.fill();
    ctx.restore();
  },
};
