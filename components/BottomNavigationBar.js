import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavigationBar({ activeTab = 'Início', onTabPress, themeMode }) {
  const isDarkMode = themeMode !== 'light';
  const theme = isDarkMode ? darkTheme : lightTheme;

  const tabs = [
    { name: 'Início', iconOutline: 'home-outline', iconFilled: 'home' },
    { name: 'Hábitos', iconOutline: 'checkmark-done-outline', iconFilled: 'checkmark-done' },
    { name: 'Novo', iconOutline: 'add-circle-outline', iconFilled: 'add-circle' },
    { name: 'Progresso', iconOutline: 'stats-chart-outline', iconFilled: 'stats-chart' },
    { name: 'Perfil', iconOutline: 'settings-outline', iconFilled: 'settings' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.bg, borderColor: theme.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        const iconName = isActive ? tab.iconFilled : tab.iconOutline;
        const activeColor = theme.active;
        const inactiveColor = theme.inactive;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => onTabPress && onTabPress(tab.name)}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? activeColor : inactiveColor}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isActive ? activeColor : inactiveColor },
                isActive && styles.activeLabel,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const lightTheme = {
  bg: '#FFFFFF',
  border: '#F3F4F6',
  active: '#0F141C',
  inactive: '#9CA3AF',
};

const darkTheme = {
  bg: '#181818',
  border: '#2E2E2E',
  active: '#FFFFFF',
  inactive: '#6B7280',
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 65,
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  activeLabel: {
    fontWeight: 'bold',
  },
});