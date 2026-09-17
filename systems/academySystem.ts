import { Player, Team, NewsItem } from '../types';

const POSITIONS: ('GK' | 'DEF' | 'MID' | 'ATK')[] = ['GK', 'DEF', 'MID', 'ATK'];

// Gera um jovem promessa da base
export const scoutYouthPlayer = (team: Team): { player: Player; news: NewsItem } => {
  const age = 16 + Math.floor(Math.random() * 3); // 16 a 18 anos
  const overall = 50 + Math.floor(Math.random() * 12); // Overall inicial baixo
  const potential = Math.min(99, overall + 20 + Math.floor(Math.random() * 15)); // Alto potencial

  const isWonderkid = potential >= 85;
  const playerId = `youth-${Date.now()}`;

  const player: Player = {
    id: playerId,
    name: `Promessa ${playerId.slice(-4)}`,
    age,
    position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    overall,
    potential,
    stamina: 100,
    morale: 90,
    traits: isWonderkid ? ['WONDERKID'] : [],
    marketValue: overall * 100000,
    contractMonthsLeft: 36,
    wage: 1000,
  };

  const news: NewsItem = {
    id: `news-youth-${Date.now()}`,
    timestamp: 'Categorias de Base',
    title: isWonderkid 
      ? `NOVA JÓIA! ${player.name} se destaca na base do ${team.name}`
      : `Olheiros promovem ${player.name} ao elenco principal`,
    content: `O jovem de ${age} anos tem potencial estimado em ${potential} e ingressa no time profissional.`,
    category: 'BOARD',
    sentiment: 'POSITIVE',
  };

  return { player, news };
};
