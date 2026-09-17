import React, { useState, useEffect } from 'react';

const APP_CONFIG = {
  appName: "Top Club Director",
  version: "6.0.0-PRO",
  currencySymbol: "R$",
};

interface Team {
  id: string;
  name: string;
  points: number;
  played: number;
  division: 'A' | 'B';
  stadiumCapacity: number;
}

interface Player {
  id: number;
  name: string;
  pos: 'GOL' | 'DEF' | 'MEI' | 'ATA';
  overall: number;
  energy: number;
  morale: number;
  value: number;
  salary: number;
  contractYears: number;
  goals: number;
  injured: boolean;
  yellowCards: number;
  suspended: boolean;
  age: number;
}

interface HistoryEntry {
  season: number;
  winner: string;
  userTeam: string;
  userPoints: number;
  userRank: number;
  cupWinner: string;
  mvp: string;
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard' | 'champion' | 'dev_panel'>('menu');
  const [tab, setTab] = useState<'league' | 'squad' | 'tactics' | 'market' | 'stadium' | 'news' | 'history'>('league');
  const [myTeam, setMyTeam] = useState<string>('');
  const [tacticsFormation, setTacticsFormation] = useState<string>('4-3-3');
  const [round, setRound] = useState<number>(1);
  const [seasonCount, setSeasonCount] = useState<number>(1);
  const [money, setMoney] = useState<number>(50000000);
  const [sponsorBonus, setSponsorBonus] = useState<number>(2500000);
  const [news, setNews] = useState<string[]>(['🚀 Rebranding Oficial: Bem-vindo ao Top Club Director!']);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [cupWinner, setCupWinner] = useState<string>('Em andamento');

  const [teams, setTeams] = useState<Team[]>([
    { id: 't1', name: 'Flamengo', points: 0, played: 0, division: 'A', stadiumCapacity: 50000 },
    { id: 't2', name: 'Palmeiras', points: 0, played: 0, division: 'A', stadiumCapacity: 45000 },
    { id: 't3', name: 'São Paulo', points: 0, played: 0, division: 'A', stadiumCapacity: 48000 },
    { id: 't4', name: 'Corinthians', points: 0, played: 0, division: 'A', stadiumCapacity: 47000 },
  ]);

  const [squad, setSquad] = useState<Player[]>([
    { id: 1, name: 'Rossi', pos: 'GOL', overall: 81, energy: 100, morale: 90, value: 6000000, salary: 200000, contractYears: 3, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 28 },
    { id: 2, name: 'Léo Ortiz', pos: 'DEF', overall: 82, energy: 98, morale: 88, value: 11000000, salary: 300000, contractYears: 2, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 3, name: 'Léo Pereira', pos: 'DEF', overall: 80, energy: 95, morale: 85, value: 9000000, salary: 250000, contractYears: 1, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 28 },
    { id: 4, name: 'Ayrton Lucas', pos: 'DEF', overall: 79, energy: 92, morale: 87, value: 8000000, salary: 220000, contractYears: 2, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 5, name: 'Pulgar', pos: 'MEI', overall: 81, energy: 90, morale: 89, value: 10000000, salary: 280000, contractYears: 3, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 29 },
    { id: 6, name: 'De La Cruz', pos: 'MEI', overall: 85, energy: 88, morale: 92, value: 18000000, salary: 500000, contractYears: 4, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 7, name: 'Arrascaeta', pos: 'MEI', overall: 86, energy: 86, morale: 95, value: 22000000, salary: 600000, contractYears: 2, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 29 },
    { id: 8, name: 'Gerson', pos: 'MEI', overall: 84, energy: 89, morale: 90, value: 16000000, salary: 450000, contractYears: 3, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 9, name: 'Pedro', pos: 'ATA', overall: 85, energy: 91, morale: 94, value: 25000000, salary: 650000, contractYears: 3, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 10, name: 'Everton Ceballos', pos: 'ATA', overall: 82, energy: 90, morale: 86, value: 14000000, salary: 350000, contractYears: 1, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 11, name: 'Bruno Henrique', pos: 'ATA', overall: 81, energy: 85, morale: 88, value: 11000000, salary: 320000, contractYears: 2, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 33 },
  ]);

  const [market, setMarket] = useState<Player[]>([
    { id: 101, name: 'Endrick', pos: 'ATA', overall: 84, energy: 100, morale: 95, value: 30000000, salary: 500000, contractYears: 3, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 18 },
    { id: 102, name: 'Lucas Moura', pos: 'MEI', overall: 82, energy: 100, morale: 90, value: 12000000, salary: 350000, contractYears: 2, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 31 },
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('top_club_director_save');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMyTeam(parsed.myTeam || '');
        setMoney(parsed.money || 50000000);
        setRound(parsed.round || 1);
        setSeasonCount(parsed.seasonCount || 1);
        if (parsed.teams) setTeams(parsed.teams);
        if (parsed.squad) setSquad(parsed.squad);
        if (parsed.history) setHistory(parsed.history);
        if (parsed.myTeam) setScreen('dashboard');
      } catch (e) {
        console.error("Erro ao carregar save", e);
      }
    }
  }, []);

  const saveGame = () => {
    const dataToSave = { myTeam, money, round, seasonCount, teams, squad, history };
    localStorage.setItem('top_club_director_save', JSON.stringify(dataToSave));
  };

  const calculatePayroll = () => squad.reduce((total, p) => total + p.salary, 0);

  const simulateRound = () => {
    if (round >= 6) {
      const winner = teams[0].name;
      const userIndex = teams.findIndex(t => t.name === myTeam);
      const userPoints = teams[userIndex]?.points || 0;
      const userRank = userIndex + 1;

      let reward = userRank === 1 ? 30000000 : 12000000;
      const bestPlayer = [...squad].sort((a, b) => b.goals - a.goals)[0]?.name || 'Pedro';

      setMoney(prev => prev + reward);
      const newHistory = [{ season: seasonCount, winner, userTeam: myTeam, userPoints, userRank, cupWinner, mvp: bestPlayer }, ...history];
      setHistory(newHistory);
      setScreen('champion');

      saveGame();
      return;
    }

    const newTeams = [...teams];
    const match1A = newTeams[0];
    const match1B = newTeams[1];

    const score1A = Math.floor(Math.random() * 4);
    const score1B = Math.floor(Math.random() * 4);

    newTeams.forEach(t => t.played += 1);

    if (score1A > score1B) match1A.points += 3;
    else if (score1B > score1A) match1B.points += 3;
    else { match1A.points += 1; match1B.points += 1; }

    newTeams.sort((a, b) => b.points - a.points);
    setTeams(newTeams);

    const userTeamData = teams.find(t => t.name === myTeam);
    const gateIncome = (userTeamData?.stadiumCapacity || 40000) * 60;
    setMoney(prev => prev + gateIncome + sponsorBonus - calculatePayroll());

    setRound(round + 1);
    saveGame();
  };

  return (
    <div style={{ padding: '16px', color: '#fff', minHeight: '100vh', background: '#0f172a', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', margin: 0, letterSpacing: '1px' }}>⚽ {APP_CONFIG.appName}</h1>
        <span style={{ background: '#22c55e', color: '#000', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 'bold' }}>
          {APP_CONFIG.version}
        </span>
      </header>

      {screen === 'menu' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h2>Gestão de Futebol de Alto Nível</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '20px', fontSize: '13px' }}>
            Comande todos os departamentos do seu clube rumo à glória.
          </p>
          <button onClick={() => setScreen('select')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '15px' }}>
            Iniciar Carreira Executiva
          </button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Escolha seu Clube</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {teams.map((t) => (
              <button key={t.id} onClick={() => { setMyTeam(t.name); setScreen('dashboard'); saveGame(); }} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '14px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'left', fontSize: '15px' }}>
                ⚽ {t.name} (Série {t.division})
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'champion' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', margin: '0 0 8px 0' }}>🏆 Fim da Temporada {seasonCount}!</h1>
          <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '18px' }}>Campeão: {teams[0].name}</p>
          
          <button onClick={() => { setRound(1); setSeasonCount(seasonCount + 1); setScreen('dashboard'); }} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '15px', marginTop: '16px' }}>
            Iniciar Temporada {seasonCount + 1}
          </button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334155', paddingBottom: '8px', marginBottom: '8px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 'bold', display: 'block' }}>CLUBE ATUAL</span>
                <strong style={{ fontSize: '18px' }}>{myTeam}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', display: 'block' }}>ORÇAMENTO</span>
                <strong style={{ color: '#4ade80', fontSize: '16px' }}>{APP_CONFIG.currencySymbol} {(money / 1000000).toFixed(1)}M</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            <button onClick={() => setTab('league')} style={{ flex: 1, background: tab === 'league' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Tabela</button>
            <button onClick={() => setTab('squad')} style={{ flex: 1, background: tab === 'squad' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Elenco</button>
            <button onClick={() => setTab('tactics')} style={{ flex: 1, background: tab === 'tactics' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Tática 📋</button>
            <button onClick={() => setTab('market')} style={{ flex: 1, background: tab === 'market' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Mercado</button>
            <button onClick={() => setTab('news')} style={{ flex: 1, background: tab === 'news' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Notícias</button>
          </div>

          {tab === 'league' && (
            <>
              <button onClick={simulateRound} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>
                {round >= 6 ? 'Encerrar Temporada 🏆' : `Jogar Rodada ${round}`}
              </button>

              <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
                <h3 style={{ marginTop: 0, fontSize: '16px' }}>Tabela da Liga</h3>
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
                      <tr key={t.id} style={{ borderBottom: '1px solid #334155', color: t.name === myTeam ? '#4ade80' : '#fff' }}>
                        <td style={{ padding: '8px 0' }}>{t.name}</td>
                        <td>{t.played}</td>
                        <td>{t.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {tab === 'squad' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Elenco Principal</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {squad.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <strong>{p.name}</strong> <span style={{ color: '#94a3b8', fontSize: '11px' }}>({p.pos})</span>
                      <div style={{ color: '#60a5fa', fontSize: '12px' }}>OVR: {p.overall} | ⚡ {p.energy}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'tactics' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Quadro Tático</h3>
              <select value={tacticsFormation} onChange={e => setTacticsFormation(e.target.value)} style={{ width: '100%', padding: '10px', background: '#0f172a', color: '#fff', border: '1px solid #334155', borderRadius: '6px' }}>
                <option value="4-3-3">4-3-3 (Ofensivo)</option>
                <option value="4-4-2">4-4-2 (Equilibrado)</option>
                <option value="3-5-2">3-5-2 (Pressão)</option>
              </select>
            </div>
          )}

          {tab === 'market' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Mercado de Transferências</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {market.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <strong>{p.name}</strong> ({p.pos}) - OVR: {p.overall}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'news' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Notícias</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {news.map((item, i) => (
                  <div key={i} style={{ padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px', color: '#cbd5e1' }}>{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
