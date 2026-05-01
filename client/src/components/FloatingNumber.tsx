import React, { useEffect, useState, useRef } from 'react';

interface FloatingNumberProps {
  value: number;
  x: number;
  y: number;
  onComplete: () => void;
  type: 'resource' | 'building';
}

export function FloatingNumber({ value, x, y, onComplete, type }: FloatingNumberProps) {
  const [opacity, setOpacity] = useState(1);
  const [offsetY, setOffsetY] = useState(0);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 800;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setOpacity(1 - progress);
      setOffsetY(-progress * 40);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [onComplete]);

  const textColor = type === 'resource' ? '#FFD700' : '#4CAF50';

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y + offsetY,
        transform: 'translate(-50%, -50%)',
        color: textColor,
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'monospace',
        textShadow: '2px 2px 0px rgba(0,0,0,0.8)',
        opacity: opacity,
        pointerEvents: 'none',
        zIndex: 1000,
        whiteSpace: 'nowrap'
      }}
    >
      +{Math.floor(value)}
    </div>
  );
}