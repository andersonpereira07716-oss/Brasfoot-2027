import React, { useState } from 'react';
import { CommercialPitch } from './components/CommercialPitch';

export default function App() {
  const [showPitch, setShowPitch] = useState(false);
  const [rodada, setRodada] = useState(1);
  const [activeTab, setActiveTab] = useState('tabela');

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
      {/* Header Original Perfeito */}
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

      {/* Conteúdo Principal Organizado */}
      <main className="p-4 space-y-4 max-w-md mx-auto w-full">
        {/* Card do Clube Atual */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-xs text-slate-400 uppercase tracking-wider mb-1">
            <span>Clube Atual</span>
            <span>Orçamento</span>
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-xl font-extrabold text-white">Flamengo</h2>
            <span className="text-emerald-400 font-bold text-lg">R$ 50.0M</span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="flex space-x-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold overflow-x-auto">
          <button onClick={() => setActiveTab('tabela')} className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'tabela' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Tabela</button>
          <button onClick={() => setActiveTab('elenco')} className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'elenco' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Elenco</button>
          <button onClick={() => setActiveTab('tatica')} className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'tatica' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Tática 📋</button>
          <button onClick={() => setActiveTab('mercado')} className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'mercado' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Mercado</button>
          <button onClick={() => setActiveTab('noticias')} className={`flex-1 py-2 rounded-lg text-center ${activeTab === 'noticias' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}>Notícias</button>
        </div>

        {/* Botão de Simulação */}
        <button 
          onClick={() => setRodada(r => r + 1)}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide"
        >
          Jogar Rodada {rodada}
        </button>

        {/* Tabela da Liga */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
          <h3 className="font-bold text-sm text-slate-300 mb-3">Tabela da Liga</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 text-emerald-400 font-medium">
              <span>1. Flamengo</span>
              <div className="space-x-6 text-xs">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>2. Palmeiras</span>
              <div className="space-x-6 text-xs">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800/60 text-slate-300">
              <span>3. São Paulo</span>
              <div className="space-x-6 text-xs">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-1.5 text-slate-300">
              <span>4. Corinthians</span>
              <div className="space-x-6 text-xs">
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
