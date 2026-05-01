import React, { useState, useRef, useEffect } from 'react';
import { TownView } from './components/TownView';
import { Building, BuildingType, STARTING_RESOURCES, ResourceState } from '@shared/BaseBuilding';
import { GRID_SIZE } from '@shared/types';
import { useResourceProduction } from './hooks/useResourceProduction';
import { FloatingNumber } from './components/FloatingNumber';

interface ResourceFloater {
  id: string;
  type: string;
  value: number;
  x: number;
  y: number;
}

function App() {
  const center = Math.floor(GRID_SIZE / 2);
  const [buildings, setBuildings] = useState<Building[]>([
    {
      id: 'castle_1',
      type: BuildingType.CASTLE,
      position: { x: center, y: center },
      level: 1,
      health: 100,
      maxHealth: 100,
      isProducing: true
    },
    {
      id: 'lumber_1',
      type: BuildingType.LUMBERJACK,
      position: { x: center + 1, y: center },
      level: 1,
      health: 50,
      maxHealth: 50,
      isProducing: true
    }
  ]);

  const [resources, setResources] = useState<ResourceState>(STARTING_RESOURCES);
  const { resources: currentResources, lastProduction } = useResourceProduction(buildings, resources, setResources);

  const [resourceFloaters, setResourceFloaters] = useState<ResourceFloater[]>([]);
  const previousProductionRef = useRef({ wood: 0, food: 0, metal: 0, gold: 0 });

  useEffect(() => {
    const prev = previousProductionRef.current;
    const newFloaters: ResourceFloater[] = [];

    const woodElement = document.querySelector('[data-resource="wood"]');
    const foodElement = document.querySelector('[data-resource="food"]');
    const metalElement = document.querySelector('[data-resource="metal"]');
    const goldElement = document.querySelector('[data-resource="gold"]');

    const woodRect = woodElement?.getBoundingClientRect();
    const foodRect = foodElement?.getBoundingClientRect();
    const metalRect = metalElement?.getBoundingClientRect();
    const goldRect = goldElement?.getBoundingClientRect();

    if (lastProduction.wood > 0 && lastProduction.wood !== prev.wood && woodRect) {
      newFloaters.push({
        id: `wood-${Date.now()}-${Math.random()}`,
        type: 'wood',
        value: lastProduction.wood,
        x: woodRect.right - 20,
        y: woodRect.top - 10
      });
    }
    if (lastProduction.food > 0 && lastProduction.food !== prev.food && foodRect) {
      newFloaters.push({
        id: `food-${Date.now()}-${Math.random()}`,
        type: 'food',
        value: lastProduction.food,
        x: foodRect.right - 20,
        y: foodRect.top - 10
      });
    }
    if (lastProduction.metal > 0 && lastProduction.metal !== prev.metal && metalRect) {
      newFloaters.push({
        id: `metal-${Date.now()}-${Math.random()}`,
        type: 'metal',
        value: lastProduction.metal,
        x: metalRect.right - 20,
        y: metalRect.top - 10
      });
    }
    if (lastProduction.gold > 0 && lastProduction.gold !== prev.gold && goldRect) {
      newFloaters.push({
        id: `gold-${Date.now()}-${Math.random()}`,
        type: 'gold',
        value: lastProduction.gold,
        x: goldRect.right - 20,
        y: goldRect.top - 10
      });
    }

    if (newFloaters.length > 0) {
      setResourceFloaters(prev => [...prev, ...newFloaters]);

      setTimeout(() => {
        setResourceFloaters(prev => prev.filter(f => !newFloaters.some(nf => nf.id === f.id)));
      }, 800);
    }

    previousProductionRef.current = { ...lastProduction };
  }, [lastProduction]);

  const removeFloating = (id: string) => {
    setResourceFloaters(prev => prev.filter(f => f.id !== id));
  };

  const handleBuildingClick = (building: Building) => {
    if (building.type === BuildingType.LUMBERJACK) {
      const cost = 50 + building.level * 20;
      if (currentResources.wood >= cost) {
        setResources(prev => ({
          ...prev,
          wood: prev.wood - cost
        }));

        setBuildings(prevBuildings =>
          prevBuildings.map(b =>
            b.id === building.id
              ? { ...b, level: b.level + 1, health: b.maxHealth + 20, maxHealth: b.maxHealth + 20 }
              : b
          )
        );

        alert(`✅ Lumberjack upgraded to level ${building.level + 1}`);
      } else {
        alert(`❌ Need ${cost} wood! You have ${Math.floor(currentResources.wood)}`);
      }
    } else {
      alert(`🏰 Castle level ${building.level}\nYour headquarters`);
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      <div style={{
        position: 'fixed',
        top: 16,
        right: 16,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '40px',
        fontFamily: 'monospace',
        fontSize: '20px',
        fontWeight: 'bold',
        zIndex: 100,
        display: 'flex',
        gap: '32px',
        border: '1px solid rgba(255,215,0,0.3)',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <span style={{ fontSize: '28px' }}>🪵</span>
          <span data-resource="wood">{Math.floor(currentResources.wood).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <span style={{ fontSize: '28px' }}>🌾</span>
          <span data-resource="food">{Math.floor(currentResources.food).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <span style={{ fontSize: '28px' }}>⛏️</span>
          <span data-resource="metal">{Math.floor(currentResources.metal).toLocaleString()}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <span style={{ fontSize: '28px' }}>💰</span>
          <span data-resource="gold">{Math.floor(currentResources.gold).toLocaleString()}</span>
        </div>
      </div>

      <TownView
        buildings={buildings}
        onBuildingClick={handleBuildingClick}
      />

      {resourceFloaters.map(f => (
        <FloatingNumber
          key={f.id}
          value={f.value}
          x={f.x}
          y={f.y}
          type="resource"
          onComplete={() => removeFloating(f.id)}
        />
      ))}
    </div>
  );
}

export default App;