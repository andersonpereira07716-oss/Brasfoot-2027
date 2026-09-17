export interface MentalAttributes {
  ego: number;
  pressure: number;
  loyalty: number;
}

export interface Player {
  id: string;
  name: string;
  position: 'GK' | 'DEF' | 'MID' | 'ATK';
  skill: number;
  age: number;
  energy: number; // 0 a 100
  moral: number;  // 0 a 100
  mental: MentalAttributes;
  marketValue: number;
  wage: number;
  // Novos campos para gestão de desgaste e punições
  injuryRoundsRemaining: number; // 0 = saudável, >0 = lesionado por N rodadas
  yellowCards: number;           // Cartões amarelos acumulados na competição
  isSuspended: boolean;          // Verdadeiro se suspenso na rodada atual
}

export interface ClubFinances {
  balance: number;
  weeklyWageBill: number;
}

export interface ClubTableStats {
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export interface Club {
  id: string;
  name: string;
  squad: Player[];
  finances: ClubFinances;
  stats: ClubTableStats;
  tactics: {
    formation: '4-4-2' | '4-3-3' | '3-5-2';
    aggression: number;
  };
}

export interface Fixture {
  homeTeam: Club;
  awayTeam: Club;
  played: boolean;
  result?: { homeScore: number; awayScore: number };
}

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'FOUL' | 'YELLOW_CARD' | 'RED_CARD' | 'MISSED_SHOT' | 'INJURY';
  description: string;
  teamId: string;
  playerInvolved?: string;
}

export interface MatchResult {
  homeScore: number;
  awayScore: number;
  events: MatchEvent[];
  stats: {
    homeShots: number;
    awayShots: number;
    homeFouls: number;
    awayFouls: number;
  };
}
