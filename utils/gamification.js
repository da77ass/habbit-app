// Regras centrais da gamificação do Habbit.
// Cada conquista é desbloqueada uma única vez por conta/sessão.
export const ACHIEVEMENTS = [
  {
    id: 'first_habit',
    title: 'Primeiros passos',
    description: 'Conclua seu primeiro hábito.',
    requirement: 1,
    rewardXp: 20,
    rewardTitle: 'Iniciante',
    icon: 'footsteps-outline',
  },
  {
    id: 'three_habits',
    title: 'Criando consistência',
    description: 'Conclua 3 hábitos diferentes.',
    requirement: 3,
    rewardXp: 30,
    rewardTitle: 'Disciplinado',
    icon: 'medal-outline',
  },
  {
    id: 'five_habits',
    title: 'Em evolução',
    description: 'Conclua 5 hábitos diferentes.',
    requirement: 5,
    rewardXp: 50,
    rewardTitle: 'Mestre dos hábitos',
    icon: 'trophy-outline',
  },
];

export const XP_PER_HABIT = 10;
export const XP_PER_LEVEL = 100;

export function getLevelInfo(xp = 0) {
  const safeXp = Math.max(0, Number(xp) || 0);
  return {
    level: Math.floor(safeXp / XP_PER_LEVEL) + 1,
    xpInLevel: safeXp % XP_PER_LEVEL,
    xpForNextLevel: XP_PER_LEVEL,
    progress: (safeXp % XP_PER_LEVEL) / XP_PER_LEVEL,
  };
}
