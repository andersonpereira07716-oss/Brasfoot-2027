import { Club, LockerRoomEvent, Player } from '../types/game';

export class LockerRoomEngine {
  // Processa o pós-jogo e ajusta o moral da equipe baseado no resultado
  public static processPostMatch(club: Club, won: boolean, points: number): string[] {
    const news: string[] = [];

    club.squad.forEach(player => {
      // Jogadores com ego elevado sofrem mais impacto emocional nas derrotas
      if (!won) {
        if (player.mental.ego > 70) {
          player.moral = Math.max(0, player.moral - 15);
          news.push(`⚠️  ${player.name} demonstrou irritação no vestiário após a derrota.`);
        } else {
          player.moral = Math.max(0, player.moral - 5);
        }
      } else {
        player.moral = Math.min(100, player.moral + 10);
      }
    });

    return news;
  }

  // Gera um evento aleatório de vestiário/imprensa
  public static generateDynamicEvent(club: Club): LockerRoomEvent | null {
    const highEgoPlayers = club.squad.filter(p => p.mental.ego >= 70);
    
    if (highEgoPlayers.length === 0) return null;

    const starPlayer = highEgoPlayers[Math.floor(Math.random() * highEgoPlayers.length)];

    return {
      id: 'event_ego_1',
      title: '🎙️  Declaração Polêmica na Imprensa',
      description: `${starPlayer.name} deu uma entrevista reclamando do esquema tático e sugerindo que o estilo de jogo limita seu desempenho.`,
      impactPlayerName: starPlayer.name,
      options: [
        {
          label: 'Apoiar o jogador publicamente',
          moralChange: +15,
          egoChange: +5,
          description: 'Você ganha a confiança do astro, mas outros jogadores do elenco podem sentir privilégios.'
        },
        {
          label: 'Repreender internamente e aplicar multa',
          moralChange: -20,
          egoChange: -10,
          description: 'A disciplina é mantida perante o grupo, mas o jogador fica insatisfeito e pede para ser negociado.'
        },
        {
          label: 'Ignorar o assunto e desconversar com a imprensa',
          moralChange: 0,
          egoChange: 0,
          description: 'A poeira baixa temporariamente sem impactar os atributos.'
        }
      ]
    };
  }
}
