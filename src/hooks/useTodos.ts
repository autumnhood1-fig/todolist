import { useState, useEffect } from 'react';
import type { Container, TodoItem, SubStep } from '../types';
import { INITIAL_CONTAINERS } from '../initialData';

const STORAGE_KEY = 'todos-v2';
const EXPIRY_MS = 48 * 60 * 60 * 1000;

function purgeExpired(containers: Container[]): Container[] {
  const now = Date.now();
  return containers.map(c => ({
    ...c,
    items: c.items.filter(item => {
      if (!item.completed) return true;
      if (!item.completedAt) return false;
      return now - item.completedAt < EXPIRY_MS;
    }),
  }));
}

function mergeNewContainers(saved: Container[]): Container[] {
  const savedIds = new Set(saved.map(c => c.id));
  const newContainers = INITIAL_CONTAINERS.filter(c => !savedIds.has(c.id));
  return [...saved, ...newContainers];
}

function loadFromStorage(): Container[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CONTAINERS;
    const parsed = JSON.parse(raw) as Container[];
    return mergeNewContainers(purgeExpired(parsed));
  } catch {
    return INITIAL_CONTAINERS;
  }
}

export function useTodos() {
  const [containers, setContainers] = useState<Container[]>(loadFromStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(containers));
  }, [containers]);

  function updateItems(containerId: string, updater: (items: TodoItem[]) => TodoItem[]) {
    setContainers(prev =>
      prev.map(c => c.id === containerId ? { ...c, items: updater(c.items) } : c)
    );
  }

  function toggleItem(containerId: string, itemId: string) {
    updateItems(containerId, items =>
      items.map(item => {
        if (item.id !== itemId) return item;
        if (item.completed) {
          return { ...item, completed: false, completedAt: undefined };
        }
        return { ...item, completed: true, completedAt: Date.now() };
      })
    );
  }

  function toggleSubStep(containerId: string, itemId: string, subStepId: string) {
    updateItems(containerId, items =>
      items.map(item => {
        if (item.id !== itemId) return item;
        const updatedSubSteps: SubStep[] = item.subSteps.map(s =>
          s.id === subStepId ? { ...s, completed: !s.completed } : s
        );
        return { ...item, subSteps: updatedSubSteps };
      })
    );
  }

  function addItem(containerId: string, item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) {
    const newItem: TodoItem = {
      ...item,
      id: crypto.randomUUID(),
      completed: false,
    };
    updateItems(containerId, items => [...items, newItem]);
  }

  function reorderItems(containerId: string, newItems: TodoItem[], newDividerIndex: number) {
    setContainers(prev =>
      prev.map(c => c.id === containerId ? { ...c, items: newItems, dividerIndex: newDividerIndex } : c)
    );
  }

  return { containers, toggleItem, toggleSubStep, addItem, reorderItems };
}
