import { Club, MatchResult, MatchEvent, Player } from '../types/game';

export class MatchEngine {
  private home: Club;
  private away: Club;
  private events: MatchEvent[] = [];

  constructor(homeTeam: Club, awayTeam: Club) {
    this.home = homeTeam;
    this.away = awayTeam;
  }

  private calculateSectorPower(squad: Player[], position: 'DEF' | 'MID' | 'ATK'): number {
    const players = squad.filter(p => p.position === position);
    if (players.length === 0) return 30;

    const totalPower = players.reduce((acc, p) => {
      const multiplier = (p.energy / 100) * 0.7 + (p.moral / 100) * 0.3;
      return acc + p.skill * multiplier;
    }, 0);

    return totalPower / players.length;
  }

  public simulate(): MatchResult {
    let homeScore = 0;
    let awayScore = 0;
    let homeShots = 0;
    let awayShots = 0;
    let homeFouls = 0;
    let awayFouls = 0;

    const homeBonus = 1.05;

    const homeMid = this.calculateSectorPower(this.home.squad, 'MID') * homeBonus;
    const awayMid = this.calculateSectorPower(this.away.squad, 'MID');

    const homeAtk = this.calculateSectorPower(this.home.squad, 'ATK') * homeBonus;
    const awayAtk = this.calculateSectorPower(this.away.squad, 'ATK');

    const homeDef = this.calculateSectorPower(this.home.squad, 'DEF') * homeBonus;
    const awayDef = this.calculateSectorPower(this.away.squad, 'DEF');

    for (let minute = 1; minute <= 90; minute++) {
      const possessionRoll = Math.random() * (homeMid + awayMid);
      const homeHasPossession = possessionRoll < homeMid;

      const attackingTeam = homeHasPossession ? this.home : this.away;
      const defPower = homeHasPossession ? awayDef : homeDef;
      const atkPower = homeHasPossession ? homeAtk : awayAtk;

      if (Math.random() < 0.12) {
        if (homeHasPossession) homeShots++; else awayShots++;

        const goalProbability = (atkPower / (atkPower + defPower)) * 0.35;
        
        if (Math.random() < goalProbability) {
          const scorers = attackingTeam.squad.filter(p => p.position === 'ATK' || p.position === 'MID');
          const scorer = scorers[Math.floor(Math.random() * scorers.length)] || attackingTeam.squad[0];

          if (homeHasPossession) homeScore++; else awayScore++;

          this.events.push({
            minute,
            type: 'GOAL',
            teamId: attackingTeam.id,
            playerInvolved: scorer.name,
            description: `⚽ GOL do ${attackingTeam.name}! ${scorer.name} balança as redes!`
          });
        }
      }

      if (Math.random() < 0.05) {
        if (homeHasPossession) awayFouls++; else homeFouls++;
        if (Math.random() < 0.15) {
          const defendingTeam = homeHasPossession ? this.away : this.home;
          const defender = defendingTeam.squad[Math.floor(Math.random() * defendingTeam.squad.length)];
          this.events.push({
            minute,
            type: 'YELLOW_CARD',
            teamId: defendingTeam.id,
            playerInvolved: defender.name,
            description: `🟨 Cartão Amarelo para ${defender.name} (${defendingTeam.name}).`
          });
        }
      }
    }

    return {
      homeScore,
      awayScore,
      events: this.events,
      stats: { homeShots, awayShots, homeFouls, awayFouls }
    };
  }
}
