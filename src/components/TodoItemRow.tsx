import { useState } from 'react';
import type { TodoItem, SubStep } from '../types';

interface Props {
  item: TodoItem;
  accentColor: string;
  isBelow?: boolean;
  onToggle: () => void;
  onToggleSubStep: (subStepId: string) => void;
  onTagEvan?: () => void;
  onReorderSubSteps?: (newSubSteps: SubStep[]) => void;
}

function SubGripIcon() {
  return (
    <svg viewBox="0 0 8 10" className="w-1.5 h-2.5 fill-current">
      <circle cx="2" cy="2"  r="1.2" />
      <circle cx="6" cy="2"  r="1.2" />
      <circle cx="2" cy="5"  r="1.2" />
      <circle cx="6" cy="5"  r="1.2" />
      <circle cx="2" cy="8"  r="1.2" />
      <circle cx="6" cy="8"  r="1.2" />
    </svg>
  );
}

export function TodoItemRow({ item, accentColor, isBelow, onToggle, onToggleSubStep, onTagEvan, onReorderSubSteps }: Props) {
  const [showDoneSubs, setShowDoneSubs] = useState(false);
  const [subDragging, setSubDragging] = useState<string | null>(null);
  const [subDropTarget, setSubDropTarget] = useState<string | null>(null);

  const activeSubSteps = item.subSteps.filter(s => !s.completed);
  const completedSubSteps = item.subSteps.filter(s => s.completed);

  function handleSubDragStart(subId: string, e: React.DragEvent) {
    e.stopPropagation(); // prevent parent item drag from also firing
    setSubDragging(subId);
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleSubDragOver(subId: string, e: React.DragEvent) {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (subId !== subDragging) setSubDropTarget(subId);
  }

  function handleSubDrop(targetSubId: string, e: React.DragEvent) {
    e.stopPropagation();
    if (!subDragging || subDragging === targetSubId || !onReorderSubSteps) { cleanupSub(); return; }

    const ids = activeSubSteps.map(s => s.id);
    const from = ids.indexOf(subDragging);
    const to = ids.indexOf(targetSubId);
    if (from === -1 || to === -1) { cleanupSub(); return; }

    const newIds = [...ids];
    newIds.splice(from, 1);
    newIds.splice(from < to ? to - 1 : to, 0, subDragging);

    const subMap = Object.fromEntries(item.subSteps.map(s => [s.id, s]));
    onReorderSubSteps([...newIds.map(id => subMap[id]), ...completedSubSteps]);
    cleanupSub();
  }

  function cleanupSub() {
    setSubDragging(null);
    setSubDropTarget(null);
  }

  return (
    <div className="py-1.5">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className="mt-0.5 shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors"
          style={
            item.completed
              ? { backgroundColor: accentColor, borderColor: accentColor }
              : { borderColor: '#d6d3d1' }
          }
          aria-label={item.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {item.completed && (
            <svg viewBox="0 0 12 10" className="w-2.5 h-2.5">
              <polyline points="1,5 4.5,8.5 11,1" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <span className={`flex-1 text-sm leading-snug ${
          item.completed
            ? 'line-through text-stone-400 font-medium'
            : isBelow
              ? 'font-normal text-stone-400'
              : 'font-medium text-stone-800'
        }`}>
          {item.text}
        </span>

        {!item.completed && onTagEvan && (
          <button
            onClick={(e) => { e.stopPropagation(); onTagEvan(); }}
            className={`shrink-0 self-start mt-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded-full border transition-all duration-150 ${
              item.evan
                ? 'opacity-100 bg-blue-50 border-blue-200 text-blue-500'
                : 'opacity-0 group-hover/drag:opacity-50 bg-transparent border-stone-200 text-stone-400 hover:!opacity-100'
            }`}
            aria-label={item.evan ? 'Remove Evan tag' : 'Tag for Evan'}
          >
            Evan
          </button>
        )}
      </div>

      {(item.details || item.subSteps.length > 0) && (
        <div className="ml-[30px] mt-1.5">
          {item.details && (
            <p className="text-xs text-stone-500 mb-1.5 leading-relaxed">{item.details}</p>
          )}

          {activeSubSteps.length > 0 && (
            <ul className="space-y-1.5">
              {activeSubSteps.map(sub => {
                const isDragging = subDragging === sub.id;
                const isTarget = subDropTarget === sub.id && !isDragging;
                return (
                  <li
                    key={sub.id}
                    draggable={!!onReorderSubSteps}
                    onDragStart={(e) => handleSubDragStart(sub.id, e)}
                    onDragOver={(e) => handleSubDragOver(sub.id, e)}
                    onDrop={(e) => handleSubDrop(sub.id, e)}
                    onDragEnd={cleanupSub}
                    className={`flex items-center gap-2 group/sub transition-opacity ${isDragging ? 'opacity-30' : 'opacity-100'}`}
                    style={isTarget ? { borderTop: `1.5px solid ${accentColor}` } : undefined}
                  >
                    <button
                      onClick={() => onToggleSubStep(sub.id)}
                      className="shrink-0 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors"
                      style={{ borderColor: '#d6d3d1' }}
                      aria-label="Mark complete"
                    />
                    <span className="flex-1 text-xs leading-snug text-stone-600">{sub.text}</span>
                    {onReorderSubSteps && (
                      <div className="opacity-0 group-hover/sub:opacity-30 cursor-grab active:cursor-grabbing text-stone-400 pointer-events-none">
                        <SubGripIcon />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}

          {completedSubSteps.length > 0 && (
            <div className="mt-1.5">
              <button
                onClick={() => setShowDoneSubs(d => !d)}
                className="flex items-center gap-1 text-[10px] text-stone-300 hover:text-stone-400 transition-colors"
              >
                <span className="uppercase tracking-wider">Done ({completedSubSteps.length})</span>
                <svg
                  viewBox="0 0 16 16"
                  className={`w-2.5 h-2.5 transition-transform duration-150 ${showDoneSubs ? '' : '-rotate-90'}`}
                  fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="4,6 8,10 12,6" />
                </svg>
              </button>
              {showDoneSubs && (
                <ul className="mt-1 space-y-1.5">
                  {completedSubSteps.map(sub => (
                    <li key={sub.id} className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleSubStep(sub.id)}
                        className="shrink-0 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors"
                        style={{ backgroundColor: accentColor, borderColor: accentColor }}
                        aria-label="Mark incomplete"
                      >
                        <svg viewBox="0 0 10 8" className="w-2 h-2">
                          <polyline points="1,4 3.5,6.5 9,1" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <span className="flex-1 text-xs leading-snug line-through text-stone-300">{sub.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
