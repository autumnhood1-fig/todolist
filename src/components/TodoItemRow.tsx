import type { TodoItem } from '../types';

interface Props {
  item: TodoItem;
  onToggle: () => void;
  onToggleSubStep: (subStepId: string) => void;
}

export function TodoItemRow({ item, onToggle, onToggleSubStep }: Props) {
  return (
    <div className="py-2.5">
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-0.5 shrink-0 w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-colors ${
            item.completed
              ? 'border-stone-400 bg-stone-400'
              : 'border-stone-300 hover:border-stone-500'
          }`}
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
          className={`text-sm font-medium leading-snug ${
            item.completed ? 'line-through text-stone-400' : 'text-stone-800'
          }`}
        >
          {item.text}
        </span>
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
                    className={`shrink-0 w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center transition-colors ${
                      sub.completed
                        ? 'border-stone-400 bg-stone-400'
                        : 'border-stone-300 hover:border-stone-400'
                    }`}
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
                  <span
                    className={`text-xs leading-snug ${
                      sub.completed ? 'line-through text-stone-400' : 'text-stone-600'
                    }`}
                  >
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
