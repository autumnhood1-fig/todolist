import type { TodoItem } from '../types';

interface Props {
  item: TodoItem;
  accentColor: string;
  isBelow?: boolean;
  onToggle: () => void;
  onToggleSubStep: (subStepId: string) => void;
  onTagEvan?: () => void;
}

export function TodoItemRow({ item, accentColor, isBelow, onToggle, onToggleSubStep, onTagEvan }: Props) {
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
              <polyline
                points="1,5 4.5,8.5 11,1"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <span
          className={`flex-1 text-sm leading-snug ${
            item.completed
              ? 'line-through text-stone-400 font-medium'
              : isBelow
                ? 'font-normal text-stone-400'
                : 'font-medium text-stone-800'
          }`}
        >
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
          {item.subSteps.length > 0 && (
            <ul className="space-y-1.5">
              {item.subSteps.map(sub => (
                <li key={sub.id} className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleSubStep(sub.id)}
                    className="shrink-0 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors"
                    style={
                      sub.completed
                        ? { backgroundColor: accentColor, borderColor: accentColor }
                        : { borderColor: '#d6d3d1' }
                    }
                    aria-label={sub.completed ? 'Mark incomplete' : 'Mark complete'}
                  >
                    {sub.completed && (
                      <svg viewBox="0 0 10 8" className="w-2 h-2">
                        <polyline
                          points="1,4 3.5,6.5 9,1"
                          fill="none"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                  <span className={`text-xs leading-snug ${sub.completed ? 'line-through text-stone-400' : 'text-stone-600'}`}>
                    {sub.text}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
