import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { BreathTechnique } from '../types';
import { buildBreathPath, getTotalSeconds, getPosAtTime } from '../utils/pathGeometry';

interface Props {
  technique: BreathTechnique;
  isPlaying: boolean;
  onRoundComplete?: (round: number) => void;
}

export function BreathCanvas({ technique, isPlaying, onRoundComplete }: Props) {
  const canvasWidth = 320;
  const canvasHeight = 280;

  const pts = useMemo(
    () => buildBreathPath(technique.phases, canvasWidth, canvasHeight),
    [technique]
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
  }, [t, pts]);

  const pos = getPosAtTime(pts, technique.phases, t);
  const midY = canvasHeight / 2;

  return (
    <View style={{ width: canvasWidth, height: canvasHeight }}>
      <Svg width={canvasWidth} height={canvasHeight}>
        <Line x1={24} y1={midY} x2={canvasWidth - 24} y2={midY}
          stroke="#1e2e3e" strokeWidth={0.5} strokeDasharray="6,6" />
        <Path d={trailPathD} stroke="#1a2a3a" strokeWidth={2} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        <Path d={activePathD} stroke="#378ADD" strokeWidth={3} fill="none"
          strokeLinejoin="round" strokeLinecap="round" />
        <Circle cx={pos.x} cy={pos.y} r={12} fill="#85B7EB" opacity={0.2} />
        <Circle cx={pos.x} cy={pos.y} r={7} fill="#85B7EB" />
        <Circle cx={pos.x} cy={pos.y} r={4} fill="#185FA5" />
      </Svg>
    </View>
  );
}
