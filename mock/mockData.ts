import { Team, Player } from '../types';

const POSITIONS: ('GK' | 'DEF' | 'MID' | 'ATK')[] = ['GK', 'DEF', 'MID', 'ATK'];

const generatePlayer = (id: string, age: number, baseOverall: number): Player => {
  const potential = Math.min(99, baseOverall + Math.floor(Math.random() * 15));
  return {
    id,
    name: `Jogador ${id}`,
    age,
    position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    overall: baseOverall,
    potential,
    stamina: 100,
    morale: 80,
    traits: Math.random() > 0.7 ? ['WONDERKID'] : [],
    marketValue: baseOverall * 150000,
    contractMonthsLeft: 24,
    wage: baseOverall * 2000,
  };
};

export const generateMockTeams = (): Team[] => {
  return Array.from({ length: 4 }).map((_, teamIdx) => ({
    id: `team-${teamIdx + 1}`,
    name: `Clube ${teamIdx + 1}`,
    prestige: 70 + teamIdx * 5,
    budget: 10000000,
    tactics: {
      formation: '4-4-2',
      style: 'POSSESSION',
      aggressiveness: 'MEDIUM',
    },
    squad: Array.from({ length: 11 }).map((_, playerIdx) =>
      generatePlayer(`${teamIdx + 1}-${playerIdx + 1}`, 20 + Math.floor(Math.random() * 10), 65 + teamIdx * 3)
    ),
  }));
};
