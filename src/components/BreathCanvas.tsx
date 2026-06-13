import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { BreathTechnique, Phase } from '../types';
import { getTotalSeconds } from '../utils/pathGeometry';
import { useTheme } from '../theme';

interface Props {
  technique: BreathTechnique;
  isPlaying: boolean;
  height?: number;
  onRoundComplete?: (round: number) => void;
}

const PX_PER_SEC = 46; // horizontal scroll speed

/**
 * Continuous scrolling breath wave.
 * Dot stays horizontally centered; the curve scrolls right→left.
 * Inhale = rising, exhale = falling, hold = flat.
 */
export function BreathCanvas({ technique, isPlaying, height = 380, onRoundComplete }: Props) {
  const c = useTheme();
  const { width } = useWindowDimensions();
  const W = width;
  const H = height;
  const centerX = W / 2;

  // one cycle as (x = time*px, y = cumulative level) relative points
  const cycle = useMemo(() => {
    let x = 0, y = 0;
    const pts: { x: number; y: number }[] = [{ x: 0, y: 0 }];
    for (const p of technique.phases) {
      x += p.seconds * PX_PER_SEC;
      if (p.direction === 'up') y -= p.seconds;
      else if (p.direction === 'down') y += p.seconds;
      pts.push({ x, y });
    }
    const ys = pts.map((p) => p.y);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const range = maxY - minY || 1;
    return { pts, minY, range, widthPx: x };
  }, [technique]);

  const totalSecs = getTotalSeconds(technique.phases);
  const [t, setT] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animRef = useRef<number | null>(null);
  const roundRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - t * 1000;
      const tick = () => {
        const elapsed = (Date.now() - startTimeRef.current!) / 1000;
        const newRound = Math.floor(elapsed / totalSecs);
        if (newRound > roundRef.current) {
          roundRef.current = newRound;
          onRoundComplete?.(newRound);
        }
        setT(elapsed);
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // y level → screen y (padded, centered)
  const padV = 50;
  const toScreenY = (y: number) => padV + ((y - cycle.minY) / cycle.range) * (H - padV * 2);

  // current absolute scroll position in curve px
  const scrollPx = t * PX_PER_SEC;
  const Wc = cycle.widthPx;

  // collect visible points across cycles
  const { ghostD, activeD, dotY } = useMemo(() => {
    const leftEdge = scrollPx - centerX;
    const rightEdge = scrollPx + (W - centerX);
    const kMin = Math.floor(leftEdge / Wc) - 1;
    const kMax = Math.floor(rightEdge / Wc) + 1;

    const screenPts: { x: number; y: number }[] = [];
    for (let k = kMin; k <= kMax; k++) {
      for (let i = 0; i < cycle.pts.length; i++) {
        // skip duplicate joint point (last of cycle k == first of k+1 in x)
        if (k > kMin && i === 0) {
          // still push to create the vertical reset line if y differs
        }
        const absX = k * Wc + cycle.pts[i].x;
        screenPts.push({ x: absX - scrollPx + centerX, y: toScreenY(cycle.pts[i].y) });
      }
    }

    if (screenPts.length < 2) return { ghostD: '', activeD: '', dotY: H / 2 };

    let g = `M ${screenPts[0].x.toFixed(1)} ${screenPts[0].y.toFixed(1)}`;
    for (let i = 1; i < screenPts.length; i++) {
      g += ` L ${screenPts[i].x.toFixed(1)} ${screenPts[i].y.toFixed(1)}`;
    }

    // active path: segments left of centerX, cut at centerX
    let a = '';
    let started = false;
    let dy = H / 2;
    for (let i = 0; i < screenPts.length - 1; i++) {
      const p1 = screenPts[i], p2 = screenPts[i + 1];
      if (p2.x <= centerX) {
        if (!started) { a = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`; started = true; }
        a += ` L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
      } else if (p1.x < centerX && p2.x > centerX) {
        const frac = (centerX - p1.x) / (p2.x - p1.x || 1);
        const iy = p1.y + (p2.y - p1.y) * frac;
        if (!started) { a = `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`; started = true; }
        a += ` L ${centerX.toFixed(1)} ${iy.toFixed(1)}`;
        dy = iy;
        break;
      } else if (p1.x === centerX) {
        dy = p1.y;
        break;
      }
    }
    return { ghostD: g, activeD: a, dotY: dy };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPx, W, H, cycle]);

  return (
    <View style={{ width: W, height: H }}>
      <Svg width={W} height={H}>
        {/* center guide */}
        <Line x1={centerX} y1={24} x2={centerX} y2={H - 24}
          stroke={c.midLine} strokeWidth={0.5} strokeDasharray="5,7" />
        {/* future (ghost) */}
        <Path d={ghostD} stroke={c.trailGhost} strokeWidth={2.5} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        {/* past (active) */}
        <Path d={activeD} stroke={c.accent} strokeWidth={3.5} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        {/* centered dot following the wave */}
        <Circle cx={centerX} cy={dotY} r={17} fill={c.accent} opacity={0.14} />
        <Circle cx={centerX} cy={dotY} r={10} fill={c.accent} opacity={0.9} />
        <Circle cx={centerX} cy={dotY} r={5.5} fill={c.accentDark} />
      </Svg>
    </View>
  );
}
