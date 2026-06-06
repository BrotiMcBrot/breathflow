import React, { useEffect, useMemo } from 'react';
import {
  Canvas,
  Path,
  Circle,
  useValue,
  runTiming,
  Skia,
  useComputedValue,
  vec,
  Paint,
  DashPathEffect,
} from '@shopify/react-native-skia';
import { useWindowDimensions } from 'react-native';
import { BreathTechnique } from '../types';
import { buildBreathPath, getTotalSeconds, getPosAtTime } from '../utils/pathGeometry';

interface Props {
  technique: BreathTechnique;
  isPlaying: boolean;
  onPhaseChange?: (phaseName: string, secsRemaining: number) => void;
  onRoundComplete?: (round: number) => void;
}

const COLORS = {
  trail: '#1a2a3a',
  trailActive: '#378ADD',
  dot: '#85B7EB',
  dotCore: '#185FA5',
  midLine: '#1e2e3e',
};

export function BreathCanvas({ technique, isPlaying, onPhaseChange, onRoundComplete }: Props) {
  const { width } = useWindowDimensions();
  const canvasWidth = width - 48;
  const canvasHeight = 280;

  const pts = useMemo(
    () => buildBreathPath(technique.phases, canvasWidth, canvasHeight),
    [technique, canvasWidth, canvasHeight]
  );

  const totalSecs = getTotalSeconds(technique.phases);
  const progress = useValue(0);

  // build full trail path
  const trailPath = useMemo(() => {
    const p = Skia.Path.Make();
    if (pts.length < 2) return p;
    p.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) p.lineTo(pts[i].x, pts[i].y);
    return p;
  }, [pts]);

  // active path up to current progress
  const activePath = useComputedValue(() => {
    const t = progress.current * totalSecs;
    const pos = getPosAtTime(pts, technique.phases, t);
    const p = Skia.Path.Make();
    if (pts.length < 2) return p;
    p.moveTo(pts[0].x, pts[0].y);

    let elapsed = 0;
    for (let i = 0; i < technique.phases.length; i++) {
      const phase = technique.phases[i];
      if (t <= elapsed + phase.seconds) {
        p.lineTo(pos.x, pos.y);
        break;
      }
      p.lineTo(pts[i + 1].x, pts[i + 1].y);
      elapsed += phase.seconds;
    }
    return p;
  }, [progress]);

  const dotX = useComputedValue(() => {
    const t = progress.current * totalSecs;
    return getPosAtTime(pts, technique.phases, t).x;
  }, [progress]);

  const dotY = useComputedValue(() => {
    const t = progress.current * totalSecs;
    return getPosAtTime(pts, technique.phases, t).y;
  }, [progress]);

  useEffect(() => {
    if (isPlaying) {
      const remaining = (1 - progress.current) * totalSecs;
      runTiming(progress, 1, { duration: remaining * 1000 }, () => {
        progress.current = 0;
        onRoundComplete?.(1);
        if (isPlaying) {
          runTiming(progress, 1, { duration: totalSecs * 1000 });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const midY = canvasHeight / 2;

  return (
    <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
      {/* mid baseline */}
      <Path
        path={`M 24 ${midY} L ${canvasWidth - 24} ${midY}`}
        strokeWidth={0.5}
        style="stroke"
        color={COLORS.midLine}
      >
        <DashPathEffect intervals={[6, 6]} />
      </Path>

      {/* ghost trail */}
      <Path path={trailPath} strokeWidth={2} style="stroke" color={COLORS.trail} strokeJoin="round" strokeCap="round" />

      {/* active trace */}
      <Path path={activePath} strokeWidth={3} style="stroke" color={COLORS.trailActive} strokeJoin="round" strokeCap="round" />

      {/* dot outer */}
      <Circle cx={dotX} cy={dotY} r={10} color={COLORS.dot} opacity={0.35} />
      {/* dot mid */}
      <Circle cx={dotX} cy={dotY} r={7} color={COLORS.dot} />
      {/* dot core */}
      <Circle cx={dotX} cy={dotY} r={4} color={COLORS.dotCore} />
    </Canvas>
  );
}
