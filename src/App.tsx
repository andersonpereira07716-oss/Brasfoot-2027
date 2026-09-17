import React, { useState } from 'react';
import { CommercialPitch } from './components/CommercialPitch';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPitch, setShowPitch] = useState(false);
  const [rodada, setRodada] = useState(1);
  const [activeTab, setActiveTab] = useState('tabela');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setIsAuthenticated(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center px-6 py-12 font-sans">
        <div className="max-w-md mx-auto w-full bg-slate-900/90 border border-slate-800/80 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-3xl mb-4 shadow-inner">
              ⚽
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">Top Club Director</h1>
            <p className="text-xs text-emerald-400 font-mono mt-1">SECURE ENTERPRISE EDITION 6.0.0</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">E-mail Profissional</label>
              <input 
                type="email" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu.email@clube.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Senha de Acesso</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-sm mt-2"
            >
              {isRegistering ? 'Criar Conta e Iniciar' : 'Acessar Painel / Jogo'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se na plataforma'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showPitch) {
    return (
      <div className="relative min-h-screen bg-slate-950">
        <button 
          onClick={() => setShowPitch(false)}
          className="absolute top-4 right-4 z-50 bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 shadow-xl backdrop-blur"
        >
          ← Voltar ao Jogo
        </button>
        <CommercialPitch />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Bar Profissional */}
      <header className="px-4 py-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-md text-lg">
            ⚽
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight text-white leading-tight">Top Club Director</h1>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20">PRO v6.0</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowPitch(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <span>💼</span> Vender App
          </button>
          <button 
            onClick={() => setIsAuthenticated(false)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold p-2 rounded-xl border border-slate-700"
            title="Sair da Conta"
          >
            🚪
          </button>
        </div>
      </header>

      {/* Conteúdo Principal do Jogo */}
      <main className="p-4 space-y-4 max-w-md mx-auto w-full flex-1 pb-10">
        {/* Card do Clube */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800/80 p-5 rounded-2xl shadow-xl">
          <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Clube Atual</span>
            <span>Orçamento em Caixa</span>
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-2xl font-black text-white tracking-tight">Flamengo</h2>
            <span className="text-emerald-400 font-mono font-bold text-lg">R$ 50.0M</span>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px] font-bold text-center">
          <button onClick={() => setActiveTab('tabela')} className={`py-2 rounded-lg transition-all ${activeTab === 'tabela' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Tabela</button>
          <button onClick={() => setActiveTab('elenco')} className={`py-2 rounded-lg transition-all ${activeTab === 'elenco' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Elenco</button>
          <button onClick={() => setActiveTab('tatica')} className={`py-2 rounded-lg transition-all ${activeTab === 'tatica' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Tática</button>
          <button onClick={() => setActiveTab('mercado')} className={`py-2 rounded-lg transition-all ${activeTab === 'mercado' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Mercado</button>
          <button onClick={() => setActiveTab('noticias')} className={`py-2 rounded-lg transition-all ${activeTab === 'noticias' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>News</button>
        </div>

        {/* Botão de Ação Principal */}
        <button 
          onClick={() => setRodada(r => r + 1)}
          className="w-full bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-slate-950 font-black py-4 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide uppercase flex items-center justify-center gap-2"
        >
          <span>▶</span> Jogar Rodada {rodada}
        </button>

        {/* Bloco de Conteúdo da Tabela */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-extrabold text-sm text-slate-200">Tabela da Série A</h3>
            <span className="text-[10px] text-slate-400 font-mono">Rodada {rodada}</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
              <span className="flex items-center gap-2"><span>1</span> Flamengo</span>
              <div className="flex gap-4 font-mono">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-950/40 text-slate-300">
              <span className="flex items-center gap-2 text-slate-400"><span>2</span> Palmeiras</span>
              <div className="flex gap-4 font-mono text-slate-400">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-950/40 text-slate-300">
              <span className="flex items-center gap-2 text-slate-400"><span>3</span> São Paulo</span>
              <div className="flex gap-4 font-mono text-slate-400">
                <span>0 J</span>
                <span>0 Pts</span>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-slate-950/40 text-slate-300">
              <span className="flex items-center gap-2 text-slate-400"><span>4</span> Corinthians</span>
              <div className="flex gap-4 font-mono text-slate-400">
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
