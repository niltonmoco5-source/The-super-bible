
import React from 'react';
import { SITUATIONS } from '../constants';
import { Situation } from '../types';

interface SituationBoardProps {
  onSelect: (prompt: string) => void;
}

const SituationBoard: React.FC<SituationBoardProps> = ({ onSelect }) => {
  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      <div className="mb-8 text-center max-w-xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-3">Encontre Direção</h2>
        <p className="text-slate-600">Escolha como você está se sentindo agora e receba um direcionamento bíblico personalizado.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        {SITUATIONS.map((s: Situation) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.prompt)}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all flex flex-col items-center text-center gap-4"
          >
            <span className="text-5xl transition-transform group-hover:scale-110 duration-300">{s.icon}</span>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">{s.label}</h3>
              <p className="text-xs text-slate-500 mt-1 italic">"{s.prompt}"</p>
            </div>
            <span className="mt-2 text-xs font-medium text-indigo-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
              Buscar conforto →
            </span>
          </button>
        ))}
      </div>

      <div className="mt-12 bg-indigo-50 rounded-2xl p-8 max-w-4xl mx-auto border border-indigo-100">
        <h3 className="text-indigo-800 font-bold text-lg mb-2">Dica de Sabedoria</h3>
        <p className="text-indigo-700/80 leading-relaxed italic">
          "Pois eu bem sei os planos que tenho para vocês, diz o Senhor, planos de prosperidade e não de mal, para dar a vocês um futuro e uma esperança." — Jeremias 29:11
        </p>
      </div>
    </div>
  );
};

export default SituationBoard;
