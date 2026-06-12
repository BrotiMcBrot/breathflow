import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, useWindowDimensions } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { BreathTechnique } from '../types';
import { buildBreathPath, getTotalSeconds, getPosAtTime } from '../utils/pathGeometry';
import { useTheme } from '../theme';

interface Props {
  technique: BreathTechnique;
  isPlaying: boolean;
  height?: number;
  onRoundComplete?: (round: number) => void;
}

export function BreathCanvas({ technique, isPlaying, height = 380, onRoundComplete }: Props) {
  const c = useTheme();
  const { width } = useWindowDimensions();
  const canvasWidth = width - 32;
  const canvasHeight = height;

  const pts = useMemo(
    () => buildBreathPath(technique.phases, canvasWidth, canvasHeight),
    [technique, canvasWidth, canvasHeight]
  );

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
        setT(elapsed % totalSecs);
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    }
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const trailPathD = useMemo(() => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) d += ` L ${pts[i].x} ${pts[i].y}`;
    return d;
  }, [pts]);

  const activePathD = useMemo(() => {
    if (pts.length < 2) return '';
    const pos = getPosAtTime(pts, technique.phases, t);
    let d = `M ${pts[0].x} ${pts[0].y}`;
    let elapsed = 0;
    for (let i = 0; i < technique.phases.length; i++) {
      const phase = technique.phases[i];
      if (t <= elapsed + phase.seconds) {
        d += ` L ${pos.x} ${pos.y}`;
        break;
      }
      d += ` L ${pts[i + 1].x} ${pts[i + 1].y}`;
      elapsed += phase.seconds;
    }
    return d;
  }, [t, pts, technique.phases]);

  const pos = getPosAtTime(pts, technique.phases, t);
  const midY = canvasHeight / 2;

  return (
    <View style={{ width: canvasWidth, height: canvasHeight }}>
      <Svg width={canvasWidth} height={canvasHeight}>
        <Line
          x1={16} y1={midY} x2={canvasWidth - 16} y2={midY}
          stroke={c.midLine} strokeWidth={0.5} strokeDasharray="6,6"
        />
        <Path d={trailPathD} stroke={c.trailGhost} strokeWidth={2.5} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        <Path d={activePathD} stroke={c.accent} strokeWidth={3.5} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        <Circle cx={pos.x} cy={pos.y} r={16} fill={c.accent} opacity={0.15} />
        <Circle cx={pos.x} cy={pos.y} r={9} fill={c.accent} opacity={0.85} />
        <Circle cx={pos.x} cy={pos.y} r={5} fill={c.accentDark} />
      </Svg>
    </View>
  );
}
