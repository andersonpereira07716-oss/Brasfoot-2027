import { create } from 'zustand';
import { Team, NewsItem, MatchState } from '../types';

interface GameState {
  userTeamId: string | null;
  currentSeason: number;
  currentRound: number;
  teams: Team[];
  newsFeed: NewsItem[];
  activeMatch: MatchState | null;

  initGame: (userTeam: Team, opponentTeams: Team[]) => void;
  advanceRound: () => void;
  updateActiveMatch: (matchState: MatchState) => void;
  addNews: (news: NewsItem) => void;
}

export const useGameStore = create<GameState>((set) => ({
  userTeamId: null,
  currentSeason: 2026,
  currentRound: 1,
  teams: [],
  newsFeed: [],
  activeMatch: null,

  initGame: (userTeam, opponentTeams) =>
    set({
      userTeamId: userTeam.id,
      teams: [userTeam, ...opponentTeams],
      currentRound: 1,
      newsFeed: [
        {
          id: 'news-1',
          timestamp: 'Pré-temporada',
          title: 'Novo treinador assumiu o comando!',
          content: `A diretoria do ${userTeam.name} anunciou a chegada do novo técnico para a temporada.`,
          category: 'BOARD',
          sentiment: 'POSITIVE',
        },
      ],
    }),

  advanceRound: () =>
    set((state) => ({
      currentRound: state.currentRound + 1,
      teams: state.teams.map((team) => ({
        ...team,
        squad: team.squad.map((player) => ({
          ...player,
          stamina: Math.min(100, player.stamina + 15),
        })),
      })),
    })),

  updateActiveMatch: (matchState) => set({ activeMatch: matchState }),

  addNews: (news) =>
    set((state) => ({
      newsFeed: [news, ...state.newsFeed],
    })),
}));
