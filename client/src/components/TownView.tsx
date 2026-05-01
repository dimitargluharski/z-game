import React, { useEffect, useRef } from 'react';
import { GRID_SIZE, TILE_WIDTH, TILE_HEIGHT } from '@shared/types';
import { Building, BuildingType } from '@shared/BaseBuilding';
import { gridToIso } from '../utils/isometric';

interface TownViewProps {
  buildings: Building[];
  onBuildingClick: (building: Building) => void;
}

const getBuildingGradient = (type: BuildingType, ctx: CanvasRenderingContext2D, x: number, y: number) => {
  const grad = ctx.createLinearGradient(x, y, x + TILE_WIDTH, y + TILE_HEIGHT);
  switch (type) {
    case BuildingType.CASTLE:
      grad.addColorStop(0, '#8B6914');
      grad.addColorStop(1, '#5C4033');
      break;
    case BuildingType.LUMBERJACK:
      grad.addColorStop(0, '#3A7D34');
      grad.addColorStop(1, '#1B4D1B');
      break;
    case BuildingType.FARM:
      grad.addColorStop(0, '#DAA520');
      grad.addColorStop(1, '#B8860B');
      break;
    case BuildingType.MINE:
      grad.addColorStop(0, '#808080');
      grad.addColorStop(1, '#404040');
      break;
    default:
      grad.addColorStop(0, '#CCCCCC');
      grad.addColorStop(1, '#888888');
  }
  return grad;
};

export function TownView({ buildings, onBuildingClick }: TownViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      drawCanvas();
    };

    const drawCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      const offsetX = width / 2;
      const offsetY = height / 2 - 50;

      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = '#0d1f0d';
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const iso = gridToIso(x, y);
          const screenX = offsetX + iso.x;
          const screenY = offsetY + iso.y;

          if (screenX + TILE_WIDTH < 0 || screenX - TILE_WIDTH > width ||
            screenY + TILE_HEIGHT < 0 || screenY - TILE_HEIGHT > height) {
            continue;
          }

          ctx.beginPath();
          ctx.moveTo(screenX, screenY);
          ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
          ctx.lineTo(screenX, screenY + TILE_HEIGHT);
          ctx.lineTo(screenX - TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
          ctx.closePath();

          const centerX = GRID_SIZE / 2;
          const centerY = GRID_SIZE / 2;
          const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDist = Math.sqrt(Math.pow(GRID_SIZE / 2, 2) + Math.pow(GRID_SIZE / 2, 2));
          const brightness = Math.max(0.3, 1 - (distFromCenter / maxDist) * 0.5);

          ctx.fillStyle = `rgba(70, 120, 70, ${brightness})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(50, 90, 50, ${brightness * 0.8})`;
          ctx.stroke();
        }
      }

      buildings.forEach(building => {
        const iso = gridToIso(building.position.x, building.position.y);
        const screenX = offsetX + iso.x;
        const screenY = offsetY + iso.y - TILE_HEIGHT / 2;

        if (screenX + TILE_WIDTH < 0 || screenX - TILE_WIDTH > width ||
          screenY + TILE_HEIGHT < 0 || screenY - TILE_HEIGHT > height) {
          return;
        }

        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;

        ctx.fillStyle = getBuildingGradient(building.type, ctx, screenX, screenY);
        ctx.fillRect(screenX - TILE_WIDTH / 3, screenY, TILE_WIDTH * 0.66, TILE_HEIGHT * 0.8);

        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - TILE_WIDTH / 3, screenY, TILE_WIDTH * 0.66, TILE_HEIGHT * 0.8);

        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        let icon = '';
        switch (building.type) {
          case BuildingType.CASTLE: icon = '🏰'; break;
          case BuildingType.LUMBERJACK: icon = '🪵'; break;
          case BuildingType.FARM: icon = '🌾'; break;
          case BuildingType.MINE: icon = '⛏️'; break;
        }

        ctx.font = `bold ${TILE_HEIGHT * 0.5}px "Segoe UI Emoji"`;
        ctx.fillStyle = 'white';
        ctx.fillText(icon, screenX - 14, screenY + TILE_HEIGHT * 0.45);

        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.shadowBlur = 2;
        ctx.shadowColor = 'black';
        ctx.fillText(`Lv.${building.level}`, screenX - 18, screenY + TILE_HEIGHT * 0.7);
        ctx.shadowBlur = 0;
      });

      // Мъгла
      const gradient = ctx.createRadialGradient(
        width / 2, height / 2, 0,
        width / 2, height / 2, Math.max(width, height) / 1.5
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.85)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => window.removeEventListener('resize', resizeCanvas);
  }, [buildings]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 2 - 50;

    let minDist = 40;
    let clickedBuilding: Building | null = null;

    buildings.forEach(building => {
      const iso = gridToIso(building.position.x, building.position.y);
      const screenX = offsetX + iso.x;
      const screenY = offsetY + iso.y - TILE_HEIGHT / 2;
      const dx = mouseX - screenX;
      const dy = mouseY - screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        minDist = dist;
        clickedBuilding = building;
      }
    });

    if (clickedBuilding) {
      onBuildingClick(clickedBuilding);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#0a1a0a'
      }}
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          cursor: 'pointer'
        }}
      />
    </div>
  );
}