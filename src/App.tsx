import React, { useState } from 'react';
import { CommercialPitch } from './components/CommercialPitch';

export default function App() {
  const [showPitch, setShowPitch] = useState(false);
  const [rodada, setRodada] = useState(1);

  if (showPitch) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <button 
          onClick={() => setShowPitch(false)}
          className="absolute top-4 right-4 z-50 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 shadow-lg"
        >
          ← Voltar ao Jogo
        </button>
        <CommercialPitch />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Header Original */}
      <header className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xl">⚽</span>
          <div>
            <h1 className="font-bold text-base leading-tight">Top Club Director</h1>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">6.0.0-PRO</span>
          </div>
        </div>
        <button 
          onClick={() => setShowPitch(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
        >
          <span>💼</span> Vender App
        </button>
      </header>

      {/* Conteúdo Principal Limpo e Organizado */}
      <main className="p-4 space-y-4 max-w-md mx-auto w-full">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Clube Atual</span>
            <h2 className="text-lg font-extrabold text-white">Flamengo</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Orçamento</span>
            <span className="text-emerald-400 font-bold text-base">R$ 50.0M</span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-center shadow">Tabela</button>
          <button className="flex-1 text-slate-400 hover:text-white py-2 rounded-lg text-center">Elenco</button>
          <button className="flex-1 text-slate-400 hover:text-white py-2 rounded-lg text-center">Tática</button>
          <button className="flex-1 text-slate-400 hover:text-white py-2 rounded-lg text-center">Mercado</button>
          <button className="flex-1 text-slate-400 hover:text-white py-2 rounded-lg text-center">News</button>
        </div>

        {/* Botão de Simulação */}
        <button 
          onClick={() => setRodada(r => r + 1)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide"
        >
          Jogar Rodada {rodada}
        </button>

        {/* Tabela da Liga Organizada */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-sm text-slate-300 mb-3">Tabela da Liga</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-emerald-400 font-bold px-2 bg-emerald-500/10 rounded-xl">
              <span>1. Flamengo</span>
              <div className="space-x-4">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-slate-300 px-2">
              <span>2. Palmeiras</span>
              <div className="space-x-4 text-slate-400">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-800/60 text-slate-300 px-2">
              <span>3. São Paulo</span>
              <div className="space-x-4 text-slate-400">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 text-slate-300 px-2">
              <span>4. Corinthians</span>
              <div className="space-x-4 text-slate-400">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
