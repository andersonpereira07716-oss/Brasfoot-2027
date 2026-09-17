import React, { useState } from 'react';
import { CommercialPitch } from './components/CommercialPitch';

export default function App() {
  const [showPitch, setShowPitch] = useState(false);
  const [currentTab, setCurrentTab] = useState<'tabela' | 'elenco' | 'tatica' | 'mercado' | 'noticias'>('tabela');
  const [rodada, setRodada] = useState(1);
  const [formacao, setFormacao] = useState('4-3-3');
  const [noticias, setNoticias] = useState([
    { id: 1, texto: 'Temporada iniciada! Todos os clubes de prontidão para a disputa do título.' }
  ]);
  
  const [elenco, setElenco] = useState([
    { nome: 'G. Ramos', posicao: 'GOL', forza: 79, salario: 'R$ 120k' },
    { nome: 'L. Silva', posicao: 'ZAG', forza: 82, salario: 'R$ 250k' },
    { nome: 'R. Mineiro', posicao: 'MEI', forza: 85, salario: 'R$ 400k' },
    { nome: 'Gabriel H.', posicao: 'ATA', forza: 88, salario: 'R$ 650k' },
  ]);

  const [tabela, setTabela] = useState([
    { time: 'Flamengo', j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 },
    { time: 'Palmeiras', j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 },
    { time: 'São Paulo', j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 },
    { time: 'Corinthians', j: 0, v: 0, e: 0, d: 0, gp: 0, gc: 0, pts: 0 },
  ]);

  const jogarRodada = () => {
    // Simulação clássica estilo Brasfoot
    setTabela(prev => prev.map((t, index) => {
      const gols = Math.floor(Math.random() * 3);
      const sofridos = Math.floor(Math.random() * 2);
      const vitoria = gols > sofridos ? 1 : 0;
      const empate = gols === sofridos ? 1 : 0;
      const pontosGanhos = vitoria ? 3 : (empate ? 1 : 0);
      return {
        ...t,
        j: t.j + 1,
        v: t.v + vitoria,
        e: t.e + empate,
        d: t.d + (vitoria === 0 && empate === 0 ? 1 : 0),
        gp: t.gp + gols,
        gc: t.gc + sofridos,
        pts: t.pts + pontosGanhos
      };
    }).sort((a, b) => b.pts - a.pts));

    setNoticias(prev => [
      { id: Date.now(), texto: `Fim da Rodada ${rodada}: Partidas movimentadas agitaram o campeonato nacional!` },
      ...prev
    ]);
    
    setRodada(r => r + 1);
  };

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
      {/* Header Estilo Clássico */}
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

      {/* Painel do Clube */}
      <main className="p-4 space-y-4 max-w-md mx-auto w-full flex-1">
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-xl flex justify-between items-center">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Clube Atual</span>
            <h2 className="text-lg font-black text-white">Flamengo</h2>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Orçamento</span>
            <span className="text-emerald-400 font-bold text-base">R$ 50.0M</span>
          </div>
        </div>

        {/* Abas de Navegação Estilo Brasfoot */}
        <div className="grid grid-cols-5 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button onClick={() => setCurrentTab('tabela')} className={`py-2 rounded-lg text-center transition-colors ${currentTab === 'tabela' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Tabela</button>
          <button onClick={() => setCurrentTab('elenco')} className={`py-2 rounded-lg text-center transition-colors ${currentTab === 'elenco' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Elenco</button>
          <button onClick={() => setCurrentTab('tatica')} className={`py-2 rounded-lg text-center transition-colors ${currentTab === 'tatica' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Tática</button>
          <button onClick={() => setCurrentTab('mercado')} className={`py-2 rounded-lg text-center transition-colors ${currentTab === 'mercado' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>Mercado</button>
          <button onClick={() => setCurrentTab('noticias')} className={`py-2 rounded-lg text-center transition-colors ${currentTab === 'noticias' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>News</button>
        </div>

        {/* Botão de Jogar Rodada */}
        <button 
          onClick={jogarRodada}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold py-3.5 rounded-2xl transition-all shadow-lg shadow-emerald-500/20 text-sm tracking-wide flex items-center justify-center gap-2"
        >
          <span>▶</span> Jogar Rodada {rodada}
        </button>

        {/* Conteúdo Dinâmico por Aba */}
        {currentTab === 'tabela' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
            <h3 className="font-bold text-sm text-slate-300 mb-3">Tabela da Série A</h3>
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-6 font-bold text-slate-400 pb-1 border-b border-slate-800 text-[10px] uppercase">
                <span className="col-span-2">Clube</span>
                <span className="text-center">J</span>
                <span className="text-center">V</span>
                <span className="text-center">SG</span>
                <span className="text-right">Pts</span>
              </div>
              {tabela.map((t, idx) => (
                <div key={t.time} className={`grid grid-cols-6 items-center py-1.5 px-1 rounded ${t.time === 'Flamengo' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  <span className="col-span-2 truncate">{idx + 1}. {t.time}</span>
                  <span className="text-center">{t.j}</span>
                  <span className="text-center">{t.v}</span>
                  <span className="text-center">{t.gp - t.gc}</span>
                  <span className="text-right font-mono font-bold">{t.pts}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'elenco' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-slate-300 mb-2">Plantel Principal</h3>
            {elenco.map((jogador, idx) => (
              <div key={idx} className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 text-xs">
                <div>
                  <span className="font-bold text-white">{jogador.nome}</span>
                  <div className="text-[10px] text-slate-400">{jogador.posicao} • Salário: {jogador.salario}</div>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold px-2.5 py-1 rounded-lg">
                  {jogador.forza} FOR
                </div>
              </div>
            ))}
          </div>
        )}

        {currentTab === 'tatica' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-4">
            <h3 className="font-bold text-sm text-slate-300">Configuração Tática</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Esquema Tático</label>
              <div className="grid grid-cols-3 gap-2">
                {['4-3-3', '4-4-2', '3-5-2'].map(esquema => (
                  <button 
                    key={esquema} 
                    onClick={() => setFormacao(esquema)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${formacao === esquema ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'}`}
                  >
                    {esquema}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
              <p>📌 <strong>Estilo de Jogo:</strong> Ofensivo com pressão alta.</p>
              <p className="mt-1 text-slate-400">Time adaptado à formação selecionada com rendimento máximo.</p>
            </div>
          </div>
        )}

        {currentTab === 'mercado' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-300">Janela de Transferências</h3>
            <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-white block">J. Star (ATA)</span>
                <span className="text-[10px] text-slate-400">Força: 89 • Valor: R$ 22.0M</span>
              </div>
              <button onClick={() => alert('Proposta enviada ao clube!')} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                Contratar
              </button>
            </div>
          </div>
        )}

        {currentTab === 'noticias' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <h3 className="font-bold text-sm text-slate-300 mb-2">Central de Imprensa</h3>
            {noticias.map(n => (
              <div key={n.id} className="bg-slate-950/50 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                📰 {n.texto}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
