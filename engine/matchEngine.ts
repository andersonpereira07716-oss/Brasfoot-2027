import { MatchState, TacticalStyle, Player } from '../types';

const TACTICAL_COUNTERS: Record<TacticalStyle, Record<TacticalStyle, number>> = {
  HIGH_PRESS: { POSSESSION: 1.15, COUNTER_ATTACK: 0.85, PARK_THE_BUS: 1.10, HIGH_PRESS: 1.0 },
  COUNTER_ATTACK: { HIGH_PRESS: 1.20, POSSESSION: 0.90, PARK_THE_BUS: 0.85, COUNTER_ATTACK: 1.0 },
  POSSESSION: { PARK_THE_BUS: 1.15, COUNTER_ATTACK: 1.10, HIGH_PRESS: 0.85, POSSESSION: 1.0 },
  PARK_THE_BUS: { COUNTER_ATTACK: 1.15, HIGH_PRESS: 0.90, POSSESSION: 0.85, PARK_THE_BUS: 1.0 },
};

export const calculateTeamStrength = (squad: Player[], style: TacticalStyle, opponentStyle: TacticalStyle): number => {
  if (squad.length === 0) return 0;
  const totalPower = squad.reduce((acc, player) => {
    const staminaModifier = player.stamina / 100;
    return acc + (player.overall * staminaModifier);
  }, 0);

  const baseStrength = totalPower / squad.length;
  const tacticalModifier = TACTICAL_COUNTERS[style][opponentStyle];
  return baseStrength * tacticalModifier;
};

export const processMatchTick = (currentState: MatchState): MatchState => {
  if (currentState.minute >= 90) {
    return { ...currentState, isFinished: true };
  }

  const nextMinute = currentState.minute + 1;
  const newEvents = [...currentState.events];

  const homePower = calculateTeamStrength(
    currentState.homeTeam.squad,
    currentState.homeTeam.tactics.style,
    currentState.awayTeam.tactics.style
  );

  const awayPower = calculateTeamStrength(
    currentState.awayTeam.squad,
    currentState.awayTeam.tactics.style,
    currentState.homeTeam.tactics.style
  );

  let newHomeScore = currentState.homeScore;
  let newAwayScore = currentState.awayScore;

  const baseGoalChance = 0.035; 
  const totalPower = homePower + awayPower;
  const homeGoalProb = baseGoalChance * (homePower / totalPower);
  const awayGoalProb = baseGoalChance * (awayPower / totalPower);

  const rand = Math.random();

  if (rand < homeGoalProb) {
    newHomeScore++;
    newEvents.push({
      minute: nextMinute,
      type: 'GOAL',
      description: `GOL! ${currentState.homeTeam.name} marca no minuto ${nextMinute}!`,
      teamId: currentState.homeTeam.id,
    });
  } else if (rand < homeGoalProb + awayGoalProb) {
    newAwayScore++;
    newEvents.push({
      minute: nextMinute,
      type: 'GOAL',
      description: `GOL! ${currentState.awayTeam.name} balança as redes no minuto ${nextMinute}!`,
      teamId: currentState.awayTeam.id,
    });
  }

  const decayRateHome = currentState.homeTeam.tactics.style === 'HIGH_PRESS' ? 0.45 : 0.3;
  const decayRateAway = currentState.awayTeam.tactics.style === 'HIGH_PRESS' ? 0.45 : 0.3;

  const updatedHomeSquad = currentState.homeTeam.squad.map(p => ({
    ...p,
    stamina: Math.max(0, p.stamina - decayRateHome)
  }));

  const updatedAwaySquad = currentState.awayTeam.squad.map(p => ({
    ...p,
    stamina: Math.max(0, p.stamina - decayRateAway)
  }));

  return {
    ...currentState,
    minute: nextMinute,
    homeScore: newHomeScore,
    awayScore: newAwayScore,
    events: newEvents,
    homeTeam: { ...currentState.homeTeam, squad: updatedHomeSquad },
    awayTeam: { ...currentState.awayTeam, squad: updatedAwaySquad },
    homeStaminaAvg: updatedHomeSquad.reduce((a, b) => a + b.stamina, 0) / updatedHomeSquad.length,
    awayStaminaAvg: updatedAwaySquad.reduce((a, b) => a + b.stamina, 0) / updatedAwaySquad.length,
    isFinished: nextMinute >= 90,
  };
};
