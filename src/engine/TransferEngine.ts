import { Club, Player } from '../types/game';

export class TransferEngine {
  public static calculateMarketValue(skill: number, age: number, ego: number): number {
    const baseValue = Math.pow(skill, 3) * 15;
    const ageFactor = age < 23 ? 1.4 : age > 30 ? 0.7 : 1.0;
    const egoFactor = 1 + (ego / 200);
    return Math.round(baseValue * ageFactor * egoFactor);
  }

  public static calculateWage(skill: number, ego: number): number {
    const baseWage = Math.pow(skill, 2.3) * 3;
    const egoFactor = 1 + (ego / 100);
    return Math.round(baseWage * egoFactor);
  }

  public static updateWageBill(club: Club): void {
    club.finances.weeklyWageBill = club.squad.reduce((acc, p) => acc + p.wage, 0);
  }

  // Realiza a compra de um jogador de outro clube
  public static buyPlayer(buyer: Club, seller: Club, player: Player): { success: boolean; message: string } {
    if (buyer.finances.balance < player.marketValue) {
      return { success: false, message: '❌ Saldo insuficiente para realizar a contratação!' };
    }

    // Transfere o dinheiro
    buyer.finances.balance -= player.marketValue;
    seller.finances.balance += player.marketValue;

    // Remove do time vendedor e adiciona ao comprador
    seller.squad = seller.squad.filter(p => p.id !== player.id);
    buyer.squad.push(player);

    this.updateWageBill(buyer);
    this.updateWageBill(seller);

    return { 
      success: true, 
      message: `✅ Contratação concluída! ${player.name} assinou com o ${buyer.name} por R$ ${player.marketValue.toLocaleString('pt-BR')}.` 
    };
  }

  // Realiza a venda de um jogador do seu clube para outro
  public static sellPlayer(seller: Club, buyer: Club, player: Player): { success: boolean; message: string } {
    if (seller.squad.length <= 4) {
      return { success: false, message: '❌ Você não pode vender jogadores: elenco atingiu o limite mínimo!' };
    }

    const offerValue = Math.round(player.marketValue * 0.95); // Oferta levemente ajustada

    seller.finances.balance += offerValue;
    buyer.finances.balance -= offerValue;

    seller.squad = seller.squad.filter(p => p.id !== player.id);
    buyer.squad.push(player);

    this.updateWageBill(seller);
    this.updateWageBill(buyer);

    return {
      success: true,
      message: `💰 Venda realizada! ${player.name} foi vendido ao ${buyer.name} por R$ ${offerValue.toLocaleString('pt-BR')}.`
    };
  }

  public static processWeeklyFinances(club: Club, ticketRevenue: number): string {
    this.updateWageBill(club);
    const wageCosts = club.finances.weeklyWageBill;
    const net = ticketRevenue - wageCosts;
    club.finances.balance += net;

    const formattedNet = net >= 0 ? `+R$ ${net.toLocaleString('pt-BR')}` : `-R$ ${Math.abs(net).toLocaleString('pt-BR')}`;
    return `💵 Finanças Semanais | Bilheteria: +R$ ${ticketRevenue.toLocaleString('pt-BR')} | Salários: -R$ ${wageCosts.toLocaleString('pt-BR')} | Saldo: ${formattedNet}`;
  }
}
