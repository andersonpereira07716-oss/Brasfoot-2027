import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { generateMockTeams } from './mock/mockData';
import { processMatchTick } from './engine/matchEngine';
import { MatchState } from './types';

export default function App() {
  const [teams] = useState(() => generateMockTeams());
  const [match, setMatch] = useState<MatchState | null>(null);

  const startNewMatch = () => {
    setMatch({
      homeTeam: teams[0],
      awayTeam: teams[1],
      homeScore: 0,
      awayScore: 0,
      minute: 0,
      isFinished: false,
      events: [],
      homeStaminaAvg: 100,
      awayStaminaAvg: 100,
    });
  };

  const simulateTick = () => {
    if (match && !match.isFinished) {
      setMatch(processMatchTick(match));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0f172a', padding: 16 }}>
      <Text style={{ color: '#38bdf8', fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 }}>
        BRASFOOT NEXTGEN
      </Text>

      {!match ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
            {teams[0].name} vs {teams[1].name}
          </Text>
          <TouchableOpacity
            onPress={startNewMatch}
            style={{ backgroundColor: '#10b981', padding: 16, borderRadius: 8, width: '100%', alignItems: 'center' }}
          >
            <Text style={{ color: '#000', fontWeight: 'bold' }}>INICIAR PARTIDA</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ backgroundColor: '#1e293b', padding: 16, borderRadius: 8, alignItems: 'center' }}>
            <Text style={{ color: '#94a3b8' }}>Minuto: {match.minute}'</Text>
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginVertical: 8 }}>
              {match.homeTeam.name} {match.homeScore} x {match.awayScore} {match.awayTeam.name}
            </Text>
          </View>

          <ScrollView style={{ flex: 1, marginVertical: 16 }}>
            {match.events.map((ev, i) => (
              <Text key={i} style={{ color: '#34d399', marginVertical: 4 }}>
                [{ev.minute}'] {ev.description}
              </Text>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={simulateTick}
            disabled={match.isFinished}
            style={{
              backgroundColor: match.isFinished ? '#64748b' : '#3b82f6',
              padding: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>
              {match.isFinished ? 'FIM DE JOGO' : 'AVANÇAR 1 MINUTO'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
