import * as readline from 'readline';
import { Club, Fixture, Player } from './types/game';
import { MatchEngine } from './engine/MatchEngine';
import { TransferEngine } from './engine/TransferEngine';
import { LeagueEngine } from './engine/LeagueEngine';
import { PlayerConditionEngine } from './engine/PlayerConditionEngine';
import { TacticsEngine } from './engine/TacticsEngine';
import { NewsEngine } from './engine/NewsEngine';
import { SeasonEngine } from './engine/SeasonEngine';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
  return new Promise(resolve => rl.question(query, resolve));
};

const createEmptyStats = () => ({
  points: 0, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0
});

const createPlayer = (id: string, name: string, pos: 'GK'|'DEF'|'MID'|'ATK', skill: number, age: number): Player => {
  return {
    id, name, position: pos, skill, age, energy: 100, moral: 85,
    mental: { ego: 50, pressure: 80, loyalty: 80 },
    marketValue: TransferEngine.calculateMarketValue(skill, age, 50),
    wage: TransferEngine.calculateWage(skill, 50),
    injuryRoundsRemaining: 0,
    yellowCards: 0,
    isSuspended: false
  };
};

// Clubes
const flamengo: Club = {
  id: '1', name: 'Flamengo', finances: { balance: 15000000, weeklyWageBill: 0 }, stats: createEmptyStats(), tactics: { formation: '4-3-3', aggression: 3 },
  squad: [
    createPlayer('1', 'Gabi', 'ATK', 82, 27),
    createPlayer('2', 'Arrascaeta', 'MID', 86, 29),
    createPlayer('3', 'Léo Pereira', 'DEF', 78, 28),
    createPlayer('4', 'Rossi', 'GK', 80, 28)
  ]
};

const palmeiras: Club = {
  id: '2', name: 'Palmeiras', finances: { balance: 20000000, weeklyWageBill: 0 }, stats: createEmptyStats(), tactics: { formation: '4-4-2', aggression: 4 },
  squad: [
    createPlayer('5', 'Estêvão', 'ATK', 84, 17),
    createPlayer('6', 'Veiga', 'MID', 84, 28),
    createPlayer('7', 'Gomez', 'DEF', 85, 31),
    createPlayer('8', 'Weverton', 'GK', 82, 36)
  ]
};

const saoPaulo: Club = {
  id: '3', name: 'São Paulo', finances: { balance: 10000000, weeklyWageBill: 0 }, stats: createEmptyStats(), tactics: { formation: '4-4-2', aggression: 3 },
  squad: [
    createPlayer('9', 'Calleri', 'ATK', 81, 30),
    createPlayer('10', 'Lucas', 'MID', 82, 31),
    createPlayer('11', 'Arboleda', 'DEF', 79, 32),
    createPlayer('12', 'Rafael', 'GK', 78, 34)
  ]
};

const gremio: Club = {
  id: '4', name: 'Grêmio', finances: { balance: 8000000, weeklyWageBill: 0 }, stats: createEmptyStats(), tactics: { formation: '3-5-2', aggression: 4 },
  squad: [
    createPlayer('13', 'Braithwaite', 'ATK', 80, 33),
    createPlayer('14', 'Cristaldo', 'MID', 79, 27),
    createPlayer('15', 'Kannemann', 'DEF', 78, 33),
    createPlayer('16', 'Marchesín', 'GK', 77, 36)
  ]
};

const leagueClubs = [flamengo, palmeiras, saoPaulo, gremio];
leagueClubs.forEach(c => TransferEngine.updateWageBill(c));

const rounds: Fixture[][] = [
  [{ homeTeam: flamengo, awayTeam: palmeiras, played: false }, { homeTeam: saoPaulo, awayTeam: gremio, played: false }],
  [{ homeTeam: gremio, awayTeam: flamengo, played: false }, { homeTeam: palmeiras, awayTeam: saoPaulo, played: false }],
  [{ homeTeam: flamengo, awayTeam: saoPaulo, played: false }, { homeTeam: palmeiras, awayTeam: gremio, played: false }]
];

let currentRoundIndex = 0;

async function handleTransferMarket() {
  console.log('\n====================================================');
  console.log('       🛒 MERCADO DE TRANSFERÊNCIAS');
  console.log('====================================================');
  console.log(`Saldo Disponível: R$ ${flamengo.finances.balance.toLocaleString('pt-BR')}`);
  console.log('[1] Comprar Jogador de Outro Clube');
  console.log('[2] Vender Jogador do Meu Elenco');
  console.log('[0] Voltar ao Menu Principal');

  const opt = await askQuestion('Opção: ');

  if (opt === '1') {
    const availableTargets: { player: Player; seller: Club }[] = [];
    leagueClubs.filter(c => c.id !== flamengo.id).forEach(seller => {
      seller.squad.forEach(player => availableTargets.push({ player, seller }));
    });

    console.log('\n--- JOGADORES DISPONÍVEIS PARA COMPRA ---');
    availableTargets.forEach((item, index) => {
      console.log(`[${index + 1}] ${item.player.name} (${item.player.position}) - ${item.seller.name} | Skill: ${item.player.skill} | Preço: R$ ${item.player.marketValue.toLocaleString('pt-BR')}`);
    });

    const choice = await askQuestion('\nDigite o número do jogador para comprar (ou 0 para cancelar): ');
    const idx = parseInt(choice) - 1;

    if (idx >= 0 && idx < availableTargets.length) {
      const target = availableTargets[idx];
      const result = TransferEngine.buyPlayer(flamengo, target.seller, target.player);
      console.log(`\n${result.message}`);
      if (result.success) {
        NewsEngine.addArticle(currentRoundIndex + 1, `💣 BOMBA NO MERCADO! ${target.player.name} deixa o ${target.seller.name} e fecha com o ${flamengo.name}!`, 'TRANSFER');
      }
    }
  } else if (opt === '2') {
    console.log('\n--- SEUS JOGADORES PARA VENDA ---');
    flamengo.squad.forEach((player, index) => {
      console.log(`[${index + 1}] ${player.name} (${player.position}) | Skill: ${player.skill} | Valor de Mercado: R$ ${player.marketValue.toLocaleString('pt-BR')}`);
    });

    const choice = await askQuestion('\nDigite o número do jogador para vender (ou 0 para cancelar): ');
    const idx = parseInt(choice) - 1;

    if (idx >= 0 && idx < flamengo.squad.length) {
      const playerToSell = flamengo.squad[idx];
      const buyer = leagueClubs.filter(c => c.id !== flamengo.id)[0]; // Vende para um rival da liga
      const result = TransferEngine.sellPlayer(flamengo, buyer, playerToSell);
      console.log(`\n${result.message}`);
      if (result.success) {
        NewsEngine.addArticle(currentRoundIndex + 1, `💸 NEGÓCIO FECHADO! ${flamengo.name} vende ${playerToSell.name} para o ${buyer.name}.`, 'TRANSFER');
      }
    }
  }
}

async function printStandings() {
  console.log('\n====================================================');
  console.log('       📊 TABELA DE CLASSIFICAÇÃO');
  console.log('====================================================');
  console.log('Pos | Time          | Pts | J | V | E | D | GP | GC | SG');
  console.log('----------------------------------------------------');
  
  const standings = LeagueEngine.getStandings(leagueClubs);
  standings.forEach((club, idx) => {
    const s = club.stats;
    const name = club.name.padEnd(13, ' ');
    console.log(` ${idx + 1}º | ${name} |  ${s.points}  | ${s.played} | ${s.wins} | ${s.draws} | ${s.losses} |  ${s.goalsFor} |  ${s.goalsAgainst} | ${s.goalDifference}`);
  });
  console.log('====================================================\n');
}

async function runGameLoop() {
  let running = true;

  while (running) {
    const teamPower = TacticsEngine.calculateTeamPower(flamengo);

    console.log('\n====================================================');
    console.log(`       ⚽ BRASFOOT NEXTGEN - RODADA ${currentRoundIndex + 1}/${rounds.length} ⚽      `);
    console.log('====================================================');
    console.log(` Time: ${flamengo.name} | Força Atual: ${teamPower} | Saldo: R$ ${flamengo.finances.balance.toLocaleString('pt-BR')}`);
    console.log(` Formação: ${flamengo.tactics.formation} | Postura: ${flamengo.tactics.aggression}/5`);
    console.log('----------------------------------------------------');
    console.log(' [1] Jogar Próxima Rodada');
    console.log(' [2] Ver Tabela de Classificação');
    console.log(' [3] Mercado de Transferências');
    console.log(' [4] Ver Elenco & Condição Física');
    console.log(' [5] Ajustar Tática & Formação');
    console.log(' [6] Feed da Imprensa / Notícias');
    console.log(' [0] Sair do Jogo');
    console.log('====================================================');

    const option = await askQuestion('Escolha uma opção: ');

    if (option === '1') {
      if (currentRoundIndex >= rounds.length) {
        console.log('\n🏁 O CAMPEONATO CHEGOU AO FIM!');
        const seasonResult = SeasonEngine.finalizeSeason(leagueClubs);
        seasonResult.summary.forEach(line => console.log(line));
        await printStandings();
        break;
      }

      const currentRound = rounds[currentRoundIndex];
      const roundNumber = currentRoundIndex + 1;
      const userFixture = currentRound.find(f => f.homeTeam.id === flamengo.id || f.awayTeam.id === flamengo.id);

      if (userFixture && !userFixture.played) {
        console.log(`\n🏟️  Partida: ${userFixture.homeTeam.name} vs ${userFixture.awayTeam.name}`);
        const match = new MatchEngine(userFixture.homeTeam, userFixture.awayTeam);
        const result = match.simulate();

        userFixture.played = true;
        userFixture.result = { homeScore: result.homeScore, awayScore: result.awayScore };
        LeagueEngine.updateStats(userFixture.homeTeam, userFixture.awayTeam, result.homeScore, result.awayScore);

        NewsEngine.generateMatchNews(roundNumber, userFixture);

        console.log('\n--- CRONOLOGIA DO JOGO ---');
        result.events.forEach(e => console.log(`[${e.minute}'] ${e.description}`));

        console.log('\n==========================');
        console.log(`PLACAR FINAL: ${userFixture.homeTeam.name} ${result.homeScore} x ${result.awayScore} ${userFixture.awayTeam.name}`);
        console.log('==========================\n');

        leagueClubs.forEach(club => PlayerConditionEngine.processMatchFatigue(club));
        LeagueEngine.processOtherMatches(currentRound, flamengo.id);

        currentRound.forEach(f => {
          if (f !== userFixture) NewsEngine.generateMatchNews(roundNumber, f);
        });

        const isHome = userFixture.homeTeam.id === flamengo.id;
        console.log(TransferEngine.processWeeklyFinances(flamengo, isHome ? 1500000 : 300000));
        
        leagueClubs.forEach(club => PlayerConditionEngine.advanceRound(club));
        currentRoundIndex++;
      }

      await askQuestion('\nPressione ENTER para continuar...');

    } else if (option === '2') {
      await printStandings();
      await askQuestion('Pressione ENTER para continuar...');

    } else if (option === '3') {
      await handleTransferMarket();
      await askQuestion('\nPressione ENTER para continuar...');

    } else if (option === '4') {
      console.log(`\n--- ELENCO DO ${flamengo.name.toUpperCase()} ---`);
      flamengo.squad.forEach(p => {
        let statusStr = 'Disponível';
        if (p.isSuspended) statusStr = '⛔ SUSPENSO';
        else if (p.injuryRoundsRemaining > 0) statusStr = `🚑 LESIONADO (${p.injuryRoundsRemaining} rodadas)`;

        console.log(`• ${p.name.padEnd(12)} (${p.position}) | Skill: ${p.skill} | Energia: ${p.energy}% | Cartões: ${p.yellowCards}🟨 | Status: ${statusStr}`);
      });
      await askQuestion('\nPressione ENTER para continuar...');

    } else if (option === '5') {
      console.log('\n--- AJUSTE TÁTICO ---');
      console.log('Escolha o esquema:\n[1] 4-4-2\n[2] 4-3-3\n[3] 3-5-2');
      const formOpt = await askQuestion('Opção: ');

      let selectedForm: '4-4-2' | '4-3-3' | '3-5-2' = '4-3-3';
      if (formOpt === '1') selectedForm = '4-4-2';
      if (formOpt === '3') selectedForm = '3-5-2';

      const aggStr = await askQuestion('Postura (1 = Defensivo, 3 = Equilibrado, 5 = Ultrafensivo): ');
      const aggNum = parseInt(aggStr) || 3;

      TacticsEngine.setTactics(flamengo, selectedForm, aggNum);
      console.log(`\n✅ Tática atualizada!`);
      await askQuestion('\nPressione ENTER para continuar...');

    } else if (option === '6') {
      console.log('\n====================================================');
      console.log('        📰 IMPRENSA & FEED DE NOTÍCIAS');
      console.log('====================================================');
      const articles = NewsEngine.getLatestNews(5);
      if (articles.length === 0) {
        console.log('Nenhuma notícia relevante publicada ainda.');
      } else {
        articles.forEach(a => {
          console.log(`[${a.dateStr}] [${a.category}] ${a.title}`);
        });
      }
      console.log('====================================================\n');
      await askQuestion('Pressione ENTER para continuar...');

    } else if (option === '0') {
      running = false;
      rl.close();
    }
  }
}

runGameLoop();
