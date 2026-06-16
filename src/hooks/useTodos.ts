import { useState, useEffect } from 'react';
import type { Container, TodoItem, SubStep } from '../types';
import { INITIAL_CONTAINERS } from '../initialData';

const STORAGE_KEY = 'todos-v5';
const DISMISSED_KEY = 'todos-dismissed-v1'; // IDs of items that were completed and purged — never re-seed these
const EXPIRY_MS = 48 * 60 * 60 * 1000;

function getDismissedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

function recordDismissed(ids: string[]) {
  if (!ids.length) return;
  const existing = getDismissedIds();
  ids.forEach(id => existing.add(id));
  localStorage.setItem(DISMISSED_KEY, JSON.stringify([...existing]));
}

// Remove completed items older than 48 hrs, recording their IDs so they never come back
function purgeExpired(containers: Container[]): Container[] {
  const now = Date.now();
  const purgedIds: string[] = [];

  const result = containers.map(c => ({
    ...c,
    items: c.items.filter(item => {
      if (!item.completed) return true;
      const expired = !item.completedAt || now - item.completedAt >= EXPIRY_MS;
      if (expired) purgedIds.push(item.id);
      return !expired;
    }),
  }));

  recordDismissed(purgedIds);
  return result;
}

// Add whole containers from initialData that aren't in saved data yet
function mergeNewContainers(saved: Container[]): Container[] {
  const savedIds = new Set(saved.map(c => c.id));
  const newContainers = INITIAL_CONTAINERS.filter(c => !savedIds.has(c.id));
  return [...saved, ...newContainers];
}

// Add items/sections from initialData that don't exist yet AND haven't been dismissed.
// This lets me add items to initialData.ts and have them auto-appear without wiping
// the user's drag order, completions, or custom-added items.
function mergeNewItems(saved: Container[]): Container[] {
  const dismissed = getDismissedIds();
  const initialMap = Object.fromEntries(INITIAL_CONTAINERS.map(c => [c.id, c]));

  return saved.map(savedContainer => {
    const initial = initialMap[savedContainer.id];
    if (!initial) return savedContainer;

    const savedItemIds = new Set(savedContainer.items.map(i => i.id));
    const newItems = initial.items.filter(i => !savedItemIds.has(i.id) && !dismissed.has(i.id));

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
          // Un-checking: remove from dismissed set so it can be re-added if needed
          const dismissed = getDismissedIds();
          dismissed.delete(itemId);
          localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissed]));
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

  function tagEvan(containerId: string, itemId: string) {
    updateItems(containerId, items =>
      items.map(item => item.id === itemId ? { ...item, evan: !item.evan } : item)
    );
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

  function moveItemToContainer(fromContainerId: string, toContainerId: string, itemId: string) {
    setContainers(prev => {
      const fromContainer = prev.find(c => c.id === fromContainerId);
      if (!fromContainer) return prev;
      const item = fromContainer.items.find(i => i.id === itemId);
      if (!item) return prev;

      const fromActive = fromContainer.items.filter(i => !i.completed);
      const itemActiveIndex = fromActive.findIndex(i => i.id === itemId);
      const fromDivider = fromContainer.dividerIndex ?? 1;
      const newFromDivider = itemActiveIndex !== -1 && itemActiveIndex < fromDivider
        ? Math.max(0, fromDivider - 1)
        : fromDivider;

      return prev.map(c => {
        if (c.id === fromContainerId) {
          return { ...c, items: c.items.filter(i => i.id !== itemId), dividerIndex: newFromDivider };
        }
        if (c.id === toContainerId) {
          const activeItems = c.items.filter(i => !i.completed);
          const completedItems = c.items.filter(i => i.completed);
          return { ...c, items: [...activeItems, { ...item, completed: false, completedAt: undefined }, ...completedItems] };
        }
        return c;
      });
    });
  }

  function reorderSubSteps(containerId: string, itemId: string, newSubSteps: SubStep[]) {
    updateItems(containerId, items =>
      items.map(item => item.id === itemId ? { ...item, subSteps: newSubSteps } : item)
    );
  }

  return { containers, toggleItem, toggleSubStep, addItem, addSubStep, tagEvan, reorderItems, moveItemToContainer, reorderSubSteps };
}
