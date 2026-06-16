import { useState, useRef, useEffect } from 'react';
import type { TodoItem, SubStep } from '../types';

interface Props {
  onAdd: (item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => void;
  onCancel: () => void;
}

export function AddItemForm({ onAdd, onCancel }: Props) {
  const [text, setText] = useState('');
  const [details, setDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [subStepTexts, setSubStepTexts] = useState<string[]>([]);
  const [showSubSteps, setShowSubSteps] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;

    const subSteps: SubStep[] = subStepTexts
      .filter(s => s.trim())
      .map(s => ({ id: crypto.randomUUID(), text: s.trim(), completed: false }));

    onAdd({
      text: text.trim(),
      details: details.trim() || undefined,
      subSteps,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onCancel();
  }

  function addSubStepField() {
    setSubStepTexts(prev => [...prev, '']);
  }

  function updateSubStep(index: number, value: string) {
    setSubStepTexts(prev => prev.map((s, i) => i === index ? value : s));
  }

  function removeSubStep(index: number) {
    setSubStepTexts(prev => prev.filter((_, i) => i !== index));
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="mt-2 rounded-lg border border-stone-200 bg-stone-50 p-3">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400"
      />

      {showDetails && (
        <textarea
          value={details}
          onChange={e => setDetails(e.target.value)}
          placeholder="Add details or context..."
          rows={2}
          className="mt-2 w-full text-xs bg-white border border-stone-200 rounded-md p-2 outline-none text-stone-700 placeholder-stone-400 resize-none"
        />
      )}

      {showSubSteps && (
        <div className="mt-2 space-y-1.5">
          {subStepTexts.map((s, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-stone-300 shrink-0 ml-1" />
              <input
                type="text"
                value={s}
                onChange={e => updateSubStep(i, e.target.value)}
                placeholder={`Substep ${i + 1}`}
                className="flex-1 text-xs bg-white border border-stone-200 rounded px-2 py-1 outline-none text-stone-700 placeholder-stone-400"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubStepField();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => removeSubStep(i)}
                className="text-stone-300 hover:text-stone-500 text-sm leading-none"
                aria-label="Remove substep"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubStepField}
            className="text-xs text-stone-400 hover:text-stone-600 ml-3"
          >
            + substep
          </button>
        </div>
      )}

      <div className="mt-3 flex items-center gap-3">
        <div className="flex gap-3 flex-1">
          {!showDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(true)}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              + details
            </button>
          )}
          {!showSubSteps && (
            <button
              type="button"
              onClick={() => {
                setShowSubSteps(true);
                setSubStepTexts(['']);
              }}
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              + substeps
            </button>
          )}
        </div>
        <div className="flex gap-2 items-center">
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!text.trim()}
            className="text-xs bg-stone-700 text-white px-3 py-1.5 rounded-md disabled:opacity-40 hover:bg-stone-800 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
