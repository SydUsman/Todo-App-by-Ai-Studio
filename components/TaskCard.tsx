
import React from 'react';
import { TodoTask } from '../types';
import { CheckCircle2, Circle, Trash2, Sparkles } from 'lucide-react';

interface TaskCardProps {
  task: TodoTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAIHelp?: (task: TodoTask) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onToggle, onDelete, onAIHelp }) => {
  return (
    <div className={`
      group relative overflow-hidden rounded-2xl p-4 transition-all duration-300
      ${task.completed 
        ? 'bg-gray-100 dark:bg-gray-800/50 opacity-75' 
        : 'bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700'}
    `}>
      <div className="flex items-start gap-4">
        <button 
          onClick={() => onToggle(task.id)}
          className="mt-1 flex-shrink-0 focus:outline-none"
        >
          {task.completed ? (
            <CheckCircle2 className="w-6 h-6 text-indigo-500 fill-indigo-50" />
          ) : (
            <Circle className="w-6 h-6 text-gray-300 dark:text-gray-600 hover:text-indigo-400" />
          )}
        </button>

        <div className="flex-grow min-w-0">
          <h3 className={`text-lg font-semibold truncate transition-all duration-300 ${
            task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 transition-all ${
              task.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
            }`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-3">
             <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
               {task.category}
             </span>
             {!task.completed && onAIHelp && (
               <button 
                onClick={() => onAIHelp(task)}
                className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700 dark:text-amber-400 transition-colors"
               >
                 <Sparkles size={12} />
                 AI Breakdown
               </button>
             )}
          </div>
        </div>

        <button 
          onClick={() => onDelete(task.id)}
          className="mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 rounded-xl"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};
