export interface Vector2 {
  x: number;
  y: number;
}

export interface Player {
  id: string;
  position: Vector2;
  health: number;
  maxHealth: number;
  level: number;
  color: string;
}

export interface GameCommand {
  type: 'MOVE' | 'ATTACK' | 'BUILD';
  playerId: string;
  targetPosition: Vector2;
  timestamp: number;
}

export enum GamePhase {
  WAITING = 'waiting',
  PLAYING = 'playing',
  GAME_OVER = 'game_over'
}

export const GRID_SIZE = 20;
export const CELL_SIZE = 32;