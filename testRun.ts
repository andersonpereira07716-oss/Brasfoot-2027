import { generateMockTeams } from './mock/mockData';
import { processMatchTick } from './engine/matchEngine';
import { processMatchdayFinances } from './systems/financeSystem';
import { generateMatchNews } from './systems/mediaSystem';
import { MatchState } from './types';

const teams = generateMockTeams();
let homeTeam = teams[0];
let awayTeam = teams[1];

console.log(`\n=== 1. FINANÇAS PRÉ-JOGO ===`);
console.log(`Orçamento inicial do ${homeTeam.name}: R$ ${homeTeam.budget.toLocaleString()}`);

// Simular Partida
let match: MatchState = {
  homeTeam,
  awayTeam,
  homeScore: 0,
  awayScore: 0,
  minute: 0,
  isFinished: false,
  events: [],
  homeStaminaAvg: 100,
  awayStaminaAvg: 100,
};

while (!match.isFinished) {
  match = processMatchTick(match);
}

console.log(`\n=== 2. RESULTADO DA PARTIDA ===`);
console.log(`Placar Final: ${homeTeam.name} ${match.homeScore} x ${match.awayScore} ${awayTeam.name}`);

// Processar Mídia
const news = generateMatchNews(match);
console.log(`\n=== 3. MANCHETE DA IMPRENSA ===`);
console.log(`[${news.category}] ${news.title}`);
console.log(`"${news.content}"`);

// Processar Finanças
const { updatedTeam, report } = processMatchdayFinances(homeTeam);
console.log(`\n=== 4. BALANÇO FINANCEIRO DO MANDANTE ===`);
console.log(`Bilheteria: + R$ ${report.ticketRevenue.toLocaleString()}`);
console.log(`Salários: - R$ ${report.wagesPaid.toLocaleString()}`);
console.log(`Saldo Novo: R$ ${updatedTeam.budget.toLocaleString()}\n`);

