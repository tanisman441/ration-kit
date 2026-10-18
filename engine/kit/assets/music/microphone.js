// music/microphone — klasik sahne mikrofonu: ızgaralı küresel baş, ince sap,
// yuvarlak kaide; kaide üzerindeki seviye LED'i ses nabzıyla yanıp söner.
// Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) mikrofonun merkezidir.
export default {
  name: 'microphone', category: 'music',
  desc: 'Sahne mikrofonu; seviye LED\'i ses nabzıyla yanıp söner',
  tags: ['mikrofon', 'ses', 'sahne', 'kayıt', 'microphone', 'mic', 'sound', 'stage', 'recording'],
  box: [-95, -125, 95, 125],
  bleed: 25,
  anchor: 'mikrofonun merkezi (0,0)',
  points: { head: [0, -52], base: [0, 78], led: [26, 78] },
  params: {
    color: { type: 'color', default: 'ink' },
    level: { type: 'number', default: 0.8, desc: 'seviye LED\'i nabız şiddeti (0=kapalı)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const body = k.rgba(p.color), line = k.rgba('bg', 0.55), acc = k.rgba('red', 0.95);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    ctx.save();
    // hafif sallanma
    ctx.rotate(Math.sin(t * 1.5) * 0.02);

    const lvl = k.clamp(p.level, 0, 1);
    // ses nabzı: sinüzoid + k.hash ile doğal dalgalanma
    const wave = 0.5 + 0.5 * Math.sin(t * 3.2) * (0.6 + 0.4 * Math.sin(t * 7.7 + k.hash(3) * 6));
    const ledA = lvl * (0.25 + 0.75 * wave);

    // ---- kaide: yassı elips
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.ellipse(6, 84, 48, 15, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.ellipse(0, 78, 48 + LW / 2, 15 + LW / 2, 0, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('panel2');
    ctx.beginPath(); ctx.ellipse(0, 78, 48, 15, 0, 0, k.TAU); ctx.fill();
    // kaide parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.ellipse(-24, 71, 16, 5, -0.3, 0, k.TAU); ctx.fill();

    // ---- sap: ince çizgi (serbest çizgi = ink rengi)
    ctx.strokeStyle = line; ctx.lineWidth = 13;
    ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(0, 2); ctx.stroke();
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(0, 70); ctx.lineTo(0, 2); ctx.stroke();

    // ---- seviye LED'i (kaide üstünde): nabızla yanar
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(26, 78, 9, 0, k.TAU); ctx.fill();
    ctx.fillStyle = k.rgba('red', 0.15 + 0.85 * ledA);
    ctx.beginPath(); ctx.arc(26, 78, 6.5, 0, k.TAU); ctx.fill();
    if (ledA > 0.55) k.glow(26, 78, 20, 'red', 0.4 * ledA);

    // ---- baş: küresel kafa
    ctx.fillStyle = k.rgba('ink', 0.12);
    ctx.beginPath(); ctx.arc(6, -46, 46, 0, k.TAU); ctx.fill();
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.arc(0, -52, 46 + LW / 2, 0, k.TAU); ctx.fill();
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.arc(0, -52, 46, 0, k.TAU); ctx.fill();
    // baş parlaması (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.11)';
    ctx.beginPath(); ctx.ellipse(-18, -70, 16, 10, -0.5, 0, k.TAU); ctx.fill();

    // ---- ızgara çizgileri: daire içine sığan ince yatay kirişler (iç ayrım)
    ctx.strokeStyle = k.rgba('bg', 0.3); ctx.lineWidth = 2.5;
    for (let i = -5; i <= 5; i++) {
      const y = -52 + i * 8;
      const hw = Math.sqrt(Math.max(0, 43 * 43 - (y + 52) * (y + 52)));
      if (hw < 8) continue;
      ctx.beginPath(); ctx.moveTo(-hw, y); ctx.lineTo(hw, y); ctx.stroke();
    }
    // başın alt kuşağı (sapla birleşen bant)
    ctx.fillStyle = k.rgba('ink', 0.15);
    ctx.beginPath(); ctx.arc(0, -52, 46, Math.PI * 0.28, Math.PI * 0.72); ctx.stroke();
    ctx.strokeStyle = k.rgba('bg', 0.4); ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, -52, 43, Math.PI * 0.3, Math.PI * 0.7); ctx.stroke();

    // ---- boyun halkası (baş ile sap arası)
    ctx.fillStyle = line;
    ctx.beginPath(); k.rrect(-16, -12, 32, 18, 8); ctx.fill();
    ctx.fillStyle = acc;
    ctx.beginPath(); k.rrect(-13, -9, 26, 12, 6); ctx.fill();

    ctx.restore();
  },
};
