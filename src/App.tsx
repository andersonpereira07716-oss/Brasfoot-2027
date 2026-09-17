import React, { useState } from 'react';

interface Team {
  name: string;
  points: number;
  played: number;
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard'>('menu');
  const [myTeam, setMyTeam] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [logs, setLogs] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Flamengo', points: 0, played: 0 },
    { name: 'Palmeiras', points: 0, played: 0 },
    { name: 'São Paulo', points: 0, played: 0 },
    { name: 'Corinthians', points: 0, played: 0 }
  ]);

  const handleSelectTeam = (name: string) => {
    setMyTeam(name);
    setScreen('dashboard');
  };

  const simulateRound = () => {
    const newTeams = [...teams];
    const teamA = newTeams[0];
    const teamB = newTeams[1];

    const scoreA = Math.floor(Math.random() * 4);
    const scoreB = Math.floor(Math.random() * 4);

    teamA.played += 1;
    teamB.played += 1;

    if (scoreA > scoreB) teamA.points += 3;
    else if (scoreB > scoreA) teamB.points += 3;
    else {
      teamA.points += 1;
      teamB.points += 1;
    }

    newTeams.sort((a, b) => b.points - a.points);
    setTeams(newTeams);
    setLogs([`Rodada ${round}: ${teamA.name} ${scoreA} x ${scoreB} ${teamB.name}`, ...logs]);
    setRound(round + 1);
  };

  return (
    <div style={{ padding: '16px', color: '#fff', minHeight: '100vh', background: '#0f172a', fontFamily: 'sans-serif' }}>
      <header style={{ textCenter: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', margin: 0 }}>⚽ Brasfoot NextGen</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Simulador de Gestão de Futebol</p>
      </header>

      {screen === 'menu' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h2>Novo Jogo</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Inicie sua carreira profissional de técnico.</p>
          <button
            onClick={() => setScreen('select')}
            style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
            Escolher Clube
          </button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Selecione seu Time</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {teams.map((t) => (
              <button
                key={t.name}
                onClick={() => handleSelectTeam(t.name)}
                style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'left' }}>
                {t.name}
              </button>
            ))}
          </div>
          <button onClick={() => setScreen('menu')} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', width: '100%' }}>
            Voltar
          </button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>CLUBE ATUAL</span>
            <h2 style={{ margin: '4px 0 0 0' }}>{myTeam}</h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Rodada Atual: {round}</p>
          </div>

          <button
            onClick={simulateRound}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
            Jogar Rodada {round}
          </button>

          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
            <h3 style={{ marginTop: 0, fontSize: '16px' }}>Tabela de Classificação</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                  <th style={{ padding: '8px 0' }}>Clube</th>
                  <th>J</th>
                  <th>Pts</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((t) => (
                  <tr key={t.name} style={{ borderBottom: '1px solid #1e293b', fontWeight: t.name === myTeam ? 'bold' : 'normal', color: t.name === myTeam ? '#4ade80' : '#fff' }}>
                    <td style={{ padding: '8px 0' }}>{t.name}</td>
                    <td>{t.played}</td>
                    <td>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {logs.length > 0 && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Últimos Resultados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '13px', color: '#cbd5e1' }}>
                {logs.slice(0, 5).map((log, i) => (
                  <div key={i} style={{ padding: '6px', background: '#0f172a', borderRadius: '4px' }}>{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
