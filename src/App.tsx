import React, { useState } from 'react';

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard'>('menu');
  const [selectedTeam, setSelectedTeam] = useState('');

  const teams = ['Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Grêmio'];

  return (
    <div style={{ padding: '20px', color: '#fff', textAlign: 'center', minHeight: '100vh', background: '#0f172a' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '8px' }}>⚽ Brasfoot NextGen</h1>
      <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Simulador de Gestão de Futebol</p>

      {screen === 'menu' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2>Novo Jogo</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '16px' }}>Inicie sua carreira técnica.</p>
          <button
            onClick={() => setScreen('select')}
            style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
            Escolher Clube
          </button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2>Selecione seu Time</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => { setSelectedTeam(team); setScreen('dashboard'); }}
                style={{ background: '#334155', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px' }}>
                {team}
              </button>
            ))}
          </div>
          <button onClick={() => setScreen('menu')} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px' }}>
            Voltar
          </button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2>Painel - {selectedTeam}</h2>
          <p style={{ color: '#4ade80', margin: '16px 0' }}>Temporada Inicializada!</p>
          <button onClick={() => alert('Simulando próxima rodada...')} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '6px', fontWeight: 'bold' }}>
            Jogar Rodada
          </button>
        </div>
      )}
    </div>
  );
}
