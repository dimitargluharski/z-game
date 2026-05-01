import { useEffect, useState, useRef } from 'react';
import { Building, BuildingType, BUILDING_PRODUCTION, ResourceState } from '@shared/BaseBuilding';

type ProductionDelta = {
  wood: number;
  food: number;
  metal: number;
  gold: number;
};

export function useResourceProduction(
  buildings: Building[],
  initialResources: ResourceState,
  onResourcesUpdate: (newResources: ResourceState) => void
) {
  const [resources, setResources] = useState<ResourceState>(initialResources);
  const [lastProduction, setLastProduction] = useState<ProductionDelta>({
    wood: 0,
    food: 0,
    metal: 0,
    gold: 0
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      let totalProduction: ProductionDelta = {
        wood: 0,
        food: 0,
        metal: 0,
        gold: 0
      };

      buildings.forEach(building => {
        const prod = BUILDING_PRODUCTION[building.type];

        if (building.type === BuildingType.LUMBERJACK) {
          totalProduction.wood += (prod.wood || 0) * building.level;
        } else if (building.type === BuildingType.FARM) {
          totalProduction.food += (prod.food || 0) * building.level;
        } else if (building.type === BuildingType.MINE) {
          totalProduction.metal += (prod.metal || 0) * building.level;
        }
      });

      setLastProduction(totalProduction);

      setResources(prev => {
        const newResources = {
          wood: prev.wood + totalProduction.wood,
          food: prev.food + totalProduction.food,
          metal: prev.metal + totalProduction.metal,
          gold: prev.gold + totalProduction.gold
        };
        onResourcesUpdate(newResources);
        return newResources;
      });

      setTimeout(() => {
        setLastProduction({ wood: 0, food: 0, metal: 0, gold: 0 });
      }, 800);

    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [buildings, onResourcesUpdate]);

  return { resources, lastProduction };
}