
import React, { useState } from 'react';
import { RoutineItem, RecurrenceType, NotificationSound } from '../types';
import { Plus, Trash2, Calendar, CheckCircle2, Clock, BookOpen, Heart, Bell, BellOff, Volume2, Repeat } from 'lucide-react';

interface RoutineManagerProps {
  routine: RoutineItem[];
  setRoutine: React.Dispatch<React.SetStateAction<RoutineItem[]>>;
  toggleRoutine: (id: string) => void;
}

const SOUNDS: { id: NotificationSound; label: string; icon: string }[] = [
  { id: 'harp', label: 'Harpa Celeste', icon: '🎵' },
  { id: 'bell', label: 'Sino Suave', icon: '🔔' },
  { id: 'nature', label: 'Natureza', icon: '🌿' },
  { id: 'none', label: 'Mudo', icon: '🔇' },
];

const RECURRENCES: { id: RecurrenceType; label: string }[] = [
  { id: 'daily', label: 'Diário' },
  { id: 'weekdays', label: 'Seg a Sex' },
  { id: 'weekends', label: 'Finais de Semana' },
];

const RoutineManager: React.FC<RoutineManagerProps> = ({ routine, setRoutine, toggleRoutine }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('08:00');
  const [newType, setNewType] = useState<'leitura' | 'oração'>('leitura');
  const [reminderActive, setReminderActive] = useState(true);
  const [sound, setSound] = useState<NotificationSound>('harp');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('daily');

  const addItem = () => {
    if (!newTitle.trim()) return;
    const newItem: RoutineItem = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      time: newTime,
      type: newType,
      completed: false,
      reminderActive,
      sound,
      recurrence
    };
    setRoutine(prev => [...prev, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewTitle('');
    
    if (reminderActive && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const deleteItem = (id: string) => {
    setRoutine(prev => prev.filter(item => item.id !== id));
  };

  const toggleReminderItem = (id: string) => {
    setRoutine(prev => prev.map(item => 
      item.id === id ? { ...item, reminderActive: !item.reminderActive } : item
    ));
  };

  const progress = Math.round((routine.filter(r => r.completed).length / (routine.length || 1)) * 100);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto max-w-5xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100">Rotina & Lembretes</h2>
          <p className="text-slate-600 dark:text-slate-400">Sua disciplina espiritual é o solo onde a fé cresce.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 px-6 py-4 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4 transition-colors">
          <div className="text-right">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest">Progresso de Hoje</p>
            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{progress}%</p>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-50 dark:border-slate-800 border-t-indigo-500 flex items-center justify-center transition-transform hover:rotate-12">
            <Calendar className="text-indigo-500 dark:text-indigo-400" size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-xl shadow-indigo-100/30 dark:shadow-indigo-900/10 border border-slate-100 dark:border-slate-800 mb-10 transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
            <Plus size={18} />
          </div>
          Configurar Novo Hábito
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">O que vamos fazer?</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Meditação nos Salmos"
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all font-medium text-slate-700 dark:text-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Horário</label>
                <div className="relative">
                   <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={16} />
                   <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 dark:text-slate-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Categoria</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none font-medium text-slate-700 dark:text-slate-200"
                >
                  <option value="leitura">📖 Leitura</option>
                  <option value="oração">🙏 Oração</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
            <div className="space-y-3">
               <div className="flex items-center justify-between">
                 <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                   <Bell size={12} /> Lembrete
                 </label>
                 <button 
                  onClick={() => setReminderActive(!reminderActive)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${reminderActive ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                 >
                   <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${reminderActive ? 'translate-x-5' : ''}`} />
                 </button>
               </div>
               <p className="text-[10px] text-slate-400 dark:text-slate-500">Ative para receber uma notificação no horário.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                <Volume2 size={12} /> Som do Alerta
              </label>
              <div className="flex gap-2">
                {SOUNDS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSound(s.id)}
                    title={s.label}
                    className={`flex-1 py-2 rounded-xl text-lg border transition-all ${
                      sound === s.id ? 'bg-indigo-50 dark:bg-indigo-900/40 border-indigo-200 dark:border-indigo-800 shadow-inner' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    {s.icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                <Repeat size={12} /> Recorrência
              </label>
              <div className="flex flex-wrap gap-2">
                {RECURRENCES.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setRecurrence(r.id)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all uppercase tracking-wider ${
                      recurrence === r.id ? 'bg-slate-800 dark:bg-slate-700 border-slate-800 dark:border-slate-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={addItem}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center justify-center gap-2 group"
          >
            Confirmar Hábito Espiritual
            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {routine.length === 0 ? (
          <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors">
            <div className="bg-white dark:bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-700 border border-slate-100 dark:border-slate-800 shadow-sm">
               <Calendar size={32} />
            </div>
            <p className="text-slate-400 dark:text-slate-600 italic">Sua agenda de fé está pronta para ser preenchida.</p>
          </div>
        ) : (
          routine.map(item => (
            <div
              key={item.id}
              className={`group flex items-center gap-4 p-5 rounded-3xl border transition-all relative overflow-hidden ${
                item.completed ? 'bg-emerald-50/20 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900 opacity-75' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-md'
              }`}
            >
              <button
                onClick={() => toggleRoutine(item.id)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  item.completed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900 scale-90' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-500 dark:hover:text-indigo-400'
                }`}
              >
                <CheckCircle2 size={24} />
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`font-bold text-lg ${item.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                    {item.title}
                  </h4>
                  {item.type === 'leitura' ? <BookOpen size={16} className="text-indigo-400 dark:text-indigo-500" /> : <Heart size={16} className="text-rose-400 dark:text-rose-500" />}
                </div>
                <div className="flex items-center gap-4 mt-1.5">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                    <Clock size={12} />
                    {item.time}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Repeat size={10} />
                    {RECURRENCES.find(r => r.id === item.recurrence)?.label}
                  </span>
                  {item.reminderActive && item.sound !== 'none' && (
                     <span className="text-[10px] text-amber-500 dark:text-amber-600 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Volume2 size={10} />
                        {SOUNDS.find(s => s.id === item.sound)?.icon}
                     </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                 <button
                  onClick={() => toggleReminderItem(item.id)}
                  className={`p-2 rounded-xl transition-colors ${
                    item.reminderActive ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-300 dark:text-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                  title={item.reminderActive ? "Lembrete ativo" : "Lembrete silenciado"}
                >
                  {item.reminderActive ? <Bell size={20} /> : <BellOff size={20} />}
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-2 text-slate-200 dark:text-slate-800 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoutineManager;
