import { useState, useEffect } from 'react';
import type { Container, TodoItem, SubStep } from '../types';
import { INITIAL_CONTAINERS } from '../initialData';

const STORAGE_KEY = 'todos-v5';
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

// Add containers from initialData that don't exist in saved data yet
function mergeNewContainers(saved: Container[]): Container[] {
  const savedIds = new Set(saved.map(c => c.id));
  const newContainers = INITIAL_CONTAINERS.filter(c => !savedIds.has(c.id));
  return [...saved, ...newContainers];
}

// Add items/sections from initialData that don't exist in saved containers yet.
// This means adding a new item to initialData.ts will automatically appear in the
// user's browser without wiping their drag order, completions, or custom-added items.
function mergeNewItems(saved: Container[]): Container[] {
  const initialMap = Object.fromEntries(INITIAL_CONTAINERS.map(c => [c.id, c]));

  return saved.map(savedContainer => {
    const initial = initialMap[savedContainer.id];
    if (!initial) return savedContainer;

    const savedItemIds = new Set(savedContainer.items.map(i => i.id));
    const newItems = initial.items.filter(i => !savedItemIds.has(i.id));

    const savedSectionIds = new Set((savedContainer.sections ?? []).map(s => s.id));
    const newSections = (initial.sections ?? []).filter(s => !savedSectionIds.has(s.id));

    if (newItems.length === 0 && newSections.length === 0) return savedContainer;

    return {
      ...savedContainer,
      items: [...savedContainer.items, ...newItems],
      sections: newSections.length > 0
        ? [...(savedContainer.sections ?? []), ...newSections]
        : savedContainer.sections,
    };
  });
}

function loadFromStorage(): Container[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_CONTAINERS;
    const parsed = JSON.parse(raw) as Container[];
    return mergeNewItems(mergeNewContainers(purgeExpired(parsed)));
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

  function addSubStep(containerId: string, itemId: string, text: string) {
    const newSubStep: SubStep = { id: crypto.randomUUID(), text, completed: false };
    updateItems(containerId, items =>
      items.map(item =>
        item.id === itemId ? { ...item, subSteps: [...item.subSteps, newSubStep] } : item
      )
    );
  }

  function reorderItems(containerId: string, newItems: TodoItem[], newDividerIndex: number) {
    setContainers(prev =>
      prev.map(c => c.id === containerId ? { ...c, items: newItems, dividerIndex: newDividerIndex } : c)
    );
  }

  return { containers, toggleItem, toggleSubStep, addItem, addSubStep, reorderItems };
}
