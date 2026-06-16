import { useTodos } from './hooks/useTodos';
import { TodoContainer } from './components/TodoContainer';

const DATE_OPTS: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
};

export default function App() {
  const { containers, toggleItem, toggleSubStep, addItem } = useTodos();

  const bigContainers = containers.filter(c => c.size === 'big');
  const mediumContainers = containers.filter(c => c.size === 'medium');

  return (
    <div className="min-h-dvh bg-stone-50 px-4 py-8 md:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight">My Tasks</h1>
          <p className="text-sm text-stone-400 mt-1">
            {new Date().toLocaleDateString('en-US', DATE_OPTS)}
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {bigContainers.map(c => (
            <TodoContainer
              key={c.id}
              container={c}
              onToggleItem={(itemId) => toggleItem(c.id, itemId)}
              onToggleSubStep={(itemId, subId) => toggleSubStep(c.id, itemId, subId)}
              onAddItem={(item) => addItem(c.id, item)}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mediumContainers.map(c => (
            <TodoContainer
              key={c.id}
              container={c}
              onToggleItem={(itemId) => toggleItem(c.id, itemId)}
              onToggleSubStep={(itemId, subId) => toggleSubStep(c.id, itemId, subId)}
              onAddItem={(item) => addItem(c.id, item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
