
import React, { useState } from 'react';
import { Star, Trash2, Book, Clock, ChevronRight, Share2, Check } from 'lucide-react';
import { FavoritePassage } from '../types';

interface FavoritesBoardProps {
  favorites: FavoritePassage[];
  onRemove: (id: string) => void;
}

const FavoritesBoard: React.FC<FavoritesBoardProps> = ({ favorites, onRemove }) => {
  const [selectedId, setSelectedId] = useState<string | null>(favorites.length > 0 ? favorites[0].id : null);
  const [shared, setShared] = useState(false);
  
  const selectedPassage = favorites.find(f => f.id === selectedId);

  const handleShare = async () => {
    if (!selectedPassage) return;
    const textToShare = `*${selectedPassage.query}*\n\n${selectedPassage.content}\n\nCompartilhado via Bíblia Viva ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedPassage.query,
          text: textToShare,
        });
      } catch (err) {
        console.error("Erro ao compartilhar:", err);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
      {/* List */}
      <div className="w-full md:w-80 flex flex-col gap-4 overflow-y-auto pr-2">
        <div>
          <h2 className="text-2xl font-serif font-bold text-slate-800">Meus Favoritos</h2>
          <p className="text-xs text-slate-500">Salvos para leitura offline</p>
        </div>
        
        {favorites.length === 0 ? (
          <div className="py-12 px-4 text-center border-2 border-dashed border-slate-200 rounded-2xl">
            <Star size={32} className="mx-auto text-slate-200 mb-2" />
            <p className="text-slate-400 text-sm italic">Você ainda não salvou nenhuma passagem.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {favorites.map((fav) => (
              <div 
                key={fav.id}
                onClick={() => setSelectedId(fav.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all group relative ${
                  selectedId === fav.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 hover:border-indigo-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold truncate pr-6">{fav.query}</h4>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onRemove(fav.id); }}
                    className={`p-1.5 rounded-lg transition-colors ${
                      selectedId === fav.id ? 'text-indigo-200 hover:text-white' : 'text-slate-300 hover:text-rose-500'
                    }`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <p className={`text-[10px] flex items-center gap-1 opacity-70`}>
                  <Clock size={10} />
                  {new Date(fav.timestamp).toLocaleDateString()}
                </p>
                {selectedId !== fav.id && (
                  <ChevronRight size={16} className="absolute bottom-4 right-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content View */}
      <div className="flex-1 overflow-y-auto bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 relative">
        {selectedPassage ? (
          <div className="animate-in fade-in duration-500">
            <div className="absolute top-8 right-12 flex items-center gap-2">
               <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-slate-100 font-bold text-xs uppercase tracking-wider"
              >
                {shared ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
                {shared ? "Copiado!" : "Compartilhar"}
              </button>
            </div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Book size={20} />
              </div>
              <h3 className="text-3xl font-serif font-bold text-slate-800">{selectedPassage.query}</h3>
            </div>
            <div className="prose prose-indigo max-w-none">
              <p className="text-slate-700 leading-relaxed font-serif whitespace-pre-wrap text-lg italic">
                {selectedPassage.content}
              </p>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
            <Book size={64} className="mb-4" />
            <p className="font-serif italic text-xl">Selecione uma passagem para ler</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesBoard;
