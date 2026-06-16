import { useState } from 'react';
import type { Container, TodoItem } from '../types';
import { TodoItemRow } from './TodoItemRow';
import { AddItemForm } from './AddItemForm';

interface Props {
  container: Container;
  onToggleItem: (itemId: string) => void;
  onToggleSubStep: (itemId: string, subStepId: string) => void;
  onAddItem: (item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => void;
}

function Chevron({ collapsed, className }: { collapsed: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`transition-transform duration-150 ${collapsed ? '-rotate-90' : ''} ${className ?? ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="4,6 8,10 12,6" />
    </svg>
  );
}

export function TodoContainer({ container, onToggleItem, onToggleSubStep, onAddItem }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries((container.sections ?? []).map(s => [s.id, true]))
  );

  const activeItems = container.items.filter(i => !i.completed);
  const completedItems = container.items.filter(i => i.completed);

  function toggleSection(sectionId: string) {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 flex flex-col">
      {/* Container header — click to collapse entire container */}
      <button
        onClick={() => { setCollapsed(c => !c); if (!collapsed) setShowAdd(false); }}
        className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-stone-100 text-left w-full group"
      >
        <h2 className={`font-semibold text-stone-800 ${container.size === 'big' ? 'text-base' : 'text-sm'}`}>
          {container.name}
        </h2>
        <div className="flex items-center gap-2">
          {activeItems.length > 0 && (
            <span className="text-xs text-stone-400">{activeItems.length} left</span>
          )}
          <Chevron collapsed={collapsed} className="w-3.5 h-3.5 text-stone-300 group-hover:text-stone-500" />
        </div>
      </button>

      {/* Collapsible body */}
      {!collapsed && (
        <>
          <div className="flex-1 px-4">
            {activeItems.length === 0 && completedItems.length === 0 && !showAdd && !container.sections?.length && (
              <p className="py-5 text-xs text-stone-300 text-center">No tasks yet</p>
            )}

            {activeItems.map((item, i) => (
              <div key={item.id} className={i < activeItems.length - 1 ? 'border-b border-stone-50' : ''}>
                <TodoItemRow
                  item={item}
                  onToggle={() => onToggleItem(item.id)}
                  onToggleSubStep={(subId) => onToggleSubStep(item.id, subId)}
                />
              </div>
            ))}

            {completedItems.length > 0 && (
              <div className={activeItems.length > 0 ? 'border-t border-stone-100 mt-1 pt-1' : ''}>
                <p className="text-[10px] uppercase tracking-widest text-stone-300 pt-2 pb-0.5">Done</p>
                {completedItems.map(item => (
                  <div key={item.id}>
                    <TodoItemRow
                      item={item}
                      onToggle={() => onToggleItem(item.id)}
                      onToggleSubStep={(subId) => onToggleSubStep(item.id, subId)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Collapsible sections (e.g. "Redesigns for later") */}
            {container.sections?.map(section => (
              <div key={section.id} className="border-t border-stone-100 mt-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-2 text-left group"
                >
                  <span className="text-xs text-stone-400 font-medium italic">{section.label}</span>
                  <Chevron
                    collapsed={collapsedSections[section.id] ?? true}
                    className="w-3 h-3 text-stone-300 group-hover:text-stone-500"
                  />
                </button>
                {!collapsedSections[section.id] && (
                  <ul className="pb-3 space-y-1.5">
                    {section.items.map(item => (
                      <li key={item.id} className="flex items-start gap-2 text-xs text-stone-500">
                        <span className="text-stone-300 shrink-0 mt-0.5">·</span>
                        {item.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {showAdd && (
              <AddItemForm
                onAdd={(item) => { onAddItem(item); setShowAdd(false); }}
                onCancel={() => setShowAdd(false)}
              />
            )}
          </div>

          {!showAdd && (
            <div className="px-4 pb-3 pt-1">
              <button
                onClick={() => setShowAdd(true)}
                className="text-xs text-stone-400 hover:text-stone-600 transition-colors py-1"
              >
                + Add
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
