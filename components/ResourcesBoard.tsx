
import React, { useState, useEffect } from 'react';
import { Play, Music, Headphones, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import { getMediaRecommendations } from '../services/geminiService';

const STATIC_RESOURCES = [
  { id: '1', title: 'Como Estudar a Bíblia', type: 'video', category: 'Estudo', url: 'https://youtube.com', author: 'Escola Bíblica' },
  { id: '2', title: 'Hinos de Adoração 2024', type: 'music', category: 'Louvor', url: 'https://spotify.com', author: 'Vários Artistas' },
  { id: '3', title: 'O Significado da Fé', type: 'podcast', category: 'Reflexão', url: 'https://podcasts.google.com', author: 'Minuto com Deus' },
  { id: '4', title: 'A Jornada de Paulo', type: 'video', category: 'História', url: 'https://youtube.com', author: 'Documentário' },
];

const ResourcesBoard: React.FC = () => {
  const [aiRec, setAiRec] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMediaRecommendations('Crescimento espiritual e paz interior')
      .then(res => setAiRec(res))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-bold text-slate-800">Recursos & Edificação</h2>
        <p className="text-slate-600">Alimente sua alma com conteúdos selecionados.</p>
      </div>

      {/* AI Recommendation Highlight */}
      <div className="mb-10 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 transform transition-transform group-hover:scale-125">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sparkles size={20} className="text-yellow-300" />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-100">Destaque da Inteligência Artificial</span>
          </div>
          
          <h3 className="text-2xl font-bold mb-4">Recomendação do Momento</h3>
          
          {loading ? (
            <div className="flex items-center gap-3 text-indigo-100 animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span>Consultando curadoria espiritual...</span>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <p className="text-indigo-50 leading-relaxed whitespace-pre-wrap italic">
                {aiRec}
              </p>
              <button 
                onClick={() => window.open('https://www.youtube.com/results?search_query=estudo+bíblico+louvor', '_blank')}
                className="mt-6 flex items-center gap-2 bg-white text-indigo-700 px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Explorar Agora
                <ExternalLink size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATIC_RESOURCES.map(res => (
          <div key={res.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                res.type === 'video' ? 'bg-red-50 text-red-600' :
                res.type === 'music' ? 'bg-blue-50 text-blue-600' :
                'bg-emerald-50 text-emerald-600'
              }`}>
                {res.type === 'video' ? <Play fill="currentColor" size={20} /> :
                 res.type === 'music' ? <Music size={20} /> :
                 <Headphones size={20} />}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1 block">{res.category}</span>
              <h4 className="font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">{res.title}</h4>
              <p className="text-xs text-slate-500">{res.author}</p>
            </div>
            
            <button 
              onClick={() => window.open(res.url, '_blank')}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2 bg-slate-50 rounded-xl text-slate-600 font-medium text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
            >
              Acessar
              <ExternalLink size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl">
        <p className="text-slate-400 text-sm">Mais conteúdos estão sendo preparados para sua jornada de fé.</p>
      </div>
    </div>
  );
};

export default ResourcesBoard;
