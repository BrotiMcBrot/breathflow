import React, { useMemo } from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Phase } from '../types';

interface Props {
  phases: Phase[];
  width?: number;
  height?: number;
  color: string;
  ghostColor: string;
}

/**
 * Static mini preview of a technique's breath curve.
 * Each technique gets its own unique "fingerprint" shape.
 */
export function TechniqueCurvePreview({ phases, width = 110, height = 44, color, ghostColor }: Props) {
  const pathD = useMemo(() => {
    const pad = 4;
    const midY = height / 2;
    let x = 0;
    let y = midY;
    const pts: { x: number; y: number }[] = [{ x, y }];

    for (const p of phases) {
      const len = p.seconds;
      let nx = x, ny = y;
      if (p.direction === 'up') ny = y - len;
      else if (p.direction === 'down') ny = y + len;
      else nx = x + len;
      // up/down also advance x slightly for readability in preview
      if (p.direction !== 'right') nx = x + len * 0.4;
      pts.push({ x: nx, y: ny });
      x = nx; y = ny;
    }

    // normalize to fit box
    const xs = pts.map((p) => p.x);
    const ys = pts.map((p) => p.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const w = maxX - minX || 1;
    const h = maxY - minY || 1;
    const sx = (width - pad * 2) / w;
    const sy = (height - pad * 2) / h;

    const norm = pts.map((p) => ({
      x: pad + (p.x - minX) * sx,
      y: pad + (p.y - minY) * sy,
    }));

    let d = `M ${norm[0].x.toFixed(1)} ${norm[0].y.toFixed(1)}`;
    for (let i = 1; i < norm.length; i++) {
      d += ` L ${norm[i].x.toFixed(1)} ${norm[i].y.toFixed(1)}`;
    }
    return { d, start: norm[0] };
  }, [phases, width, height]);

  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Path
          d={pathD.d}
          stroke={color}
          strokeWidth={2}
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <Circle cx={pathD.start.x} cy={pathD.start.y} r={3} fill={color} />
      </Svg>
    </View>
  );
}
