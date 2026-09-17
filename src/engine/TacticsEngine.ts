import { Club, Player } from '../types/game';

export class TacticsEngine {
  // Valida se o jogador está apto para atuar
  public static isPlayerAvailable(player: Player): boolean {
    return !player.isSuspended && player.injuryRoundsRemaining === 0;
  }

  // Retorna os jogadores aptos do elenco
  public static getAvailableSquad(club: Club): Player[] {
    return club.squad.filter(p => this.isPlayerAvailable(p));
  }

  // Calcula a força média dos titulares ajustada por Energia e Moral
  public static calculateTeamPower(club: Club): number {
    const available = this.getAvailableSquad(club);
    if (available.length === 0) return 50; // Valor base se estiver sem jogadores

    const totalPower = available.reduce((acc, player) => {
      // Modificador de energia (jogadores cansados entregam menos skill)
      const energyModifier = player.energy / 100;
      // Modificador de moral (80% a 120% da habilidade)
      const moralModifier = 0.8 + (player.moral / 100) * 0.4;

      const effectiveSkill = player.skill * energyModifier * moralModifier;
      return acc + effectiveSkill;
    }, 0);

    const basePower = totalPower / available.length;

    // Bônus/Ajuste por postura da tática
    const aggressionBonus = club.tactics.aggression * 0.5;

    return Math.round(basePower + aggressionBonus);
  }

  // Altera a postura/agressividade tática
  public static setTactics(club: Club, formation: '4-4-2' | '4-3-3' | '3-5-2', aggression: number): void {
    club.tactics.formation = formation;
    club.tactics.aggression = Math.min(5, Math.max(1, aggression));
  }
}
