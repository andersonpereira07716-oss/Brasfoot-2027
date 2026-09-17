import React, { useState, useEffect } from 'react';

interface Team {
  name: string;
  points: number;
  played: number;
}

interface Player {
  id: number;
  name: string;
  pos: 'GOL' | 'DEF' | 'MEI' | 'ATA';
  overall: number;
  energy: number;
  value: number;
  goals: number;
  injured: boolean;
  yellowCards: number;
  suspended: boolean;
}

interface HistoryEntry {
  season: number;
  winner: string;
  userTeam: string;
  userPoints: number;
  userRank: number;
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard' | 'champion'>('menu');
  const [tab, setTab] = useState<'league' | 'squad' | 'market' | 'news' | 'topscorers' | 'history'>('league');
  const [myTeam, setMyTeam] = useState<string>('');
  const [tactics, setTactics] = useState<string>('4-3-3');
  const [round, setRound] = useState<number>(1);
  const [seasonCount, setSeasonCount] = useState<number>(1);
  const [money, setMoney] = useState<number>(50000000);
  const [logs, setLogs] = useState<string[]>([]);
  const [news, setNews] = useState<string[]>(['Bem-vindo à nova temporada do Brasfoot NextGen!']);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [lastReward, setLastReward] = useState<number>(0);

  const [teams, setTeams] = useState<Team[]>([
    { name: 'Flamengo', points: 0, played: 0 },
    { name: 'Palmeiras', points: 0, played: 0 },
    { name: 'São Paulo', points: 0, played: 0 },
    { name: 'Corinthians', points: 0, played: 0 }
  ]);

  const [squad, setSquad] = useState<Player[]>([
    { id: 1, name: 'Weverton', pos: 'GOL', overall: 82, energy: 100, value: 5000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 2, name: 'Gomez', pos: 'DEF', overall: 84, energy: 95, value: 12000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 3, name: 'Murilo', pos: 'DEF', overall: 80, energy: 92, value: 8000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 4, name: 'Veiga', pos: 'MEI', overall: 85, energy: 88, value: 15000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 5, name: 'Estêvão', pos: 'ATA', overall: 83, energy: 90, value: 20000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
  ]);

  const [market, setMarket] = useState<Player[]>([
    { id: 101, name: 'Arrascaeta', pos: 'MEI', overall: 86, energy: 100, value: 18000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 102, name: 'Calleri', pos: 'ATA', overall: 81, energy: 100, value: 10000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
    { id: 103, name: 'Yuri Alberto', pos: 'ATA', overall: 79, energy: 100, value: 7000000, goals: 0, injured: false, yellowCards: 0, suspended: false },
  ]);

  useEffect(() => {
    const savedData = localStorage.getItem('brasfoot_save');
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
    localStorage.setItem('brasfoot_save', JSON.stringify(dataToSave));
  };

  const simulateRound = () => {
    if (round >= 6) {
      const winner = teams[0].name;
      const userIndex = teams.findIndex(t => t.name === myTeam);
      const userPoints = teams[userIndex]?.points || 0;
      const userRank = userIndex + 1;

      let reward = 5000000;
      if (userRank === 1) reward = 20000000;
      else if (userRank === 2) reward = 12000000;
      else if (userRank === 3) reward = 8000000;

      setLastReward(reward);
      setMoney(prev => prev + reward);

      const newHistory = [{ season: seasonCount, winner, userTeam: myTeam, userPoints, userRank }, ...history];
      setHistory(newHistory);
      setScreen('champion');

      localStorage.setItem('brasfoot_save', JSON.stringify({
        myTeam, money: money + reward, round, seasonCount, teams, squad, history: newHistory
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

    const updatedSquad = squad.map(p => {
      let newGoals = p.goals;
      let isInjured = p.injured;
      let isSuspended = p.suspended;
      let cards = p.yellowCards;

      if (isInjured) {
        isInjured = false;
        newNews.unshift(`🏥 DEPARTAMENTO MÉDICO: ${p.name} se recuperou de lesão!`);
      }
      if (isSuspended) {
        isSuspended = false;
        cards = 0;
      }

      if (!isInjured && !isSuspended) {
        if ((p.pos === 'ATA' || p.pos === 'MEI') && Math.random() > 0.4) {
          newGoals += 1;
        }

        if (Math.random() < 0.25) {
          cards += 1;
          if (cards >= 2) {
            isSuspended = true;
            newNews.unshift(`🟨 SUSPENSÃO: ${p.name} recebeu o 2º cartão amarelo e desfalca o time na próxima rodada!`);
          }
        }

        if (Math.random() < 0.1) {
          isInjured = true;
          newNews.unshift(`🚑 LESÃO: ${p.name} sentiu dores e foi parar no departamento médico!`);
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
    setMoney(prev => prev + 1500000);

    setLogs([
      `Rodada ${round}: ${match1A.name} ${score1A} x ${score1B} ${match1B.name}`,
      `Rodada ${round}: ${match2A.name} ${score2A} x ${score2B} ${match2B.name}`,
      ...logs
    ]);
    setRound(round + 1);
    saveGame();
  };

  const trainSquad = () => {
    if (money < 1000000) {
      alert('Você precisa de R$ 1.0M para realizar um treino intensivo!');
      return;
    }
    setMoney(money - 1000000);
    const recoveredSquad = squad.map(p => ({
      ...p,
      energy: Math.min(100, p.energy + 25),
      overall: Math.random() > 0.6 ? p.overall + 1 : p.overall
    }));
    setSquad(recoveredSquad);
    setNews([`🏋️ TREINO: O elenco treinou pesado! Energia recuperada e evolução física obtida.`, ...news]);
    saveGame();
  };

  const resetForNextSeason = () => {
    setRound(1);
    setSeasonCount(seasonCount + 1);
    setTeams(teams.map(t => ({ ...t, points: 0, played: 0 })));
    setSquad(squad.map(p => ({ ...p, energy: 100, goals: 0, injured: false, suspended: false, yellowCards: 0 })));
    setScreen('dashboard');
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
    if (squad.length <= 3) {
      alert('Você precisa ter pelo menos 3 jogadores no elenco!');
      return;
    }
    setMoney(money + player.value);
    setSquad(squad.filter(p => p.id !== player.id));
    setMarket([...market, player]);
    setNews([`💰 VENDA: ${player.name} foi vendido por R$ ${(player.value / 1000000).toFixed(1)}M.`, ...news]);
    saveGame();
  };

  const resetAllData = () => {
    if (confirm('Deseja apagar todo o progresso do jogo?')) {
      localStorage.removeItem('brasfoot_save');
      window.location.reload();
    }
  };

  const userPoints = teams.find(t => t.name === myTeam)?.points || 0;
  const sortedScorers = [...squad].sort((a, b) => b.goals - a.goals);

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
              <button key={t.name} onClick={() => { setMyTeam(t.name); setScreen('dashboard'); saveGame(); }} style={{ background: '#334155', color: '#fff', border: '1px solid #475569', padding: '12px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'left' }}>
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {screen === 'champion' && (
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '26px', margin: '0 0 8px 0' }}>🏆 Fim da Temporada {seasonCount}!</h1>
          <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '18px' }}>Campeão: {teams[0].name}</p>
          
          <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '12px 0 4px 0' }}>
            Seu time encerrou com {userPoints} {userPoints === 1 ? 'ponto' : 'pontos'}.
          </p>
          <p style={{ color: '#eab308', fontWeight: 'bold', fontSize: '14px', marginBottom: '20px' }}>
            💵 Bônus da Temporada: +R$ {(lastReward / 1000000).toFixed(1)}M
          </p>

          <button onClick={resetForNextSeason} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
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
              <span>Temporada: <strong>{seasonCount}</strong></span>
              <span>Rodada: <strong>{round}/6</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px', overflowX: 'auto' }}>
            <button onClick={() => setTab('league')} style={{ flex: 1, background: tab === 'league' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Tabela</button>
            <button onClick={() => setTab('squad')} style={{ flex: 1, background: tab === 'squad' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Elenco</button>
            <button onClick={() => setTab('market')} style={{ flex: 1, background: tab === 'market' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 4px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px', whiteSpace: 'nowrap' }}>Mercado</button>
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
            </>
          )}

          {tab === 'squad' && (
            <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>Elenco ({squad.length})</h3>
                <button onClick={trainSquad} style={{ background: '#eab308', color: '#000', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                  🏋️ Treinar (R$ 1.0M)
                </button>
              </div>

              <div style={{ marginBottom: '16px', background: '#0f172a', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold' }}>Tática:</span>
                <select value={tactics} onChange={(e) => setTactics(e.target.value)} style={{ background: '#334155', color: '#fff', border: 'none', padding: '6px', borderRadius: '4px', fontWeight: 'bold' }}>
                  <option value="4-3-3">4-3-3 (Ofensivo)</option>
                  <option value="4-4-2">4-4-2 (Equilibrado)</option>
                  <option value="5-3-2">5-3-2 (Defensivo)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {squad.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: '#0f172a', borderRadius: '6px', fontSize: '13px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong>{p.name}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '11px' }}>({p.pos})</span>
                        {p.injured && <span style={{ background: '#ef4444', color: '#fff', fontSize: '10px', padding: '1px 4px', borderRadius: '4px' }}>🏥 LESIONADO</span>}
                        {p.suspended && <span style={{ background: '#eab308', color: '#000', fontSize: '10px', padding: '1px 4px', borderRadius: '4px' }}>🟨 SUSPENSO</span>}
                      </div>
                      <div style={{ color: p.energy < 50 ? '#ef4444' : '#60a5fa', fontSize: '12px', marginTop: '2px' }}>
                        OVR: {p.overall} | ⚡ {p.energy}% | ⚽ {p.goals} Gols | 🟨 {p.yellowCards}
                      </div>
                    </div>
                    <button onClick={() => sellPlayer(p)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px' }}>
                      Vender (R$ {(p.value / 1000000).toFixed(1)}M)
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
                {market.map((p) => (
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
              <h3 style={{ marginTop: 0, fontSize: '16px' }}>Artilharia da Equipe</h3>
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
                      <div style={{ fontWeight: 'bold', color: '#eab308' }}>🏆 Temporada {h.season}: Campeão {h.winner}</div>
                      <div style={{ color: '#cbd5e1', fontSize: '12px' }}>Seu time ({h.userTeam}): {h.userRank}º Lugar ({h.userPoints} pts)</div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={resetAllData} style={{ marginTop: '20px', background: '#dc2626', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontWeight: 'bold', width: '100%', fontSize: '12px' }}>
                Resetar Todo o Jogo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
