import { Club, Fixture } from '../types/game';
import { MatchEngine } from './MatchEngine';

export class LeagueEngine {
  // Atualiza as estatísticas de tabela após o resultado de um jogo
  public static updateStats(home: Club, away: Club, homeScore: number, awayScore: number): void {
    home.stats.played += 1;
    away.stats.played += 1;

    home.stats.goalsFor += homeScore;
    home.stats.goalsAgainst += awayScore;
    home.stats.goalDifference = home.stats.goalsFor - home.stats.goalsAgainst;

    away.stats.goalsFor += awayScore;
    away.stats.goalsAgainst += homeScore;
    away.stats.goalDifference = away.stats.goalsFor - away.stats.goalsAgainst;

    if (homeScore > awayScore) {
      home.stats.points += 3;
      home.stats.wins += 1;
      away.stats.losses += 1;
    } else if (awayScore > homeScore) {
      away.stats.points += 3;
      away.stats.wins += 1;
      home.stats.losses += 1;
    } else {
      home.stats.points += 1;
      away.stats.points += 1;
      home.stats.draws += 1;
      away.stats.draws += 1;
    }
  }

  // Retorna os clubes ordenados por Pontos > Vitórias > Saldo de Gols
  public static getStandings(clubs: Club[]): Club[] {
    return [...clubs].sort((a, b) => {
      if (b.stats.points !== a.stats.points) return b.stats.points - a.stats.points;
      if (b.stats.wins !== a.stats.wins) return b.stats.wins - a.stats.wins;
      return b.stats.goalDifference - a.stats.goalDifference;
    });
  }

  // Simula automaticamente as partidas de outros times na rodada
  public static processOtherMatches(fixtures: Fixture[], userClubId: string): void {
    fixtures.forEach(match => {
      if (!match.played && match.homeTeam.id !== userClubId && match.awayTeam.id !== userClubId) {
        const engine = new MatchEngine(match.homeTeam, match.awayTeam);
        const result = engine.simulate();
        
        match.played = true;
        match.result = { homeScore: result.homeScore, awayScore: result.awayScore };
        this.updateStats(match.homeTeam, match.awayTeam, result.homeScore, result.awayScore);
      }
    });
  }
}
