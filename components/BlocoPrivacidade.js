import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BlocoPrivacidade({ theme, isOpen, onToggle, onLogout }) {
  const [biometria, setBiometria] = useState(false);
  const [ocultarDados, setOcultarDados] = useState(false);

  const confirmarExclusao = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: onLogout },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <TouchableOpacity
        style={styles.headerTouch}
        activeOpacity={0.7}
        onPress={onToggle}
      >
        <Text style={[styles.title, { color: theme.title }]}>Privacidade</Text>
        <Ionicons
          name={isOpen ? 'chevron-down' : 'chevron-forward'}
          size={18}
          color={theme.arrowColor}
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.content}>

          <View style={[styles.optionRow, { backgroundColor: theme.subOptionBg }]}>
            <Text style={[styles.optionText, { color: theme.title }]}>Ocultar Dados Sensíveis</Text>
            <Switch
              value={ocultarDados}
              onValueChange={setOcultarDados}
              trackColor={{ false: '#9CA3AF', true: '#86C7A5' }}
            />
          </View>

          <TouchableOpacity
            style={[styles.deleteBtn, { backgroundColor: theme.subOptionBg }]}
            activeOpacity={0.7}
            onPress={confirmarExclusao}
          >
            <Text style={styles.deleteText}>Excluir Conta</Text>
          </TouchableOpacity>
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
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 4,
  },
  deleteText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 14,
  },
});