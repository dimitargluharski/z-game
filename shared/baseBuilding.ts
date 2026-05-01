import { Vector2 } from './types';

export enum BuildingType {
  CASTLE = 'castle',
  LUMBERJACK = 'lumberjack',
  FARM = 'farm',
  MINE = 'mine'
}

export interface Building {
  id: string;
  type: BuildingType;
  position: Vector2;
  level: number;
  health: number;
  maxHealth: number;
  isProducing: boolean;
}

export interface ResourceState {
  wood: number;
  food: number;
  metal: number;
  gold: number;
}

export const STARTING_RESOURCES: ResourceState = {
  wood: 500,
  food: 300,
  metal: 100,
  gold: 50
};

export const BUILDING_COSTS: Record<BuildingType, Partial<ResourceState>> = {
  [BuildingType.CASTLE]: { wood: 0, food: 0, metal: 0, gold: 0 },
  [BuildingType.LUMBERJACK]: { wood: 50, food: 0, metal: 0, gold: 0 },
  [BuildingType.FARM]: { wood: 30, food: 0, metal: 0, gold: 0 },
  [BuildingType.MINE]: { wood: 80, food: 0, metal: 20, gold: 0 }
};

export const BUILDING_PRODUCTION: Record<BuildingType, Partial<ResourceState>> = {
  [BuildingType.CASTLE]: { wood: 0, food: 0, metal: 0, gold: 0 },
  [BuildingType.LUMBERJACK]: { wood: 10, food: 0, metal: 0, gold: 0 },
  [BuildingType.FARM]: { wood: 0, food: 15, metal: 0, gold: 0 },
  [BuildingType.MINE]: { wood: 0, food: 0, metal: 5, gold: 0 }
};