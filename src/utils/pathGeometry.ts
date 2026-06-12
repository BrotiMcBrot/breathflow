import { Phase, PathPoint } from '../types';

const PX_PER_SEC = 32;

export function buildBreathPath(
  phases: Phase[],
  canvasWidth: number,
  canvasHeight: number,
  paddingH = 36,
  paddingV = 30
): PathPoint[] {
  // raw points (unscaled)
  let x = 0, y = 0;
  const raw: { x: number; y: number; phase?: Phase }[] = [{ x: 0, y: 0 }];
  for (const phase of phases) {
    const len = phase.seconds * PX_PER_SEC;
    if (phase.direction === 'up') y -= len;
    else if (phase.direction === 'down') y += len;
    else x += len;
    raw.push({ x, y, phase });
  }

  const xs = raw.map((p) => p.x);
  const ys = raw.map((p) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const rawW = maxX - minX;
  const rawH = maxY - minY || 1;

  const availW = canvasWidth - paddingH * 2;
  const availH = canvasHeight - paddingV * 2;

  // scale to fill available space (upscaling allowed → vertical-only curves get big)
  const scaleX = rawW > 0 ? availW / rawW : 1;
  const scaleY = availH / rawH;

  const w = rawW * scaleX;
  const h = rawH * scaleY;

  // center both axes
  const offsetX = (canvasWidth - w) / 2;
  const offsetY = (canvasHeight - h) / 2;

  return raw.map((p) => ({
    x: offsetX + (p.x - minX) * scaleX,
    y: offsetY + (p.y - minY) * scaleY,
    phase: p.phase,
  }));
}

export function getTotalSeconds(phases: Phase[]): number {
  return phases.reduce((a, p) => a + p.seconds, 0);
}

export function getPosAtTime(
  pts: PathPoint[],
  phases: Phase[],
  t: number
): { x: number; y: number; phase: Phase; fracInPhase: number; phaseIndex: number } {
  const total = getTotalSeconds(phases);
  const tMod = t % total;
  let elapsed = 0;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    if (tMod <= elapsed + phase.seconds) {
      const frac = (tMod - elapsed) / phase.seconds;
      const from = pts[i];
      const to = pts[i + 1];
      return {
        x: from.x + (to.x - from.x) * frac,
        y: from.y + (to.y - from.y) * frac,
        phase, fracInPhase: frac, phaseIndex: i,
      };
    }
    elapsed += phase.seconds;
  }
  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, phase: phases[phases.length - 1], fracInPhase: 1, phaseIndex: phases.length - 1 };
}
