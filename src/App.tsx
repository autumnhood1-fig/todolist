import { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoContainer } from './components/TodoContainer';
import { getColor } from './colors';
import type { Container, TodoItem } from './types';

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

const ROWS: { ids: string[]; cols: string }[] = [
  { ids: ['chores', 'personal', 'otelier'],     cols: 'grid-cols-1 lg:grid-cols-3' },
  { ids: ['calls', 'health', 'kids'],           cols: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' },
  { ids: ['unt', 'travel', 'finances'],         cols: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
  { ids: ['deep-cleaning', 'to-buy', 'writing'], cols: 'grid-cols-1 sm:grid-cols-3' },
];

export default function App() {
  const {
    containers, toggleItem, toggleSubStep, addItem, addSubStep,
    tagEvan, reorderItems, moveItemToContainer, reorderSubSteps,
  } = useTodos();

  const [crossDrag, setCrossDrag] = useState<{ itemId: string; fromId: string } | null>(null);

  const byId = Object.fromEntries(containers.map(c => [c.id, c]));

  function renderContainer(c: Container) {
    return (
      <TodoContainer
        key={c.id}
        container={c}
        color={getColor(c.id)}
        onToggleItem={(itemId) => toggleItem(c.id, itemId)}
        onToggleSubStep={(itemId, subId) => toggleSubStep(c.id, itemId, subId)}
        onAddItem={(item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => addItem(c.id, item)}
        onAddSubStep={(itemId, text) => addSubStep(c.id, itemId, text)}
        onTagEvan={(itemId) => tagEvan(c.id, itemId)}
        onReorderItems={(newItems, newDividerIndex) => reorderItems(c.id, newItems, newDividerIndex)}
        onReorderSubSteps={(itemId, newSubSteps) => reorderSubSteps(c.id, itemId, newSubSteps)}
        onCrossDragStart={(itemId) => setCrossDrag({ itemId, fromId: c.id })}
        onCrossDragEnd={() => setCrossDrag(null)}
        isExternalDragActive={crossDrag !== null && crossDrag.fromId !== c.id}
        onReceiveExternalDrop={() => {
          if (crossDrag) moveItemToContainer(crossDrag.fromId, c.id, crossDrag.itemId);
          setCrossDrag(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-dvh bg-stone-50 px-3 py-8 md:px-5">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">My Tasks</h1>
          <p className="text-sm text-stone-400 mt-1">
            {new Date().toLocaleDateString('en-US', DATE_OPTS)}
          </p>
        </header>

        <div className="space-y-4">
          {ROWS.map(({ ids, cols }) => {
            const row = ids.map(id => byId[id]).filter(Boolean);
            if (row.length === 0) return null;
            return (
              <div key={ids.join()} className={`grid ${cols} gap-4`}>
                {row.map(renderContainer)}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
