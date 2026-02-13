
import React, { useState } from 'react';
import { Search, Book, Loader2, Info, Star, Share2, Check } from 'lucide-react';
import { searchBible } from '../services/geminiService';
import { FavoritePassage } from '../types';

interface BibleSearchProps {
  favorites: FavoritePassage[];
  onToggleFavorite: (query: string, content: string) => void;
}

const BibleSearch: React.FC<BibleSearchProps> = ({ favorites, onToggleFavorite }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [shared, setShared] = useState(false);

  const handleSearch = async (searchTerm: string = query) => {
    if (!searchTerm.trim() || isLoading) return;
    setIsLoading(true);
    setQuery(searchTerm);
    try {
      const content = await searchBible(searchTerm);
      setResult(content);
    } catch (error) {
      setResult("Erro ao realizar a busca.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!result) return;
    const textToShare = `${result}\n\nCompartilhado via Bíblia Viva ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Palavra de Vida - Bíblia Viva',
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

  const isFavorited = result && favorites.some(f => f.query === query);
  const quickLinks = ["João 3", "Salmo 23", "Romanos 8", "Êxodo 20", "Mateus 5"];

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto max-w-5xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif font-bold text-slate-800 dark:text-slate-100 mb-3">Explorar as Escrituras</h2>
        <p className="text-slate-600 dark:text-slate-400">Busque por livros, capítulos ou temas bíblicos para ler e meditar.</p>
      </div>

      {/* Search Input Area */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl shadow-indigo-100/50 dark:shadow-indigo-900/10 border border-indigo-50 dark:border-slate-800 mb-8 max-w-3xl mx-auto w-full transition-colors">
        <div className="flex gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          <div className="flex-1 flex items-center gap-3 px-4">
            <Search size={20} className="text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ex: João 3, Salmo 23 ou 'Fé'..."
              className="bg-transparent w-full py-3 text-slate-700 dark:text-slate-200 focus:outline-none font-medium"
            />
          </div>
          <button
            onClick={() => handleSearch()}
            disabled={!query.trim() || isLoading}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Buscar"}
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Atalhos:</span>
          {quickLinks.map(link => (
            <button
              key={link}
              onClick={() => handleSearch(link)}
              className="text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-3 py-1.5 rounded-full font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
            >
              <Book size={12} />
              {link}
            </button>
          ))}
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-indigo-500 dark:text-indigo-400">
            <Loader2 size={48} className="animate-spin opacity-20" />
            <p className="font-serif italic text-lg text-slate-400 dark:text-slate-500">Abrindo os rolos da sabedoria...</p>
          </div>
        ) : result ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 max-w-4xl mx-auto relative group transition-colors">
            <div className="absolute top-8 right-8 flex gap-2">
              <button 
                onClick={handleShare}
                className={`p-2 rounded-xl border transition-all bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900 flex items-center gap-2`}
                title="Compartilhar"
              >
                {shared ? <Check size={20} className="text-emerald-500" /> : <Share2 size={20} />}
                {shared && <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Copiado</span>}
              </button>
              <button 
                onClick={() => onToggleFavorite(query, result)}
                className={`p-2 rounded-xl border transition-all ${
                  isFavorited ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:text-amber-500'
                }`}
                title={isFavorited ? "Remover dos favoritos" : "Salvar para ler offline"}
              >
                <Star size={24} fill={isFavorited ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <div className="text-slate-700 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-wrap text-lg">
                {result}
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-slate-400 dark:text-slate-500 italic text-sm">
              <Info size={16} />
              <span>O texto bíblico e as reflexões são fornecidos para fins de estudo e meditação.</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-800">
              <Book size={32} className="text-slate-300 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-serif text-slate-400 dark:text-slate-600 mb-2 italic">Nenhuma busca realizada ainda</h3>
            <p className="text-slate-400 dark:text-slate-600 max-w-xs text-sm">Digite uma referência bíblica acima para começar sua leitura.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleSearch;
