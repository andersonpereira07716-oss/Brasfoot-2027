import { Player, Team, NewsItem } from '../types';

export interface Offer {
  id: string;
  playerId: string;
  buyingTeamId: string;
  sellingTeamId: string;
  amount: number;
}

// Lógica para a IA do clube vendedor aceitar ou recusar
export const evaluateOffer = (
  player: Player,
  offerAmount: number,
  sellerTeam: Team
): { accepted: boolean; reason: string } => {
  // IA exige pelo menos 100% do valor de mercado (ajustado pelo tempo de contrato)
  const contractMultiplier = player.contractMonthsLeft < 12 ? 0.8 : 1.1;
  const minimumAcceptable = player.marketValue * contractMultiplier;

  if (offerAmount >= minimumAcceptable) {
    return { accepted: true, reason: 'Proposta aceita! O valor atende às expectativas da diretoria.' };
  } else {
    return { accepted: false, reason: `Proposta recusada. O clube exige pelo menos R$ ${Math.round(minimumAcceptable).toLocaleString()}` };
  }
};

// Processa a transferência concluída
export const executeTransfer = (
  player: Player,
  buyer: Team,
  seller: Team,
  amount: number
): { updatedBuyer: Team; updatedSeller: Team; news: NewsItem } => {
  const updatedBuyerSquad = [...buyer.squad, player];
  const updatedSellerSquad = seller.squad.filter((p) => p.id !== player.id);

  const updatedBuyer: Team = {
    ...buyer,
    budget: buyer.budget - amount,
    squad: updatedBuyerSquad,
  };

  const updatedSeller: Team = {
    ...seller,
    budget: seller.budget + amount,
    squad: updatedSellerSquad,
  };

  const news: NewsItem = {
    id: `trans-${Date.now()}`,
    timestamp: 'Mercado de Transferências',
    title: `NEGÓCIO FECHADO! ${player.name} assina com o ${buyer.name}`,
    content: `A transferência foi concluída por R$ ${(amount / 1000000).toFixed(2)}M vindo do ${seller.name}.`,
    category: 'TRANSFER',
    sentiment: 'POSITIVE',
  };

  return { updatedBuyer, updatedSeller, news };
};
