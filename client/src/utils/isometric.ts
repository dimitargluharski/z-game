import { Vector2, TILE_WIDTH, TILE_HEIGHT, TILE_HALF_WIDTH, TILE_HALF_HEIGHT } from '@shared/types';

export function gridToIso(gridX: number, gridY: number): Vector2 {
  const screenX = (gridX - gridY) * TILE_HALF_WIDTH;
  const screenY = (gridX + gridY) * TILE_HALF_HEIGHT;
  return { x: screenX, y: screenY };
}

export function isoToGrid(screenX: number, screenY: number, centerX: number, centerY: number): Vector2 {
  const x = (screenX - centerX) / TILE_HALF_WIDTH;
  const y = (screenY - centerY) / TILE_HALF_HEIGHT;

  const gridX = Math.round((x + y) / 2);
  const gridY = Math.round((y - x) / 2);

  return { x: gridX, y: gridY };
}