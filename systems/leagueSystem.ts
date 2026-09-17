import { Team, MatchState } from '../types';

export interface LeagueTableEntry {
  teamId: string;
  teamName: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export const updateLeagueTable = (
  currentTable: LeagueTableEntry[],
  match: MatchState
): LeagueTableEntry[] => {
  const { homeTeam, awayTeam, homeScore, awayScore } = match;

  return currentTable.map((entry) => {
    if (entry.teamId === homeTeam.id) {
      const isWin = homeScore > awayScore;
      const isDraw = homeScore === awayScore;
      return {
        ...entry,
        played: entry.played + 1,
        points: entry.points + (isWin ? 3 : isDraw ? 1 : 0),
        wins: entry.wins + (isWin ? 1 : 0),
        draws: entry.draws + (isDraw ? 1 : 0),
        losses: entry.losses + (!isWin && !isDraw ? 1 : 0),
        goalsFor: entry.goalsFor + homeScore,
        goalsAgainst: entry.goalsAgainst + awayScore,
        goalDifference: entry.goalDifference + (homeScore - awayScore),
      };
    }

    if (entry.teamId === awayTeam.id) {
      const isWin = awayScore > homeScore;
      const isDraw = homeScore === awayScore;
      return {
        ...entry,
        played: entry.played + 1,
        points: entry.points + (isWin ? 3 : isDraw ? 1 : 0),
        wins: entry.wins + (isWin ? 1 : 0),
        draws: entry.draws + (isDraw ? 1 : 0),
        losses: entry.losses + (!isWin && !isDraw ? 1 : 0),
        goalsFor: entry.goalsFor + awayScore,
        goalsAgainst: entry.goalsAgainst + homeScore,
        goalDifference: entry.goalDifference + (awayScore - homeScore),
      };
    }

    return entry;
  }).sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference);
};
