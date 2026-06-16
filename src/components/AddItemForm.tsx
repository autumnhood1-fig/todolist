import { useState, useRef, useEffect } from 'react';
import type { TodoItem, SubStep } from '../types';

type Mode = 'primary' | 'subtask';

interface Props {
  existingItems: TodoItem[];
  accentColor: string;
  onAdd: (item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => void;
  onAddSubStep: (itemId: string, text: string) => void;
  onCancel: () => void;
}

export function AddItemForm({ existingItems, accentColor, onAdd, onAddSubStep, onCancel }: Props) {
  const [mode, setMode] = useState<Mode>('primary');

  // Primary task state
  const [text, setText] = useState('');
  const [details, setDetails] = useState('');
  const [showDetails, setShowDetails] = useState(false);
  const [subStepTexts, setSubStepTexts] = useState<string[]>([]);
  const [showSubSteps, setShowSubSteps] = useState(false);

  // Subtask state
  const [parentId, setParentId] = useState('');
  const [subText, setSubText] = useState('');

  const primaryInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  const activeItems = existingItems.filter(i => !i.completed);

  useEffect(() => {
    primaryInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mode === 'subtask') {
      if (!parentId && activeItems.length > 0) setParentId(activeItems[0].id);
      setTimeout(() => subInputRef.current?.focus(), 0);
    } else {
      setTimeout(() => primaryInputRef.current?.focus(), 0);
    }
  }, [mode]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') onCancel();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'primary') {
      if (!text.trim()) return;
      const subSteps: SubStep[] = subStepTexts
        .filter(s => s.trim())
        .map(s => ({ id: crypto.randomUUID(), text: s.trim(), completed: false }));
      onAdd({ text: text.trim(), details: details.trim() || undefined, subSteps });
    } else {
      if (!subText.trim() || !parentId) return;
      onAddSubStep(parentId, subText.trim());
    }
  }

  function addSubStepField() { setSubStepTexts(prev => [...prev, '']); }
  function updateSubStep(i: number, val: string) {
    setSubStepTexts(prev => prev.map((s, idx) => idx === i ? val : s));
  }
  function removeSubStep(i: number) {
    setSubStepTexts(prev => prev.filter((_, idx) => idx !== i));
  }

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="mt-2 rounded-lg border border-stone-200 bg-stone-50 p-3">

      {/* Mode toggle */}
      <div className="flex gap-1.5 mb-3">
        {(['primary', 'subtask'] as Mode[]).map(m => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className="text-xs px-2.5 py-1 rounded-full font-medium transition-colors"
            style={
              mode === m
                ? { backgroundColor: accentColor, color: '#fff' }
                : { backgroundColor: '#e7e5e4', color: '#78716c' }
            }
          >
            {m === 'primary' ? 'Primary task' : 'Subtask of…'}
          </button>
        ))}
      </div>

      {mode === 'primary' ? (
        <>
          <input
            ref={primaryInputRef}
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
                    placeholder={`Subtask ${i + 1}`}
                    className="flex-1 text-xs bg-white border border-stone-200 rounded px-2 py-1 outline-none text-stone-700 placeholder-stone-400"
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubStepField(); } }}
                  />
                  <button type="button" onClick={() => removeSubStep(i)}
                    className="text-stone-300 hover:text-stone-500 text-sm leading-none" aria-label="Remove">
                    ✕
                  </button>
                </div>
              ))}
              <button type="button" onClick={addSubStepField}
                className="text-xs text-stone-400 hover:text-stone-600 ml-3">
                + subtask
              </button>
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <div className="flex gap-3 flex-1">
              {!showDetails && (
                <button type="button" onClick={() => setShowDetails(true)}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  + details
                </button>
              )}
              {!showSubSteps && (
                <button type="button" onClick={() => { setShowSubSteps(true); setSubStepTexts(['']); }}
                  className="text-xs text-stone-400 hover:text-stone-600 transition-colors">
                  + subtasks
                </button>
              )}
            </div>
            <div className="flex gap-2 items-center">
              <button type="button" onClick={onCancel}
                className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={!text.trim()}
                className="text-xs bg-stone-700 text-white px-3 py-1.5 rounded-md disabled:opacity-40 hover:bg-stone-800 transition-colors">
                Save
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {activeItems.length === 0 ? (
            <p className="text-xs text-stone-400 italic mb-2">No existing tasks to attach to.</p>
          ) : (
            <div className="mb-2.5">
              <label className="text-xs text-stone-500 mb-1 block">Under which task?</label>
              <select
                value={parentId}
                onChange={e => setParentId(e.target.value)}
                className="w-full text-xs bg-white border border-stone-200 rounded-md px-2 py-1.5 outline-none text-stone-700"
              >
                {activeItems.map(item => (
                  <option key={item.id} value={item.id}>{item.text}</option>
                ))}
              </select>
            </div>
          )}

          <input
            ref={subInputRef}
            type="text"
            value={subText}
            onChange={e => setSubText(e.target.value)}
            placeholder="Subtask description…"
            className="w-full text-sm bg-transparent outline-none text-stone-800 placeholder-stone-400"
          />

          <div className="mt-3 flex justify-end gap-2">
            <button type="button" onClick={onCancel}
              className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={!subText.trim() || !parentId}
              className="text-xs bg-stone-700 text-white px-3 py-1.5 rounded-md disabled:opacity-40 hover:bg-stone-800 transition-colors">
              Save
            </button>
          </div>
        </>
      )}
    </form>
  );
}
