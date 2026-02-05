
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Moon, Sun, LayoutGrid, CheckCircle, Search, Sparkles } from 'lucide-react';
import { TodoTask, ThemeMode, TaskCategory } from './types';
import { TaskCard } from './components/TaskCard';
import { AddTaskModal } from './components/AddTaskModal';
import { getAISubtasks, suggestTasks } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TodoTask[]>([]);
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem('zentask-list');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    const savedTheme = localStorage.getItem('zentask-theme') as ThemeMode;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Persist Changes
  useEffect(() => {
    localStorage.setItem('zentask-list', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('zentask-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const addTask = (title: string, description: string, category: TaskCategory) => {
    const newTask: TodoTask = {
      id: crypto.randomUUID(),
      title,
      description,
      completed: false,
      createdAt: Date.now(),
      category
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleAIHelp = async (task: TodoTask) => {
    setIsAiLoading(true);
    const subtasks = await getAISubtasks(task.title);
    if (subtasks && subtasks.length > 0) {
      // Add subtasks as new tasks under the same category
      const newTasks = subtasks.map((st: string) => ({
        id: crypto.randomUUID(),
        title: st,
        description: `Subtask of: ${task.title}`,
        completed: false,
        createdAt: Date.now(),
        category: task.category
      }));
      setTasks(prev => [...newTasks, ...prev]);
    }
    setIsAiLoading(false);
  };

  const handleAISuggestions = async () => {
    setIsAiLoading(true);
    const suggestions = await suggestTasks();
    if (suggestions && suggestions.length > 0) {
      const newTasks = suggestions.map((s: any) => ({
        id: crypto.randomUUID(),
        title: s.title,
        description: s.description,
        completed: false,
        createdAt: Date.now(),
        category: TaskCategory.WORK
      }));
      setTasks(prev => [...newTasks, ...prev]);
    }
    setIsAiLoading(false);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-500 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 safe-top">
        <div className="max-w-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight dark:text-white flex items-center gap-2">
              <span className="bg-indigo-600 text-white p-1 rounded-lg"><LayoutGrid size={20} /></span>
              ZenTask
            </h1>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-widest">
              {completedCount}/{tasks.length} Completed
            </p>
          </div>
          <button 
            onClick={toggleTheme}
            className="p-3 bg-gray-100 dark:bg-gray-800 rounded-2xl transition-all hover:scale-110 active:scale-95"
          >
            {theme === 'light' ? <Moon size={22} className="text-gray-700" /> : <Sun size={22} className="text-amber-400" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-xl w-full mx-auto px-6 py-8">
        
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 rounded-2xl py-4 pl-12 pr-4 shadow-sm border border-gray-100 dark:border-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white transition-all"
          />
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-4">
                <CheckCircle size={48} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">All caught up!</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Enjoy your free time or add a new task.</p>
              
              <button 
                onClick={handleAISuggestions}
                disabled={isAiLoading}
                className="mt-6 flex items-center gap-2 mx-auto text-indigo-600 font-semibold hover:bg-indigo-50 p-2 rounded-xl transition-colors disabled:opacity-50"
              >
                <Sparkles size={18} />
                {isAiLoading ? 'Gemini is thinking...' : 'Suggest some productive tasks'}
              </button>
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onToggle={toggleTask} 
                onDelete={deleteTask}
                onAIHelp={handleAIHelp}
              />
            ))
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-6 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-400 flex items-center justify-center hover:bg-indigo-700 transition-all hover:scale-110 active:scale-90 z-50 animate-bounce-subtle"
      >
        <Plus size={32} />
      </button>

      {/* Add Task Modal */}
      <AddTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={addTask} 
      />

      {/* Footer Info for APK Suggestion (Hidden visually but available in code) */}
      <footer className="p-6 text-center text-[10px] text-gray-400 uppercase tracking-widest pb-12">
        ZenTask v1.0 • PWA Optimized
      </footer>

      {isAiLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
           <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-2xl flex items-center gap-4 border border-indigo-100 dark:border-indigo-900">
             <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
             <p className="font-bold dark:text-white">Gemini is brainstorming...</p>
           </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-slide-up { animation: slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
        .animate-bounce-subtle { animation: bounce-subtle 3s infinite ease-in-out; }
      `}</style>
    </div>
  );
};

export default App;
