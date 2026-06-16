import { useState } from 'react';
import type { Container, TodoItem, SubStep } from '../types';
import type { ContainerColor } from '../colors';
import { TodoItemRow } from './TodoItemRow';
import { AddItemForm } from './AddItemForm';

const DIVIDER_ID = '__divider__';

interface Props {
  container: Container;
  color: ContainerColor;
  onToggleItem: (itemId: string) => void;
  onToggleSubStep: (itemId: string, subStepId: string) => void;
  onAddItem: (item: Omit<TodoItem, 'id' | 'completed' | 'completedAt'>) => void;
  onAddSubStep: (itemId: string, text: string) => void;
  onTagEvan: (itemId: string) => void;
  onReorderItems: (newItems: TodoItem[], newDividerIndex: number) => void;
  onReorderSubSteps: (itemId: string, newSubSteps: SubStep[]) => void;
  // cross-container drag
  onCrossDragStart: (itemId: string) => void;
  onCrossDragEnd: () => void;
  isExternalDragActive: boolean;
  onReceiveExternalDrop: () => void;
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

function GripIcon() {
  return (
    <svg viewBox="0 0 8 12" className="w-2 h-3 fill-current">
      <circle cx="2" cy="2"  r="1.5" />
      <circle cx="6" cy="2"  r="1.5" />
      <circle cx="2" cy="6"  r="1.5" />
      <circle cx="6" cy="6"  r="1.5" />
      <circle cx="2" cy="10" r="1.5" />
      <circle cx="6" cy="10" r="1.5" />
    </svg>
  );
}

export function TodoContainer({
  container, color,
  onToggleItem, onToggleSubStep, onAddItem, onAddSubStep, onTagEvan,
  onReorderItems, onReorderSubSteps,
  onCrossDragStart, onCrossDragEnd, isExternalDragActive, onReceiveExternalDrop,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries((container.sections ?? []).map(s => [s.id, true]))
  );
  const [showDone, setShowDone] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [isExternalDropTarget, setIsExternalDropTarget] = useState(false);

  const activeItems = container.items.filter(i => !i.completed);
  const completedItems = container.items.filter(i => i.completed);

  const dividerIndex = Math.min(container.dividerIndex ?? 1, activeItems.length);
  const aboveItems = activeItems.slice(0, dividerIndex);
  const belowItems = activeItems.slice(dividerIndex);

  const sortableIds = [
    ...aboveItems.map(i => i.id),
    DIVIDER_ID,
    ...belowItems.map(i => i.id),
  ];

  function handleDragStart(id: string, e: React.DragEvent) {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    onCrossDragStart(id);
  }

  function handleDragOver(targetId: string, e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (targetId !== draggedId) setDropTargetId(targetId);
  }

  function handleDrop(targetId: string) {
    if (!draggedId || draggedId === targetId) { cleanup(); return; }

    const from = sortableIds.indexOf(draggedId);
    const to = sortableIds.indexOf(targetId);
    if (from === -1 || to === -1) { cleanup(); return; }

    const newIds = [...sortableIds];
    newIds.splice(from, 1);
    newIds.splice(from < to ? to - 1 : to, 0, draggedId);

    const newDividerIndex = newIds.indexOf(DIVIDER_ID);
    const newItemIds = newIds.filter(id => id !== DIVIDER_ID);
    const itemMap = Object.fromEntries(activeItems.map(i => [i.id, i]));
    const newActiveItems = newItemIds.map(id => itemMap[id]);

    onReorderItems([...newActiveItems, ...completedItems], newDividerIndex);
    cleanup();
  }

  function cleanup() {
    setDraggedId(null);
    setDropTargetId(null);
  }

  function toggleSection(sectionId: string) {
    setCollapsedSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
  }

  function renderItem(item: TodoItem, isBelow: boolean, hasBorderBottom: boolean) {
    const isDragging = draggedId === item.id;
    const isDropTarget = dropTargetId === item.id && !isDragging;

    return (
      <div
        key={item.id}
        draggable
        onDragStart={(e) => handleDragStart(item.id, e)}
        onDragOver={(e) => handleDragOver(item.id, e)}
        onDrop={(e) => { e.stopPropagation(); handleDrop(item.id); }}
        onDragEnd={() => { cleanup(); onCrossDragEnd(); }}
        className={`relative group/drag transition-opacity ${hasBorderBottom ? 'border-b border-stone-50' : ''} ${isDragging ? 'opacity-30' : 'opacity-100'}`}
        style={isDropTarget ? { borderTop: `2px solid ${color.accent}` } : undefined}
      >
        <div className="absolute right-0 inset-y-0 w-5 flex items-center justify-center opacity-0 group-hover/drag:opacity-25 cursor-grab active:cursor-grabbing text-stone-400 pointer-events-none">
          <GripIcon />
        </div>

        <TodoItemRow
          item={item}
          accentColor={color.accent}
          isBelow={isBelow}
          onToggle={() => onToggleItem(item.id)}
          onToggleSubStep={(subId) => onToggleSubStep(item.id, subId)}
          onTagEvan={() => onTagEvan(item.id)}
          onReorderSubSteps={(newSubSteps) => onReorderSubSteps(item.id, newSubSteps)}
        />
      </div>
    );
  }

  return (
    <div
      className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-150"
      style={{
        border: `1px solid ${color.accent}28`,
        borderTop: `3px solid ${color.accent}`,
        outline: isExternalDropTarget ? `2px solid ${color.accent}` : undefined,
        outlineOffset: '1px',
      }}
      onDragOver={(e) => {
        if (isExternalDragActive) {
          e.preventDefault();
          setIsExternalDropTarget(true);
        }
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setIsExternalDropTarget(false);
        }
      }}
      onDrop={(e) => {
        if (isExternalDragActive) {
          e.preventDefault();
          e.stopPropagation();
          onReceiveExternalDrop();
        }
        setIsExternalDropTarget(false);
      }}
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

            {activeItems.length > 0 && (
              <>
                {aboveItems.map((item, i) => renderItem(item, false, i < aboveItems.length - 1))}

                {/* Divider */}
                <div
                  onDragOver={(e) => handleDragOver(DIVIDER_ID, e)}
                  onDrop={(e) => { e.stopPropagation(); handleDrop(DIVIDER_ID); }}
                  className="flex items-center gap-2 py-1 select-none"
                  style={dropTargetId === DIVIDER_ID && draggedId !== DIVIDER_ID
                    ? { borderTop: `2px solid ${color.accent}` }
                    : undefined}
                >
                  <div className="flex-1 h-px" style={{ backgroundColor: `${color.accent}40` }} />
                  <div className="flex gap-[3px] items-center">
                    <div className="w-[2px] h-3 rounded-full" style={{ backgroundColor: `${color.accent}60` }} />
                    <div className="w-[2px] h-3 rounded-full" style={{ backgroundColor: `${color.accent}60` }} />
                    <div className="w-[2px] h-3 rounded-full" style={{ backgroundColor: `${color.accent}60` }} />
                  </div>
                  <div className="flex-1 h-px" style={{ backgroundColor: `${color.accent}40` }} />
                </div>

                {belowItems.map((item, i) => renderItem(item, true, i < belowItems.length - 1))}
              </>
            )}

            {completedItems.length > 0 && (
              <div className={activeItems.length > 0 ? 'border-t border-stone-100 mt-1 pt-1' : ''}>
                <button
                  onClick={() => setShowDone(d => !d)}
                  className="flex items-center gap-1.5 pt-2 pb-0.5 group/done"
                >
                  <span className="text-[10px] uppercase tracking-widest text-stone-300 group-hover/done:text-stone-400 transition-colors">
                    Done
                  </span>
                  <span className="text-[10px] text-stone-300 group-hover/done:text-stone-400 transition-colors">
                    ({completedItems.length})
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    className={`w-2.5 h-2.5 text-stone-300 group-hover/done:text-stone-400 transition-all duration-150 ${showDone ? '' : '-rotate-90'}`}
                    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  >
                    <polyline points="4,6 8,10 12,6" />
                  </svg>
                </button>
                {showDone && completedItems.map(item => (
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
                existingItems={activeItems}
                accentColor={color.accent}
                onAdd={(item) => { onAddItem(item); setShowAdd(false); }}
                onAddSubStep={(itemId, text) => { onAddSubStep(itemId, text); setShowAdd(false); }}
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
