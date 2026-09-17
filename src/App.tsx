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
}

interface HistoryEntry {
  season: number;
  winner: string;
  userTeam: string;
  userPoints: number;
}

export default function App() {
  const [screen, setScreen] = useState<'menu' | 'select' | 'dashboard' | 'champion'>('menu');
  const [tab, setTab] = useState<'league' | 'squad' | 'market' | 'news' | 'history'>('league');
  const [myTeam, setMyTeam] = useState<string>('');
  const [tactics, setTactics] = useState<string>('4-3-3');
  const [round, setRound] = useState<number>(1);
  const [seasonCount, setSeasonCount] = useState<number>(1);
  const [money, setMoney] = useState<number>(50000000);
  const [logs, setLogs] = useState<string[]>([]);
  const [news, setNews] = useState<string[]>(['Bem-vindo à nova temporada do Brasfoot NextGen!']);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const [teams, setTeams] = useState<Team[]>([
    { name: 'Flamengo', points: 0, played: 0 },
    { name: 'Palmeiras', points: 0, played: 0 },
    { name: 'São Paulo', points: 0, played: 0 },
    { name: 'Corinthians', points: 0, played: 0 }
  ]);

  const [squad, setSquad] = useState<Player[]>([
    { id: 1, name: 'Weverton', pos: 'GOL', overall: 82, energy: 100, value: 5000000 },
    { id: 2, name: 'Gomez', pos: 'DEF', overall: 84, energy: 95, value: 12000000 },
    { id: 3, name: 'Murilo', pos: 'DEF', overall: 80, energy: 92, value: 8000000 },
    { id: 4, name: 'Veiga', pos: 'MEI', overall: 85, energy: 88, value: 15000000 },
    { id: 5, name: 'Estêvão', pos: 'ATA', overall: 83, energy: 90, value: 20000000 },
  ]);

  const [market, setMarket] = useState<Player[]>([
    { id: 101, name: 'Arrascaeta', pos: 'MEI', overall: 86, energy: 100, value: 18000000 },
    { id: 102, name: 'Calleri', pos: 'ATA', overall: 81, energy: 100, value: 10000000 },
    { id: 103, name: 'Yuri Alberto', pos: 'ATA', overall: 79, energy: 100, value: 7000000 },
  ]);

  // Carregar dados salvos
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

  // Salvar progresso
  const saveGame = () => {
    const dataToSave = { myTeam, money, round, seasonCount, teams, squad, history };
    localStorage.setItem('brasfoot_save', JSON.stringify(dataToSave));
  };

  const simulateRound = () => {
    if (round >= 6) {
      const winner = teams[0].name;
      const userPoints = teams.find(t => t.name === myTeam)?.points || 0;
      const newHistory = [{ season: seasonCount, winner, userTeam: myTeam, userPoints }, ...history];

      setHistory(newHistory);
      setScreen('champion');

      // Salva histórico no encerramento
      localStorage.setItem('brasfoot_save', JSON.stringify({
        myTeam, money, round, seasonCount, teams, squad, history: newHistory
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

    setSquad(squad.map(p => ({ ...p, energy: Math.max(40, p.energy - Math.floor(Math.random() * 6 + 3)) })));
    setMoney(prev => prev + 1500000);

    if (Math.random() > 0.5) {
      const randomPlayer = squad[Math.floor(Math.random() * squad.length)];
      setNews([`📰 Destaque: ${randomPlayer.name} atuou bem na tática ${tactics}!`, ...news]);
    }

    setLogs([
      `Rodada ${round}: ${match1A.name} ${score1A} x ${score1B} ${match1B.name}`,
      `Rodada ${round}: ${match2A.name} ${score2A} x ${score2B} ${match2B.name}`,
      ...logs
    ]);
    setRound(round + 1);
    saveGame();
  };

  const resetForNextSeason = () => {
    setRound(1);
    setSeasonCount(seasonCount + 1);
    setTeams(teams.map(t => ({ ...t, points: 0, played: 0 })));
    setSquad(squad.map(p => ({ ...p, energy: 100 })));
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
          <h1 style={{ fontSize: '28px', margin: '0 0 8px 0' }}>🏆 Fim da Temporada {seasonCount}!</h1>
          <p style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '18px' }}>Campeão: {teams[0].name}</p>
          <p style={{ color: '#cbd5e1', fontSize: '14px', margin: '16px 0' }}>Seu time encerrou com {teams.find(t => t.name === myTeam)?.points} pontos.</p>
          <button onClick={resetForNextSeason} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', width: '100%' }}>
            Iniciar Temporada {seasonCount + 1}
          </button>
        </div>
      )}

      {screen === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: '#1e293b', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#22c55e', fontWeight: 'bold' }}>CLUBE ATUAL ({myTeam})</span>
              <h2 style={{ margin: '2px 0 0 0', fontSize: '18px' }}>Temp. {seasonCount} - Rodada {round}/6</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: '#60a5fa', fontWeight: 'bold' }}>SALDO</span>
              <p style={{ margin: '2px 0 0 0', color: '#4ade80', fontWeight: 'bold', fontSize: '15px' }}>
                R$ {(money / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setTab('league')} style={{ flex: 1, background: tab === 'league' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 2px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Tabela</button>
            <button onClick={() => setTab('squad')} style={{ flex: 1, background: tab === 'squad' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 2px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Elenco</button>
            <button onClick={() => setTab('market')} style={{ flex: 1, background: tab === 'market' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 2px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Mercado</button>
            <button onClick={() => setTab('news')} style={{ flex: 1, background: tab === 'news' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 2px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Notícias</button>
            <button onClick={() => setTab('history')} style={{ flex: 1, background: tab === 'history' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 2px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}>Galeria</button>
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
              <h3 style={{ margin: 0, fontSize: '16px', marginBottom: '12px' }}>Elenco ({squad.length})</h3>
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
                      <strong>{p.name}</strong> <span style={{ color: '#94a3b8', fontSize: '11px' }}>({p.pos})</span>
                      <div style={{ color: '#60a5fa', fontSize: '12px' }}>OVR: {p.overall} | ⚡ {p.energy}%</div>
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
                      <div style={{ color: '#cbd5e1', fontSize: '12px' }}>Seu time ({h.userTeam}): {h.userPoints} pts</div>
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
