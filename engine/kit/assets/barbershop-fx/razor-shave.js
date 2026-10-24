// barbershop-fx/razor-shave — profilden erkek başı, yanağında tıraş köpüğü; `at` anında ustura yanağı sıyırır, köpük uçar. Contract: engine/kit/ASSETS.md
// NOT: canvas y-aşağıdır; (0,0) başın merkezi, yüz sağa bakar.
export default {
  name: 'razor-shave', category: 'barbershop-fx',
  desc: 'Profliden erkek başı; ustura tıraş anında yanağı sıyırır, köpük tanecikleri uçar',
  tags: ['ustura', 'tıraş', 'berber', 'köpük', 'yüz', 'razor', 'shave', 'barber', 'foam', 'face'],
  box: [-130, -115, 135, 95],
  bleed: 45,
  anchor: 'başın merkezi (0,0); yüz sağa bakar',
  points: { cheek: [18, -32], razor: [56, -44], chin: [16, 6] },
  params: {
    color: { type: 'color', default: 'dim' },
    at: { type: 'time', default: null, desc: 'ustura darbesi anı — bıçak yanağı sıyırır, köpük uçar (0.9 sn)' },
  },
  draw(ctx, t, p, k) {
    const LW = 5;
    const skin = k.rgba(p.color), inkC = k.rgba('ink'), line = k.rgba('bg', 0.55);
    const d = p.at == null ? -1 : t - p.at;
    const shaving = d >= 0 && d < 0.9;
    const prog = shaving ? k.clamp(d / 0.9, 0, 1) : (d >= 0.9 ? 1 : 0);
    const br = Math.sin(t * k.TAU / 2.6) * 1.5; // nefes
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    const disc = (x, y, rx, ry, c) => {
      ctx.fillStyle = line; ctx.beginPath(); ctx.ellipse(x, y, rx + LW / 2, ry + LW / 2, 0, 0, k.TAU); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, k.TAU); ctx.fill();
    };
    const blob = (x, y, w, h, r, c) => {
      ctx.fillStyle = line; ctx.beginPath(); k.rrect(x - LW / 2, y - LW / 2, w + LW, h + LW, r + LW / 2); ctx.fill();
      ctx.fillStyle = c; ctx.beginPath(); k.rrect(x, y, w, h, r); ctx.fill();
    };

    // boyun + omuz (başa bitişik)
    blob(-52, 6, 64, 84, 16, skin);
    // baş (profil, sağa bakar)
    disc(-8, -42 + br * 0.4, 54, 52, skin);
    // premium parlama (sol üst)
    ctx.fillStyle = 'rgba(255,255,255,0.10)';
    ctx.beginPath(); ctx.ellipse(-34, -68, 16, 10, -0.4, 0, k.TAU); ctx.fill();
    // burun (profil çıkıntısı, usturadan uzakta)
    ctx.fillStyle = line;
    ctx.beginPath(); ctx.moveTo(40, -60); ctx.lineTo(58, -46); ctx.lineTo(42, -36); ctx.closePath(); ctx.fill();
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(40, -58); ctx.lineTo(55, -46); ctx.lineTo(42, -38); ctx.closePath(); ctx.fill();
    // saç: başın üst-arka kısmı
    ctx.fillStyle = k.rgba('ink');
    ctx.beginPath(); ctx.ellipse(-22, -78, 40, 22, -0.35, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    // göz (kapalı, rahat) + kaş
    ctx.strokeStyle = inkC; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(14, -56, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(6, -68); ctx.lineTo(24, -66); ctx.stroke();
    // ağız
    ctx.beginPath(); ctx.moveTo(30, -16); ctx.quadraticCurveTo(38, -12, 44, -16); ctx.stroke();
    // kulak
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(-28, -44, 9, -0.6, Math.PI * 0.9); ctx.stroke();

    // tıraş köpüğü (üst yanakta, ağız açıkta kalır): darbe ilerledikçe silinir
    const foamR = 1 - prog * 0.9;
    if (foamR > 0.05) {
      ctx.fillStyle = k.rgba('panel2', 0.95);
      ctx.beginPath(); ctx.ellipse(18, -32, 20 * foamR + 4, 13 * foamR + 3, 0.2, 0, k.TAU); ctx.fill();
      for (let i = 0; i < 5; i++) {
        const fx = 6 + k.hash(i) * 24, fy = -42 + k.hash(i + 10) * 18;
        ctx.fillStyle = k.rgba('panel2', 0.9);
        ctx.beginPath(); ctx.ellipse(fx, fy, (4 + k.hash(i + 20) * 4) * foamR, (3 + k.hash(i + 30) * 3) * foamR, 0, 0, k.TAU); ctx.fill();
      }
    }

    // ustura: bıçak + sap; darbe anında yanağı aşağı sıyırır
    const tremble = k.noise1(t * 9) * 1.5;
    const slide = prog * 30;
    ctx.save();
    ctx.translate(60 + tremble, -56 + slide);
    ctx.rotate(-0.55);
    // sap
    blob(-8, 0, 16, 52, 8, k.rgba('ink'));
    // bıçak (metal)
    blob(-6, -52, 12, 56, 4, k.rgba('panel2'));
    ctx.strokeStyle = k.rgba('ink', 0.75); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-6, -50); ctx.lineTo(-6, 2); ctx.stroke();
    ctx.restore();

    // köpük tanecikleri (darbe anı)
    if (shaving) {
      for (let i = 0; i < 9; i++) {
        const fp = k.clamp((d - k.hash(i) * 0.25) / 0.5, 0, 1);
        if (fp <= 0) continue;
        const dx = 22 + (k.hash(i + 40) - 0.3) * 70 * fp;
        const dy = -32 + slide * 0.7 - fp * 34 + fp * fp * 30;
        ctx.fillStyle = k.rgba('panel2', 0.9 * (1 - fp * 0.5));
        ctx.beginPath(); ctx.ellipse(dx, dy, 4 + k.hash(i + 60) * 3, 3 + k.hash(i + 70) * 3, 0, 0, k.TAU); ctx.fill();
      }
    }
    // tıraş sonrası temiz yanakta parlama
    if (prog > 0.85) {
      ctx.fillStyle = k.rgba('yellow', 0.5 * (prog - 0.85) / 0.15);
      ctx.beginPath(); ctx.ellipse(18, -32, 8, 4, -0.4, 0, k.TAU); ctx.fill();
    }
  },
};
