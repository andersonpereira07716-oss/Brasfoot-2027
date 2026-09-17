import { Club, Player } from '../types/game';

export class PlayerConditionEngine {
  // Processa o desgaste físico após um jogo
  public static processMatchFatigue(club: Club): void {
    club.squad.forEach(player => {
      if (!player.isSuspended && player.injuryRoundsRemaining === 0) {
        // Reduz energia baseada em fadiga (ex: 10 a 20 pontos por jogo)
        const fatigue = Math.floor(Math.random() * 11) + 10; 
        player.energy = Math.max(0, player.energy - fatigue);

        // Risco de lesão se a energia estiver muito baixa (< 40)
        if (player.energy < 40) {
          const injuryChance = Math.random();
          if (injuryChance < 0.25) { // 25% de chance de lesão se cansado
            const duration = Math.floor(Math.random() * 3) + 1; // 1 a 3 rodadas
            player.injuryRoundsRemaining = duration;
          }
        }
      }
    });
  }

  // Avança a rodada: recupera energia dos descansados, reduz tempo de lesão e limpa suspensões
  public static advanceRound(club: Club): void {
    club.squad.forEach(player => {
      // Limpa suspensão automática da rodada anterior
      if (player.isSuspended) {
        player.isSuspended = false;
      }

      // Se estiver lesionado, reduz a contagem de rodadas restantes
      if (player.injuryRoundsRemaining > 0) {
        player.injuryRoundsRemaining -= 1;
      }

      // Recuperação de energia semanal (30 a 40 pontos)
      const recovery = Math.floor(Math.random() * 11) + 30;
      player.energy = Math.min(100, player.energy + recovery);
    });
  }

  // Aplica cartão amarelo/vermelho a um jogador e checa suspensão
  public static applyDisciplining(player: Player, isRedCard: boolean): string {
    if (isRedCard) {
      player.isSuspended = true;
      return `🔴 ${player.name} recebeu cartão vermelho e está suspenso para o próximo jogo!`;
    }

    player.yellowCards += 1;
    if (player.yellowCards % 3 === 0) {
      player.isSuspended = true;
      return `🟨 ${player.name} recebeu o 3º cartão amarelo e está suspenso para a próxima rodada!`;
    }

    return `🟨 ${player.name} recebeu cartão amarelo (${player.yellowCards} no total).`;
  }
}
