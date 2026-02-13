
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AppSection, RoutineItem, FavoritePassage, NotificationSound, UserTier, SubscriptionInfo } from './types';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import SituationBoard from './components/SituationBoard';
import RoutineManager from './components/RoutineManager';
import ResourcesBoard from './components/ResourcesBoard';
import BibleSearch from './components/BibleSearch';
import FavoritesBoard from './components/FavoritesBoard';
import CommunityBoard from './components/CommunityBoard';
import PricingBoard from './components/PricingBoard';
import { generateDailyVerse } from './services/geminiService';
import { Menu, X, BookOpen, WifiOff, Lock, Crown } from 'lucide-react';

const INITIAL_ROUTINE: RoutineItem[] = [
  { id: '1', title: 'Oração Matinal', time: '07:00', type: 'oração', completed: false, reminderActive: true, sound: 'harp', recurrence: 'daily' },
  { id: '2', title: 'Leitura Bíblica', time: '08:30', type: 'leitura', completed: false, reminderActive: true, sound: 'nature', recurrence: 'daily' },
];

const TRIAL_DAYS = 3;

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.CHAT);
  const [routine, setRoutine] = useState<RoutineItem[]>(INITIAL_ROUTINE);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('biblia-viva-theme') as 'light' | 'dark' || 'light';
    }
    return 'light';
  });
  
  const [dailyVerse, setDailyVerse] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('biblia-viva-daily-verse');
      if (saved) return saved;
    }
    return "Salmos 23:1 - O Senhor é o meu pastor, nada me faltará.";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);
  const [favorites, setFavorites] = useState<FavoritePassage[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [subscription, setSubscription] = useState<SubscriptionInfo>({
    tier: 'trial',
    startDate: Date.now(),
    isExpired: false
  });

  const lastReminderRef = useRef<string | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('biblia-viva-theme', theme);
  }, [theme]);

  const checkSubscription = useCallback(() => {
    const savedSub = localStorage.getItem('biblia-viva-subscription');
    let subData: SubscriptionInfo;

    if (savedSub) {
      subData = JSON.parse(savedSub);
    } else {
      subData = {
        tier: 'trial',
        startDate: Date.now(),
        isExpired: false
      };
      localStorage.setItem('biblia-viva-subscription', JSON.stringify(subData));
    }

    if (subData.tier === 'trial') {
      const diffTime = Date.now() - subData.startDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays >= TRIAL_DAYS) {
        subData.isExpired = true;
        if (activeSection !== AppSection.PRICING) {
           setActiveSection(AppSection.PRICING);
        }
      }
    } else {
      subData.isExpired = false;
    }

    setSubscription(subData);
  }, [activeSection]);

  useEffect(() => {
    checkSubscription();
    const interval = setInterval(checkSubscription, 600000);
    return () => clearInterval(interval);
  }, [checkSubscription]);

  const handleUpgrade = (tier: UserTier) => {
    const newSub: SubscriptionInfo = {
      ...subscription,
      tier,
      isExpired: false
    };
    setSubscription(newSub);
    localStorage.setItem('biblia-viva-subscription', JSON.stringify(newSub));
    setActiveSection(AppSection.CHAT);
  };

  useEffect(() => {
    localStorage.setItem('biblia-viva-routine', JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const dayOfWeek = now.getDay();

      if (lastReminderRef.current === currentTime) return;

      routine.forEach(item => {
        if (!item.reminderActive || item.completed) return;
        
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        let shouldTrigger = false;
        if (item.recurrence === 'daily') shouldTrigger = true;
        else if (item.recurrence === 'weekdays' && isWeekday) shouldTrigger = true;
        else if (item.recurrence === 'weekends' && isWeekend) shouldTrigger = true;

        if (shouldTrigger && item.time === currentTime) {
          triggerReminder(item);
          lastReminderRef.current = currentTime;
        }
      });
    };

    const triggerReminder = (item: RoutineItem) => {
      if (Notification.permission === 'granted') {
        new Notification(`Hora de sua ${item.type}: ${item.title}`, {
          body: `Lembrete espiritual agendado para as ${item.time}.`,
        });
      }
      playNotificationSound(item.sound);
    };

    const playNotificationSound = (sound: NotificationSound) => {
      if (sound === 'none') return;
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      if (sound === 'harp') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(880, audioContext.currentTime + 1);
      } else if (sound === 'bell') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
      } else if (sound === 'nature') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
      }
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2);
    };

    const interval = setInterval(checkReminders, 30000);
    return () => clearInterval(interval);
  }, [routine]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const savedRoutine = localStorage.getItem('biblia-viva-routine');
    if (savedRoutine) {
      try { setRoutine(JSON.parse(savedRoutine)); } catch (e) { console.error(e); }
    }

    const savedFavs = localStorage.getItem('biblia-viva-favorites');
    if (savedFavs) {
      try { setFavorites(JSON.parse(savedFavs)); } catch (e) { console.error(e); }
    }

    if (navigator.onLine) {
      generateDailyVerse().then(verse => {
        if (verse) {
          setDailyVerse(verse);
          localStorage.setItem('biblia-viva-daily-verse', verse);
        }
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('biblia-viva-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleRoutine = (id: string) => {
    setRoutine(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSituationSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
    setActiveSection(AppSection.CHAT);
  };

  const toggleFavorite = (query: string, content: string) => {
    setFavorites(prev => {
      const exists = prev.find(f => f.query === query);
      if (exists) {
        return prev.filter(f => f.query !== query);
      }
      return [{ id: Date.now().toString(), query, content, timestamp: Date.now() }, ...prev];
    });
  };

  const isPaywallActive = subscription.tier === 'trial' && subscription.isExpired && activeSection !== AppSection.PRICING;

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      {isPaywallActive && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 dark:bg-black/80 backdrop-blur-2xl flex items-center justify-center p-6 text-center animate-in fade-in duration-700">
           <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] p-12 max-w-md shadow-2xl shadow-indigo-500/20 border border-white/50 dark:border-slate-800 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-indigo-600"></div>
             <div className="w-24 h-24 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <Lock size={48} strokeWidth={1.5} />
             </div>
             <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-4">A Jornada Continua...</h2>
             <p className="text-slate-500 dark:text-slate-400 mb-10 leading-relaxed text-lg">
               Seu período de teste de {TRIAL_DAYS} dias chegou ao fim. Para continuar recebendo aconselhamento espiritual e manter sua rotina, escolha o seu plano.
             </p>
             <button 
              onClick={() => setActiveSection(AppSection.PRICING)}
              className="w-full bg-indigo-600 text-white py-5 rounded-[1.5rem] font-bold text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 flex items-center justify-center gap-3 active:scale-95"
             >
               <Crown size={24} className="text-amber-300" />
               Destravar Todos os Recursos
             </button>
             <p className="mt-6 text-slate-400 dark:text-slate-500 text-xs font-medium uppercase tracking-widest">Acesso seguro e instantâneo</p>
           </div>
        </div>
      )}

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4 transition-colors">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-300">
          <Menu size={24} />
        </button>
        <span className="font-serif font-bold text-xl text-indigo-600 dark:text-indigo-400">Bíblia Viva</span>
        <div className="w-10"></div>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0 md:flex
      `}>
        <div className="h-full relative">
          <Sidebar 
            activeSection={activeSection} 
            setActiveSection={(s) => {
              setActiveSection(s);
              setIsSidebarOpen(false);
            }} 
            routine={routine}
            toggleRoutine={toggleRoutine}
            userTier={subscription.tier}
            trialStartDate={subscription.startDate}
            theme={theme}
            setTheme={setTheme}
          />
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 md:hidden p-2 text-white bg-black/20 rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <main className="flex-1 flex flex-col min-w-0 pt-16 md:pt-0 relative bg-slate-100 dark:bg-slate-950 transition-colors">
        {!isOnline && (
          <div className="bg-amber-500 text-white text-xs py-2 px-4 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
            <WifiOff size={14} />
            <span>Modo Offline. Alguns recursos de IA requerem internet.</span>
          </div>
        )}

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 py-3 px-6 hidden md:block transition-colors">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
            <BookOpen size={16} className="text-indigo-500 dark:text-indigo-400" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 italic text-center">
              {dailyVerse}
            </p>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden p-4 md:p-6 lg:p-8">
          <div className="h-full max-w-6xl mx-auto w-full">
            {activeSection === AppSection.CHAT && (
              <ChatInterface 
                initialMessage={selectedPrompt} 
                onClearInitial={() => setSelectedPrompt(undefined)} 
              />
            )}
            {activeSection === AppSection.BIBLE_SEARCH && (
              <BibleSearch favorites={favorites} onToggleFavorite={toggleFavorite} />
            )}
            {activeSection === AppSection.COMMUNITY && (
              <CommunityBoard />
            )}
            {activeSection === AppSection.SITUATIONS && (
              <SituationBoard onSelect={handleSituationSelect} />
            )}
            {activeSection === AppSection.ROUTINE && (
              <RoutineManager routine={routine} setRoutine={setRoutine} toggleRoutine={toggleRoutine} />
            )}
            {activeSection === AppSection.RESOURCES && (
              <ResourcesBoard />
            )}
            {activeSection === AppSection.FAVORITES && (
              <FavoritesBoard favorites={favorites} onRemove={(id) => setFavorites(f => f.filter(x => x.id !== id))} />
            )}
            {activeSection === AppSection.PRICING && (
              <PricingBoard onUpgrade={handleUpgrade} currentTier={subscription.tier} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
