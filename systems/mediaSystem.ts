import { MatchState, NewsItem } from '../types';

export const generateMatchNews = (match: MatchState): NewsItem => {
  const { homeTeam, awayTeam, homeScore, awayScore } = match;
  const timestamp = `Rodada de Jogo`;

  // Vitória do Mandante
  if (homeScore > awayScore) {
    const isGoleada = homeScore - awayScore >= 3;
    return {
      id: `news-${Date.now()}`,
      timestamp,
      title: isGoleada 
        ? `AMASSOU! ${homeTeam.name} da show e goleia o ${awayTeam.name}`
        : `Vitória com autoridade do ${homeTeam.name}`,
      content: `A torcida comemorou os 3 pontos após o placar de ${homeScore} x ${awayScore}. O treinador elogiou a postura tática.`,
      category: 'MATCH_RESULT',
      sentiment: 'POSITIVE',
    };
  } 
  // Vitória do Visitante
  else if (awayScore > homeScore) {
    return {
      id: `news-${Date.now()}`,
      timestamp,
      title: `Zebra fora de casa! ${awayTeam.name} vence o ${homeTeam.name}`,
      content: `O placar de ${homeScore} x ${awayScore} deixou a torcida do ${homeTeam.name} revoltada na saída do estádio.`,
      category: 'FAN_REACTION',
      sentiment: 'NEGATIVE',
    };
  } 
  // Empate
  else {
    return {
      id: `news-${Date.now()}`,
      timestamp,
      title: `Tudo igual: ${homeTeam.name} ${homeScore} x ${awayScore} ${awayTeam.name}`,
      content: `Um jogo truncado no meio campo que terminou sem vencedores. Ambos os times levam 1 ponto.`,
      category: 'MATCH_RESULT',
      sentiment: 'NEUTRAL',
    };
  }
};
