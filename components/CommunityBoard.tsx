
import React, { useState, useEffect } from 'react';
import { Experience, ExperienceCategory } from '../types';
import { 
  MessageSquare, 
  Heart, 
  Quote, 
  User, 
  Send, 
  Star, 
  Sparkles, 
  Plus, 
  Book, 
  Sun, 
  HeartPulse, 
  HandHeart, 
  Mountain, 
  Sprout, 
  Bird, 
  Home,
  Loader2
} from 'lucide-react';

const CATEGORY_CONFIG: Record<ExperienceCategory, { label: string; icon: React.ReactNode; color: string; bg: string; darkBg: string }> = {
  'fé': { label: 'Fé', icon: <Sun size={14} />, color: 'text-amber-600', bg: 'bg-amber-50', darkBg: 'dark:bg-amber-900/20' },
  'cura': { label: 'Cura', icon: <HeartPulse size={14} />, color: 'text-rose-600', bg: 'bg-rose-50', darkBg: 'dark:bg-rose-900/20' },
  'gratidão': { label: 'Gratidão', icon: <HandHeart size={14} />, color: 'text-pink-600', bg: 'bg-pink-50', darkBg: 'dark:bg-pink-900/20' },
  'superação': { label: 'Superação', icon: <Mountain size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50', darkBg: 'dark:bg-emerald-900/20' },
  'provisão': { label: 'Provisão', icon: <Sprout size={14} />, color: 'text-orange-600', bg: 'bg-orange-50', darkBg: 'dark:bg-orange-900/20' },
  'paz': { label: 'Paz', icon: <Bird size={14} />, color: 'text-sky-600', bg: 'bg-sky-50', darkBg: 'dark:bg-sky-900/20' },
  'família': { label: 'Família', icon: <Home size={14} />, color: 'text-indigo-600', bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-900/20' },
};

const LOCAL_STORAGE_KEY = 'biblia-viva-community-local';

const CommunityBoard: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [newText, setNewText] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newCat, setNewCat] = useState<ExperienceCategory>('fé');

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = () => {
    setLoading(true);
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setExperiences(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar testemunhos locais", e);
      }
    }
    setLoading(false);
  };

  const saveExperience = () => {
    if (!newText.trim() || !newAuthor.trim()) return;
    setSubmitting(true);

    const newItem: Experience = {
      id: Date.now().toString(),
      author: newAuthor,
      text: newText,
      reference: newRef,
      likes: 0,
      category: newCat,
      timestamp: Date.now()
    };

    const updated = [newItem, ...experiences];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    setExperiences(updated);

    setNewText('');
    setNewAuthor('');
    setNewRef('');
    setShowForm(false);
    setSubmitting(false);
  };

  const handleLike = (id: string) => {
    const updated = experiences.map(e => e.id === id ? { ...e, likes: (e.likes || 0) + 1 } : e);
    setExperiences(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="h-full flex flex-col p-4 md:p-8 max-w-5xl mx-auto w-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-serif font-bold text-slate-800 dark:text-slate-100">Mural de Fé</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Partilhe como a Palavra transformou sua vida (armazenamento local privado).</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group"
        >
          {showForm ? 'Fechar Mural' : 'Contar meu Testemunho'}
          <MessageSquare size={20} className={showForm ? 'rotate-180 transition-transform' : ''} />
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-indigo-100 dark:border-slate-800 shadow-xl mb-12 animate-in fade-in slide-in-from-top-4 duration-500 transition-colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Seu Nome / Apelido</label>
              <input
                type="text"
                value={newAuthor}
                onChange={(e) => setNewAuthor(e.target.value)}
                placeholder="Como quer ser identificado?"
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 dark:text-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Referência Bíblica (Opcional)</label>
              <input
                type="text"
                value={newRef}
                onChange={(e) => setNewRef(e.target.value)}
                placeholder="Ex: Filipenses 4:13"
                className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 dark:text-slate-200"
              />
            </div>
          </div>
          
          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Tema da Experiência</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {(Object.keys(CATEGORY_CONFIG) as ExperienceCategory[]).map(catKey => {
                const config = CATEGORY_CONFIG[catKey];
                return (
                  <button
                    key={catKey}
                    onClick={() => setNewCat(catKey)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                      newCat === catKey 
                        ? `${config.bg} ${config.darkBg} ${config.color} ring-2 ring-current ring-offset-2 dark:ring-offset-slate-900 shadow-sm` 
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {config.icon}
                    {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Sua História</label>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Descreva como o ensinamento bíblico se manifestou na sua vida..."
              rows={4}
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium text-slate-700 dark:text-slate-200 leading-relaxed"
            />
          </div>

          <button
            onClick={saveExperience}
            disabled={!newText.trim() || !newAuthor.trim() || submitting}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <>Publicar no Mural <Send size={18} /></>}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 size={48} className="text-indigo-400 animate-spin" />
          <p className="text-slate-400 dark:text-slate-600 font-serif italic">Carregando seus testemunhos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {experiences.map((exp) => {
            const config = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG['fé'];
            return (
              <div 
                key={exp.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all relative group flex flex-col transition-colors"
              >
                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`${config.bg} ${config.darkBg} ${config.color} p-2 rounded-xl shadow-sm`}>
                    <Quote size={20} />
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${config.bg} ${config.darkBg} flex items-center justify-center ${config.color} shadow-sm`}>
                    <div className="scale-125">{config.icon}</div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{exp.author}</h4>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-widest flex items-center gap-1">
                      {config.icon}
                      {config.label} • {new Date(exp.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-serif text-lg flex-1 mb-6 italic">
                  "{exp.text}"
                </p>

                {exp.reference && (
                  <div className={`${config.bg} ${config.darkBg} p-4 rounded-2xl border border-transparent mb-6 transition-colors group-hover:border-current/10`}>
                    <p className={`text-xs font-bold ${config.color} flex items-center gap-2 italic`}>
                      <Book size={14} />
                      Baseado em: {exp.reference}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800">
                  <button 
                    onClick={() => handleLike(exp.id)}
                    className="flex items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors group/like"
                  >
                    <div className="p-2 rounded-lg group-hover/like:bg-rose-50 dark:group-hover/like:bg-rose-900/30 transition-colors">
                      <Heart size={18} className={(exp.likes || 0) > 0 ? 'fill-rose-500 text-rose-500' : ''} />
                    </div>
                    <span className="text-sm font-bold">{(exp.likes || 0)} Amém</span>
                  </button>
                  
                  <div className="text-slate-300 dark:text-slate-700">
                    <Sparkles size={16} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && experiences.length === 0 && !showForm && (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
          <MessageSquare size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-400 dark:text-slate-600 font-medium">Seu mural privado está pronto para sua primeira história.</p>
        </div>
      )}
    </div>
  );
};

export default CommunityBoard;
