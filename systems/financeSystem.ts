import { Team } from '../types';

export interface FinancialReport {
  ticketRevenue: number;
  wagesPaid: number;
  netChange: number;
}

// Calcula arrecadação do estádio baseada no prestígio do clube
export const processMatchdayFinances = (homeTeam: Team): { updatedTeam: Team; report: FinancialReport } => {
  const stadiumCapacity = 30000;
  const ticketPrice = 40; // R$ 40 por ingresso
  const attendancePercentage = Math.min(1, (homeTeam.prestige / 100) + (Math.random() * 0.15));

  const attendance = Math.round(stadiumCapacity * attendancePercentage);
  const ticketRevenue = attendance * ticketPrice;

  // Folha de pagamento por rodada (soma dos salários dividida pelas semanas)
  const wagesPaid = homeTeam.squad.reduce((total, p) => total + p.wage, 0);

  const netChange = ticketRevenue - wagesPaid;
  const updatedTeam: Team = {
    ...homeTeam,
    budget: homeTeam.budget + netChange,
  };

  return {
    updatedTeam,
    report: { ticketRevenue, wagesPaid, netChange },
  };
};
