import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BlocoNotificacoes({ theme, isOpen, onToggle }) {
  const [lembretes, setLembretes] = useState(false);
  const [alertasStreak, setAlertasStreak] = useState(false);
  const [sons, setSons] = useState(false);
  const [vibracao, setVibracao] = useState(false);

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <TouchableOpacity
        style={styles.headerTouch}
        activeOpacity={0.7}
        onPress={onToggle}
      >
        <Text style={[styles.title, { color: theme.title }]}>Notificações</Text>
        <Ionicons
          name={isOpen ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={theme.arrowColor}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>
          <View style={[styles.optionRow, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.optionText, { color: theme.title }]}>Lembretes Diários</Text>
            <Switch
              value={lembretes}
              onValueChange={setLembretes}
              trackColor={{ false: '#9CA3AF', true: '#86C7A5' }}
            />
          </View>

          <View style={[styles.optionRow, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.optionText, { color: theme.title }]}>Alertas de Streak</Text>
            <Switch
              value={alertasStreak}
              onValueChange={setAlertasStreak}
              trackColor={{ false: '#9CA3AF', true: '#86C7A5' }}
            />
          </View>

          <View style={[styles.optionRow, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.optionText, { color: theme.title }]}>Sons de Notificação</Text>
            <Switch
              value={sons}
              onValueChange={setSons}
              trackColor={{ false: '#9CA3AF', true: '#86C7A5' }}
            />
          </View>

          <View style={[styles.optionRow, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.optionText, { color: theme.title }]}>Vibração de Notificação</Text>
            <Switch
              value={vibracao}
              onValueChange={setVibracao}
              trackColor={{ false: '#9CA3AF', true: '#86C7A5' }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
  },
  headerTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});