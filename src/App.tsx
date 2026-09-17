import React, { useState, useEffect } from 'react';

interface Team {
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
  value: number;
  salary: number;
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
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard' | 'champion'>('menu');
  const [tab, setTab] = useState<'league' | 'squad' | 'market' | 'cup' | 'stadium' | 'finance' | 'topscorers' | 'news' | 'history'>('league');
  const [myTeam, setMyTeam] = useState<string>('');
  const [tactics, setTactics] = useState<string>('4-3-3');
  const [round, setRound] = useState<number>(1);
  const [seasonCount, setSeasonCount] = useState<number>(1);
  const [money, setMoney] = useState<number>(50000000);
  const [loan, setLoan] = useState<number>(0);
  const [sponsorBonus, setSponsorBonus] = useState<number>(2000000);
  const [news, setNews] = useState<string[]>(['🚀 Brasfoot NextGen Pro: Bem-vindo à nova temporada profissional!']);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastReward, setLastReward] = useState<number>(0);
  const [marketFilter, setMarketFilter] = useState<string>('ALL');

  const [cupPhase, setCupPhase] = useState<'Semifinal' | 'Final' | 'Encerrada'>('Semifinal');
  const [cupWinner, setCupWinner] = useState<string>('Em andamento');

  const [teams, setTeams] = useState<Team[]>([
    { name: 'Flamengo', points: 0, played: 0, division: 'A', stadiumCapacity: 50000 },
    { name: 'Palmeiras', points: 0, played: 0, division: 'A', stadiumCapacity: 45000 },
    { name: 'São Paulo', points: 0, played: 0, division: 'A', stadiumCapacity: 48000 },
    { name: 'Corinthians', points: 0, played: 0, division: 'A', stadiumCapacity: 47000 },
  ]);

  const [squad, setSquad] = useState<Player[]>([
    { id: 1, name: 'Rossi', pos: 'GOL', overall: 81, energy: 100, value: 6000000, salary: 200000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 28 },
    { id: 2, name: 'Léo Ortiz', pos: 'DEF', overall: 82, energy: 98, value: 11000000, salary: 300000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 3, name: 'Léo Pereira', pos: 'DEF', overall: 80, energy: 95, value: 9000000, salary: 250000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 28 },
    { id: 4, name: 'Ayrton Lucas', pos: 'DEF', overall: 79, energy: 92, value: 8000000, salary: 220000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 5, name: 'Pulgar', pos: 'MEI', overall: 81, energy: 90, value: 10000000, salary: 280000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 29 },
    { id: 6, name: 'De La Cruz', pos: 'MEI', overall: 85, energy: 88, value: 18000000, salary: 500000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 7, name: 'Arrascaeta', pos: 'MEI', overall: 86, energy: 86, value: 22000000, salary: 600000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 29 },
    { id: 8, name: 'Gerson', pos: 'MEI', overall: 84, energy: 89, value: 16000000, salary: 450000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 9, name: 'Pedro', pos: 'ATA', overall: 85, energy: 91, value: 25000000, salary: 650000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 10, name: 'Everton Ceballos', pos: 'ATA', overall: 82, energy: 90, value: 14000000, salary: 350000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 27 },
    { id: 11, name: 'Bruno Henrique', pos: 'ATA', overall: 81, energy: 85, value: 11000000, salary: 320000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 33 },
  ]);

  const [market, setMarket] = useState<Player[]>([
    { id: 101, name: 'Endrick', pos: 'ATA', overall: 84, energy: 100, value: 30000000, salary: 500000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 18 },
    { id: 102, name: 'Lucas Moura', pos: 'MEI', overall: 82, energy: 100, value: 12000000, salary: 350000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 31 },
    { id: 103, name: 'Garro', pos: 'MEI', overall: 81, energy: 100, value: 11000000, salary: 300000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 26 },
    { id: 104, name: 'Cássio', pos: 'GOL', overall: 80, energy: 100, value: 4000000, salary: 150000, goals: 0, injured: false, yellowCards: 0, suspended: false, age: 36 },
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('brasfoot_save_ultra_v2');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setMyTeam(parsed.myTeam || '');
        setMoney(parsed.money || 50000000);
        setLoan(parsed.loan || 0);
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
    const dataToSave = { myTeam, money, loan, round, seasonCount, teams, squad, history };
    localStorage.setItem('brasfoot_save_ultra_v2', JSON.stringify(dataToSave));
  };

  const calculatePayroll = () => squad.reduce((total, p) => total + p.salary, 0);

  const upgradeStadium = () => {
    const cost = 12000000;
    if (money < cost) {
      alert('Você precisa de R$ 12.0M para ampliar o estádio!');
      return;
    }
    setMoney(money - cost);
    setTeams(teams.map(t => t.name === myTeam ? { ...t, stadiumCapacity: t.stadiumCapacity + 10000 } : t));
    setNews([`🏟️ ESTÁDIO: Ampliação concluída! +10.000 lugares adicionados.`, ...news]);
    saveGame();
  };

  const simulateRound = () => {
    if (round >= 6) {
      const winner = teams[0].name;
      const userIndex = teams.findIndex(t => t.name === myTeam);
      const userPoints = teams[userIndex]?.points || 0;
      const userRank = userIndex + 1;

      let reward = 5000000;
      if (userRank === 1) reward = 30000000;
      else if (userRank === 2) reward = 20000000;
      else if (userRank === 3) reward = 12000000;

      setLastReward(reward);
      setMoney(prev => prev + reward);

      const newHistory = [{ season: seasonCount, winner, userTeam: myTeam, userPoints, userRank, cupWinner }, ...history];
      setHistory(newHistory);
      setScreen('champion');

      localStorage.setItem('brasfoot_save_ultra_v2', JSON.stringify({
        myTeam, money: money + reward, loan, round, seasonCount, teams, squad, history: newHistory
      }));
      return;
    }

    const newTeams = [...teams];
    const match1A = newTeams[0];
    const match1B = newTeams[1];
    const match2A = newTeams[2];
    const match2B = newTeams[3];

    const tacticBonus = tactics === '4-3-3' ? 1 : 0;
    const score1A = Math.floor(Math.random() * (4 + tacticBonus));
    const score1B = Math.floor(Math.random() * 4);
    const score2A = Math.floor(Math.random() * 4);
    const score2B = Math.floor(Math.random() * 4);

    newTeams.forEach(t => t.played += 1);

    if (score1A > score1B) match1A.points += 3;
    else if (score1B > score1A) match1B.points += 3;
    else { match1A.points += 1; match1B.points += 1; }

    if (score2A > score2B) match2A.points += 3;
    else if (score2B > score2A) match2B.points += 3;
    else { match2A.points += 1; match2B.points += 1; }

    newTeams.sort((a, b) => b.points - a.points);
    setTeams(newTeams);

    let newNews = [...news];

    // Entrada de Bilheteria + Patrocínio - Folha Salarial
    const userTeamData = teams.find(t => t.name === myTeam);
    const gateIncome = (userTeamData?.stadiumCapacity || 40000) * 60;
    const netFinance = gateIncome + sponsorBonus - calculatePayroll();

    setMoney(prev => prev + netFinance);

    const updatedSquad = squad.map(p => {
      let newGoals = p.goals;
      let isInjured = p.injured;
      let isSuspended = p.suspended;
      let cards = p.yellowCards;

      if (isInjured) isInjured = false;
      if (isSuspended) { isSuspended = false; cards = 0; }

      if (!isInjured && !isSuspended) {
        if ((p.pos === 'ATA' || p.pos === 'MEI') && Math.random() > 0.35) newGoals += 1;
        if (Math.random() < 0.2) {
          cards += 1;
          if (cards >= 2) {
            isSuspended = true;
            newNews.unshift(`🟨 CARTÃO: ${p.name} suspenso pelo 2º cartão amarelo!`);
          }
        }
        if (Math.random() < 0.08) {
          isInjured = true;
          newNews.unshift(`🚑 LESÃO: ${p.name} desfalca a equipe por lesão.`);
        }
      }

      return { 
        ...p, 
        goals: newGoals, 
        injured: isInjured, 
        suspended: isSuspended, 
        yellowCards: cards,
        energy: isInjured ? 50 : Math.max(30, p.energy - Math.floor(Math.random() * 8 + 4)) 
      };
    });

    setSquad(updatedSquad);
    setNews(newNews);
    setRound(round + 1);
    saveGame();
  };

  const simulateCupMatch = () => {
    if (cupPhase === 'Encerrada') return;

    if (cupPhase === 'Semifinal') {
      const winner = Math.random() > 0.4 ? myTeam : 'Palmeiras';
      if (winner === myTeam) {
        setCupPhase('Final');
        setNews([`🏆 COPA: O ${myTeam} venceu a Semifinal e avançou para a Grande Final!`, ...news]);
      } else {
        setCupPhase('Encerrada');
        setCupWinner('Palmeiras');
        setNews([`❌ COPA: O ${myTeam} foi eliminado na Semifinal.`, ...news]);
      }
    } else if (cupPhase === 'Final') {
      const winner = Math.random() > 0.5 ? myTeam : 'São Paulo';
      setCupPhase('Encerrada');
      setCupWinner(winner);
      if (winner === myTeam) {
        setMoney(money + 15000000);
        setNews([`🏆 CAMPEÃO DA COPA! O ${myTeam} conquistou o título e faturou R$ 15.0M!`, ...news]);
      } else {
        setNews([`🥈 VICE-CAMPEÃO: O ${myTeam} ficou em 2º lugar na Copa.`, ...news]);
      }
    }
    saveGame();
  };

  const trainSquad = () => {
    if (money < 1500000) {
      alert('Você precisa de R$ 1.5M para o treino!');
      return;
    }
    setMoney(money - 1500000);
    setSquad(squad.map(p => ({
      ...p,
      energy: Math.min(100, p.energy + 30),
      overall: Math.random() > 0.5 ? p.overall + 1 : p.overall
    })));
    setNews([`🏋️ TREINO: Elenco fisicamente recuperado e com evolução tática!`, ...news]);
    saveGame();
  };

  const buyPlayer = (player: Player) => {
    if (money < player.value) {
      alert('Saldo insuficiente!');
      return;
    }
    setMoney(money - player.value);
    setSquad([...squad, player]);
    setMarket(market.filter(p => p.id !== player.id));
    setNews([`🤝 CONTRATAÇÃO: ${player.name} assinou com o ${myTeam}!`, ...news]);
    saveGame();
  };

  const sellPlayer = (player: Player) => {
    if (squad.length <= 11) {
      alert('Seu elenco precisa ter no mínimo 11 jogadores!');
      return;
    }
    setMoney(money + player.value);
    setSquad(squad.filter(p => p.id !== player.id));
    setMarket([...market, player]);
    setNews([`💰 VENDA: ${player.name} foi vendido por R$ ${(player.value / 1000000).toFixed(1)}M.`, ...news]);
    saveGame();
  };

  const resetForNextSeason = () => {
    setRound(1);
    setSeasonCount(seasonCount + 1);
    setCupPhase('Semifinal');
    setCupWinner('Em andamento');
    setTeams(teams.map(t => ({ ...t, points: 0, played: 0 })));
    setSquad(squad.map(p => ({ ...p, energy: 100, goals: 0, injured: false, suspended: false, yellowCards: 0 })));
    setScreen('dashboard');
    saveGame();
  };

  const resetAllData = () => {
    if (confirm('Deseja apagar todo o progresso do jogo?')) {
      localStorage.removeItem('brasfoot_save_ultra_v2');
      window.location.reload();
    }
  };

  const userPoints = teams.find(t => t.name === myTeam)?.points || 0;
  const currentStadium = teams.find(t => t.name === myTeam)?.stadiumCapacity || 40000;
  const filteredMarket = marketFilter === 'ALL' ? market : market.filter(p => p.pos === marketFilter);
  const sortedScorers = [...squad].sort((a, b) => b.goals - a.goals);

  return (
    <div style={{ padding: '16px', color: '#fff', minHeight: '100vh', background: '#0f172a', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px', margin: 0 }}>⚽ Brasfoot NextGen Pro</h1>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '4px 0 0 0' }}>Simulador Profissional de Futebol</p>
      </header>

      {screen === 'menu' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h2>Novo Jogo</h2>
          <p style={{ color: '#cbd5e1', marginBottom: '20px' }}>Inicie sua carreira profissional e domine a Liga e a Copa.</p>
          <button onClick={() => setScreen('select')} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '14px 24px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '16px' }}>
            Iniciar Carreira
          </button>
        </div>
      )}

      {screen === 'select' && (
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px' }}>
          <h2 style={{ textAlign: 'center', marginTop: 0 }}>Escolha seu Clube</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
            {teams.map((t) => (
              <button key={t.name} onClick={() => { setMyTeam(t.name); setScreen('dashboard'); saveGame(); }} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '14px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'left', fontSize: '15px' }}>
                ⚽ {t.name} (Série {t.division})
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'champion' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', margin: '0 0 8px 0' }}>🏆 Fim da Temporada {seasonCount}!</h1>
          <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '18px' }}>Campeão da Liga: {teams[0].name}</p>
          <p style={{ color: '#eab308', fontWeight: 'bold', fontSize: '16px' }}>Campeão da Copa: {cupWinner}</p>
          
          <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '12px 0 4px 0' }}>
            Seu time encerrou a Liga com {userPoints} {userPoints === 1 ? 'ponto' : 'pontos'}.
          </p>

          <button onClick={resetForNextSeason} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '14px 20px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '15px', marginTop: '16px' }}>
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
                <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold', display: 'block' }}>SALDO</span>
                <strong style={{ color: '#4ade80', fontSize: '16px' }}>R$ {(money / 1000000).toFixed(1)}M</strong>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
              <span>Folha Salarial: <strong>R$ {(calculatePayroll() / 1000).toFixed(0)}k/jogo</strong></span>
              <span>Rodada Liga: <strong>{round}/6</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            <button onClick={() => setTab('league')} style={{ flex: 1, background: tab === 'league' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Tabela</button>
            <button onClick={() => setTab('cup')} style={{ flex: 1, background: tab === 'cup' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Copa 🏆</button>
            <button onClick={() => setTab('squad')} style={{ flex: 1, background: tab === 'squad' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Elenco</button>
            <button onClick={() => setTab('market')} style={{ flex: 1, background: tab === 'market' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Mercado</button>
            <button onClick={() => setTab('stadium')} style={{ flex: 1, background: tab === 'stadium' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Estádio</button>
            <button onClick={() => setTab('topscorers')} style={{ flex: 1, background: tab === 'topscorers' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Artilharia</button>
            <button onClick={() => setTab('news')} style={{ flex: 1, background: tab === 'news' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Notícias</button>
            <button onClick={() => setTab('history')} style={{ flex: 1, background: tab === 'history' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Galeria</button>
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
                      <tr key={t.name} style={{ borderBottom: '1px solid #334155', color: t.name === myTeam ? '#4ade80' : '#fff' }}>
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

          {tab === 'cup' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Copa Nacional Mata-Mata</h3>
              <p style={{ color: '#cbd5e1', fontSize: '14px' }}>Fase Atual: <strong style={{ color: '#eab308' }}>{cupPhase}</strong></p>
              
              {cupPhase !== 'Encerrada' ? (
                <button onClick={simulateCupMatch} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', width: '100%', marginTop: '10px' }}>
                  Disputar Partida da Copa
                </button>
              ) : (
                <p style={{ color: '#4ade80', fontWeight: 'bold' }}>Campeão da Copa: {cupWinner}</p>
              )}
            </div>
          )}

          {tab === 'stadium' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Estádio & Infraestrutura</h3>
              <p style={{ color: '#cbd5e1', fontSize: '13px' }}>
                Capacidade Atual: <strong>{currentStadium.toLocaleString()} torcedores</strong>
              </p>
              <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '16px' }}>
                Renda estimada por jogo em casa: R$ {((currentStadium * 60) / 1000000).toFixed(2)}M
              </p>
              <button onClick={upgradeStadium} style={{ background: '#22c55e', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', width: '100%', fontSize: '14px' }}>
                Ampliar +10.000 Lugares (R$ 12.0M)
              </button>
            </div>
          )}

          {tab === 'squad' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Elenco ({squad.length})</h3>
                <button onClick={trainSquad} style={{ background: '#eab308', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                  🏋️ Treinar (R$ 1.5M)
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {squad.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{p.name}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>({p.pos}, {p.age}a)</span>
                        {p.injured && <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '1px 4px', borderRadius: '4px' }}>🏥 LESIONADO</span>}
                      </div>
                      <div style={{ color: '#60a5fa', fontSize: '12px', marginTop: '2px' }}>
                        OVR: {p.overall} | ⚡ {p.energy}% | Salário: R$ {(p.salary / 1000).toFixed(0)}k
                      </div>
                    </div>
                    <button onClick={() => sellPlayer(p)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                      Vender
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'market' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Mercado de Transferências</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMarket.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <strong>{p.name}</strong> ({p.pos}) - OVR: {p.overall}
                      <div style={{ color: '#4ade80', fontWeight: 'bold' }}>R$ {(p.value / 1000000).toFixed(1)}M</div>
                    </div>
                    <button onClick={() => buyPlayer(p)} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 'bold' }}>Comprar</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'topscorers' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Artilharia do Elenco</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {sortedScorers.map((p, idx) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#eab308', fontWeight: 'bold', marginRight: '8px' }}>#{idx + 1}</span>
                      <strong>{p.name}</strong> <span style={{ color: '#94a3b8', fontSize: '11px' }}>({p.pos})</span>
                    </div>
                    <strong style={{ color: '#4ade80' }}>⚽ {p.goals} Gols</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'news' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Feed de Notícias</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {news.map((item, i) => (
                  <div key={i} style={{ padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px', color: '#cbd5e1' }}>{item}</div>
                ))}
              </div>
            </div>
          )}

          {tab === 'history' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Galeria de Campeões</h3>
              {history.length === 0 ? (
                <p style={{ color: '#94a3b8', fontSize: '13px' }}>Nenhum histórico registrado ainda.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map((h, i) => (
                    <div key={i} style={{ padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                      <div style={{ fontWeight: 'bold', color: '#eab308' }}>🏆 Temp. {h.season}: Liga ({h.winner}) | Copa ({h.cupWinner})</div>
                      <div style={{ color: '#cbd5e1', fontSize: '12px' }}>Seu time ({h.userTeam}): {h.userRank}º Lugar ({h.userPoints} pts)</div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={resetAllData} style={{ marginTop: '20px', background: '#dc2626', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', width: '100%', fontSize: '12px' }}>
                Resetar Progresso
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
