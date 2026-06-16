import { useState } from 'react';
import type { Container, TodoItem } from '../types';
import type { ContainerColor } from '../colors';
import { TodoItemRow } from './TodoItemRow';
import { AddItemForm } from './AddItemForm';

interface Props {
  container: Container;
  color: ContainerColor;
  onToggleItem: (itemId: string) => void;
  onToggleSubStep: (itemId: string, subStepId: string) => void;
  onAddItem: (item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => void;
}

function Chevron({ collapsed, color }: { collapsed: boolean; color: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      className={`w-3.5 h-3.5 transition-transform duration-150 ${collapsed ? '-rotate-90' : ''}`}
      style={{ color }}
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

export function TodoContainer({ container, color, onToggleItem, onToggleSubStep, onAddItem }: Props) {
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
    <div
      className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden"
      style={{ border: `1px solid ${color.accent}28`, borderTop: `3px solid ${color.accent}` }}
    >
      {/* Header */}
      <button
        onClick={() => { setCollapsed(c => !c); if (!collapsed) setShowAdd(false); }}
        className="flex items-center justify-between px-4 pt-3 pb-3 text-left w-full group"
        style={{ background: color.bg }}
      >
        <h2
          className={`font-semibold ${container.size === 'big' ? 'text-base' : 'text-sm'}`}
          style={{ color: color.text }}
        >
          {container.name}
        </h2>
        <div className="flex items-center gap-2">
          {activeItems.length > 0 && (
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded-full"
              style={{ color: color.accent, background: `${color.accent}18` }}
            >
              {activeItems.length}
            </span>
          )}
          <Chevron collapsed={collapsed} color={color.accent} />
        </div>
      </button>

      {/* Body */}
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
                  accentColor={color.accent}
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
                      accentColor={color.accent}
                      onToggle={() => onToggleItem(item.id)}
                      onToggleSubStep={(subId) => onToggleSubStep(item.id, subId)}
                    />
                  </div>
                ))}
              </div>
            )}

            {container.sections?.map(section => (
              <div key={section.id} className="border-t border-stone-100 mt-2">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-2 text-left group"
                >
                  <span className="text-xs font-medium italic" style={{ color: color.accent }}>
                    {section.label}
                  </span>
                  <Chevron
                    collapsed={collapsedSections[section.id] ?? true}
                    color={color.accent}
                  />
                </button>
                {!collapsedSections[section.id] && (
                  <ul className="pb-3 space-y-1.5">
                    {section.items.map(item => (
                      <li key={item.id} className="flex items-start gap-2 text-xs text-stone-500">
                        <span className="shrink-0 mt-0.5" style={{ color: color.accent }}>·</span>
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
                className="text-xs py-1 transition-colors"
                style={{ color: `${color.accent}99` }}
                onMouseEnter={e => (e.currentTarget.style.color = color.accent)}
                onMouseLeave={e => (e.currentTarget.style.color = `${color.accent}99`)}
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
