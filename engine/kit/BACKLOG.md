# Asset wishlist

Drawings the director asked for (or we want next). The asset agent takes the first open item:
`node tools/kit-api/asset-agent.mjs` (or `--item category/name`). Format: `- [ ] category/name — what it looks like and what it must do`.

- [ ] characters/soldier — FPS player/enemy, side view, helmet and vest, holding a rifle at the chest; params: color, team accent, hit (time: flinches and flashes white), pose enum idle|aim; points: head, chest, hand
- [ ] fx/fire — Burning flame, loops naturally (flicker from noise), params: intensity number 0–1, color; anchor at the base; points: top
- [ ] environment/cover-wall — Low concrete cover wall, side view, chipped edges; params: color, hit (time: dust puff + chip flies off); anchor at the ground
- [ ] tech/server-rack — Server rack front view with blinking LEDs (hash-based), params: color, load number 0–1 (more LEDs lit), alert (time: rack flashes red)
- [ ] fx/explosion — Cartoon explosion: flash, fireball, smoke ring, debris; params: at (time), color; anchor at the centre
- [ ] weapons/pistol — Side-view pistol, muzzle right; params: color, fire (time: slide kick + flash); points: muzzle, grip
- [ ] environment/crate — Wooden/metal supply crate, 3/4 view; params: color, variant enum wood|metal
- [ ] maps/arena-topdown — Top-down mini map of an FPS arena: walls, two spawn zones, lanes; params: highlight enum none|a|b|mid
- [ ] ui/killfeed — Kill feed row: player name, weapon icon, victim name; params: killer text, victim text, at (time: slides in)
- [ ] tech/router — Network router with antennas and traffic lights; params: color, traffic number 0–1
