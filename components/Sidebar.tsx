
import React, { useMemo } from 'react';
import { AppSection, RoutineItem, UserTier } from '../types';
import { Book, MessageCircle, Heart, CheckCircle2, Circle, Clock, Music, Search, Star, Users, Crown, Sparkles, AlertCircle, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  routine: RoutineItem[];
  toggleRoutine: (id: string) => void;
  userTier: UserTier;
  trialStartDate: number;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSection, 
  setActiveSection, 
  routine, 
  toggleRoutine, 
  userTier, 
  trialStartDate,
  theme,
  setTheme
}) => {
  const trialStatus = useMemo(() => {
    if (userTier !== 'trial') return null;
    const diff = (trialStartDate + (3 * 24 * 60 * 60 * 1000)) - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, isUrgent: days < 1 };
  }, [trialStartDate, userTier]);

  return (
    <aside className="w-full md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-sm transition-colors">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-900 text-white relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-serif font-bold tracking-tight flex items-center gap-2">
              Bíblia Viva
              {userTier !== 'trial' && <Crown size={18} className="text-amber-300" />}
            </h1>
            <button 
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              title="Alternar Tema"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-1">
             <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
               userTier === 'trial' ? 'bg-white/20 text-indigo-100' : 'bg-amber-400 text-amber-900'
             }`}>
               {userTier === 'trial' ? 'Período de Teste' : userTier.toUpperCase()}
             </span>
          </div>
        </div>
        <Sparkles className="absolute -right-4 -bottom-4 text-white/10" size={100} />
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          onClick={() => setActiveSection(AppSection.CHAT)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.CHAT 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <MessageCircle size={20} />
          <span>Conversar</span>
        </button>

        <button
          onClick={() => setActiveSection(AppSection.BIBLE_SEARCH)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.BIBLE_SEARCH 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Search size={20} />
          <span>Explorar Bíblia</span>
        </button>

        <button
          onClick={() => setActiveSection(AppSection.COMMUNITY)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.COMMUNITY 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Users size={20} />
          <span>Mural de Fé</span>
        </button>

        <button
          onClick={() => setActiveSection(AppSection.FAVORITES)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.FAVORITES 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Star size={20} />
          <span>Favoritos Offline</span>
        </button>

        <div className="pt-4 pb-2 border-t border-slate-50 dark:border-slate-800 my-2">
          <p className="px-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Apoio & Crescimento</p>
        </div>

        <button
          onClick={() => setActiveSection(AppSection.SITUATIONS)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.SITUATIONS 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Heart size={20} />
          <span>Para sua Situação</span>
        </button>

        <button
          onClick={() => setActiveSection(AppSection.RESOURCES)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.RESOURCES 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Music size={20} />
          <span>Recursos & Louvor</span>
        </button>

        <button
          onClick={() => setActiveSection(AppSection.ROUTINE)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeSection === AppSection.ROUTINE 
              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-medium' 
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Clock size={20} />
          <span>Minha Rotina</span>
        </button>

        {userTier === 'trial' && trialStatus && (
          <div className={`mt-4 p-4 rounded-2xl border transition-all ${
            trialStatus.isUrgent ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-900 animate-pulse' : 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900'
          }`}>
             <div className="flex items-center gap-2 mb-2">
               <AlertCircle size={14} className={trialStatus.isUrgent ? 'text-rose-500' : 'text-amber-600 dark:text-amber-500'} />
               <p className={`text-xs font-bold uppercase tracking-tight ${trialStatus.isUrgent ? 'text-rose-600 dark:text-rose-400' : 'text-amber-800 dark:text-amber-400'}`}>
                 {trialStatus.days > 0 ? `${trialStatus.days} dias restantes` : `${trialStatus.hours}h restantes`}
               </p>
             </div>
             <button 
              onClick={() => setActiveSection(AppSection.PRICING)}
              className={`w-full text-white text-[10px] font-black py-2 rounded-xl transition-colors shadow-sm ${
                trialStatus.isUrgent ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-rose-900' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200 dark:shadow-amber-900'
              }`}
             >
               FAZER UPGRADE AGORA
             </button>
          </div>
        )}

        <div className="pt-6 pb-2">
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Metas de Hoje</p>
        </div>

        <div className="space-y-1">
          {routine.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleRoutine(item.id)}
              className="group flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              {item.completed ? (
                <CheckCircle2 size={18} className="text-emerald-500 dark:text-emerald-400" />
              ) : (
                <Circle size={18} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-400" />
              )}
              <div className="flex flex-col">
                <span className={`text-sm ${item.completed ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                  {item.title}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 italic">
          <Book size={14} />
          <span>"Lâmpada para os meus pés..."</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
