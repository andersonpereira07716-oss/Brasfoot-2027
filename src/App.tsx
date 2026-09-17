import React, { useState } from 'react';

interface Team {
  name: string;
  points: number;
  played: number;
}

interface Player {
  name: string;
  pos: 'GOL' | 'DEF' | 'MEI' | 'ATA';
  overall: number;
  energy: number;
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard'>('menu');
  const [tab, setTab] = useState<'league' | 'squad'>('league');
  const [myTeam, setMyTeam] = useState<string>('');
  const [round, setRound] = useState<number>(1);
  const [logs, setLogs] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>([
    { name: 'Flamengo', points: 0, played: 0 },
    { name: 'Palmeiras', points: 0, played: 0 },
    { name: 'São Paulo', points: 0, played: 0 },
    { name: 'Corinthians', points: 0, played: 0 }
  ]);

  const [squad, setSquad] = useState<Player[]>([
    { name: 'Weverton', pos: 'GOL', overall: 82, energy: 100 },
    { name: 'Gomez', pos: 'DEF', overall: 84, energy: 95 },
    { name: 'Murilo', pos: 'DEF', overall: 80, energy: 92 },
    { name: 'Veiga', pos: 'MEI', overall: 85, energy: 88 },
    { name: 'Estêvão', pos: 'ATA', overall: 83, energy: 90 },
  ]);

  const simulateRound = () => {
    const newTeams = [...teams];

    // Sorteia confrontos em duplas (1 vs 2, 3 vs 4)
    const match1A = newTeams[0];
    const match1B = newTeams[1];
    const match2A = newTeams[2];
    const match2B = newTeams[3];

    const score1A = Math.floor(Math.random() * 4);
    const score1B = Math.floor(Math.random() * 4);
    const score2A = Math.floor(Math.random() * 4);
    const score2B = Math.floor(Math.random() * 4);

    // Atualiza Jogos
    newTeams.forEach(t => t.played += 1);

    // Pontuação Jogo 1
    if (score1A > score1B) match1A.points += 3;
    else if (score1B > score1A) match1B.points += 3;
    else { match1A.points += 1; match1B.points += 1; }

    // Pontuação Jogo 2
    if (score2A > score2B) match2A.points += 3;
    else if (score2B > score2A) match2B.points += 3;
    else { match2A.points += 1; match2B.points += 1; }

    newTeams.sort((a, b) => b.points - a.points);
    setTeams(newTeams);

    // Desgasta energia do elenco
    setSquad(squad.map(p => ({ ...p, energy: Math.max(50, p.energy - Math.floor(Math.random() * 5 + 2)) })));

    setLogs([
      `Rodada ${round}: ${match1A.name} ${score1A} x ${score1B} ${match1B.name}`,
      `Rodada ${round}: ${match2A.name} ${score2A} x ${score2B} ${match2B.name}`,
      ...logs
    ]);
    setRound(round + 1);
  };

  return (
    <div style={{ padding: '16px', color: '#fff', minHeight: '100vh', background: '#0f172a', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', margin: 0 }}>⚽ Brasfoot NextGen</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Simulador de Gestão de Futebol</p>
      </header>

      {screen === 'menu' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
          <h2>Novo Jogo</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Inicie sua carreira profissional de técnico.</p>
          <button onClick={() => setScreen('select')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
            Escolher Clube
          </button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Selecione seu Time</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {teams.map((t) => (
              <button key={t.name} onClick={() => { setMyTeam(t.name); setScreen('dashboard'); }} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'left' }}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
            <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: 'bold' }}>CLUBE ATUAL</span>
            <h2 style={{ margin: '4px 0 0 0' }}>{myTeam}</h2>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: '14px' }}>Rodada Atual: {round}</p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setTab('league')} style={{ flex: 1, background: tab === 'league' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>Tabela</button>
            <button onClick={() => setTab('squad')} style={{ flex: 1, background: tab === 'squad' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold' }}>Elenco</button>
          </div>

          {tab === 'league' ? (
            <>
              <button onClick={simulateRound} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
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
                      <tr key={t.name} style={{ borderBottom: '1px solid #334155', color: t.name === myTeam ? '#4ade80' : '#fff' }}>
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
                    {logs.slice(0, 6).map((log, i) => (
                      <div key={i} style={{ padding: '6px', background: '#0f172a', borderRadius: '4px' }}>{log}</div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Jogadores do Elenco</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {squad.map((p) => (
                  <div key={p.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '14px' }}>
                    <div>
                      <strong>{p.name}</strong> <span style={{ color: '#94a3b8', fontSize: '12px' }}>({p.pos})</span>
                    </div>
                    <div>
                      <span style={{ color: '#60a5fa', marginRight: '10px' }}>OVR: {p.overall}</span>
                      <span style={{ color: p.energy > 80 ? '#4ade80' : '#f87171' }}>⚡ {p.energy}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
