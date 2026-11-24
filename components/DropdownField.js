import React, { useState } from 'react';
import {
  Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DropdownField({
  label, value, options, onChange, theme, compact = false,
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <View style={compact ? styles.groupCompact : styles.group}>
      {!!label && <Text style={[styles.label, { color: theme.label }]}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setAberto(true)}
        style={[
          styles.field,
          {
            borderColor: theme.inputBorder,
            backgroundColor: theme.cardBg,
          },
        ]}
      >
        <Text numberOfLines={1} style={[styles.value, { color: theme.inputText }]}>
          {value}
        </Text>
        <Ionicons name="chevron-down" size={17} color={theme.subtitle} />
      </TouchableOpacity>

      <Modal
        visible={aberto}
        transparent
        animationType="fade"
        onRequestClose={() => setAberto(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setAberto(false)}>
          <Pressable
            style={[styles.dialog, { backgroundColor: theme.cardBg, borderColor: theme.inputBorder }]}
            onPress={() => {}}
          >
            <View style={styles.dialogHeader}>
              <Text style={[styles.dialogTitle, { color: theme.title }]}>{label || 'Selecione uma opção'}</Text>
              <TouchableOpacity onPress={() => setAberto(false)} hitSlop={10}>
                <Ionicons name="close" size={23} color={theme.subtitle} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList} keyboardShouldPersistTaps="handled">
              {options.map((option) => {
                const selecionado = option === value;
                return (
                  <TouchableOpacity
                    key={option}
                    onPress={() => { onChange(option); setAberto(false); }}
                    style={[
                      styles.option,
                      selecionado && { backgroundColor: theme.optionSelected || '#16A08522' },
                    ]}
                  >
                    <Text style={[styles.optionText, { color: theme.inputText, fontWeight: selecionado ? '700' : '400' }]}>
                      {option}
                    </Text>
                    {selecionado && <Ionicons name="checkmark" size={19} color={theme.accent || '#16A085'} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: 16 },
  groupCompact: { flex: 1 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  field: {
    minHeight: 48, borderWidth: 1, borderRadius: 12,
    paddingHorizontal: 14, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  value: { flex: 1, fontSize: 14 },
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.58)',
    justifyContent: 'center', alignItems: 'center', padding: 24,
  },
  dialog: {
    width: '100%', maxWidth: 420, maxHeight: '78%',
    borderWidth: 1, borderRadius: 18, padding: 16,
  },
  dialogHeader: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 10,
  },
  dialogTitle: { fontSize: 17, fontWeight: '700' },
  optionsList: { flexGrow: 0 },
  option: {
    minHeight: 46, borderRadius: 10, paddingHorizontal: 12,
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginVertical: 2,
  },
  optionText: { fontSize: 14 },
});
