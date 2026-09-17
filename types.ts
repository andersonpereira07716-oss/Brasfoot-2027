// --- PLAYER & ACADEMY ---
export type Trait = 'BIG_MATCH_PLAYER' | 'INJURY_PRONE' | 'LOCKER_ROOM_LEADER' | 'WONDERKID';

export interface Player {
  id: string;
  name: string;
  age: number;
  position: 'GK' | 'DEF' | 'MID' | 'ATK';
  overall: number; // Current ability (0-99)
  potential: number; // Hidden or visible potential (0-99)
  stamina: number; // Current match condition/fatigue (0-100)
  morale: number; // Happiness level (0-100)
  traits: Trait[];
  marketValue: number;
  contractMonthsLeft: number;
  wage: number;
}

// --- TACTICS & TEAM ---
export type TacticalStyle = 'POSSESSION' | 'COUNTER_ATTACK' | 'HIGH_PRESS' | 'PARK_THE_BUS';

export interface Tactics {
  formation: '4-4-2' | '4-3-3' | '3-5-2' | '5-3-2';
  style: TacticalStyle;
  aggressiveness: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Team {
  id: string;
  name: string;
  prestige: number; // Influences transfers and news (0-100)
  budget: number;
  tactics: Tactics;
  squad: Player[];
}

// --- MATCH SIMULATION ---
export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'YELLOW_CARD' | 'RED_CARD' | 'SUBSTITUTION' | 'INJURY' | 'NONE';
  description: string;
  teamId?: string;
  playerId?: string;
}

export interface MatchState {
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  minute: number; // 0 to 90
  isFinished: boolean;
  events: MatchEvent[];
  homeStaminaAvg: number;
  awayStaminaAvg: number;
}

// --- PRESS & BOARD FEED ---
export interface NewsItem {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  category: 'MATCH_RESULT' | 'TRANSFER' | 'BOARD' | 'FAN_REACTION';
  sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
}
