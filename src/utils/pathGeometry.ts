import { Phase, PathPoint } from '../types';

const PX_PER_SEC = 32;

export function buildBreathPath(
  phases: Phase[],
  canvasWidth: number,
  canvasHeight: number,
  paddingH = 40
): PathPoint[] {
  const midY = canvasHeight / 2;
  const pts: { x: number; y: number; phase?: Phase }[] = [];

  let x = 0;
  let y = midY;
  pts.push({ x, y });

  for (const phase of phases) {
    const len = phase.seconds * PX_PER_SEC;
    let nx = x, ny = y;
    if (phase.direction === 'up') { ny = y - len; }
    else if (phase.direction === 'down') { ny = y + len; }
    else if (phase.direction === 'right') { nx = x + len; }
    pts.push({ x: nx, y: ny, phase });
    x = nx;
    y = ny;
  }

  // scale X to fit canvas
  const totalW = pts[pts.length - 1].x;
  const availW = canvasWidth - paddingH * 2;
  const scaleX = availW / (totalW || 1);

  // scale Y so path fits vertically with margin
  const ys = pts.map((p) => p.y);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const pathH = maxY - minY || 1;
  const availH = canvasHeight - 80;
  const scaleY = Math.min(1, availH / pathH);

  return pts.map((p) => ({
    x: paddingH + (p.x) * scaleX,
    y: midY + (p.y - midY) * scaleY,
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
        phase,
        fracInPhase: frac,
        phaseIndex: i,
      };
    }
    elapsed += phase.seconds;
  }

  const last = pts[pts.length - 1];
  return { x: last.x, y: last.y, phase: phases[phases.length - 1], fracInPhase: 1, phaseIndex: phases.length - 1 };
}
