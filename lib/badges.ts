export type BadgeId =
  | 'primer_test_aprobado'
  | 'test_tema1_80'
  | 'cortas_tema1_5_5'
  | 'tema1_completado'
  | 'tema2_desbloqueado'

export type Badge = {
  id: BadgeId
  title: string
  description: string
  category: 'progress' | 'performance'
}

export const BADGES: Record<BadgeId, Badge> = {
  primer_test_aprobado: {
    id: 'primer_test_aprobado',
    title: 'Primer logro',
    description: 'Has aprobado tu primer test.',
    category: 'progress',
  },
  test_tema1_80: {
    id: 'test_tema1_80',
    title: 'Tema 1 dominado',
    description: 'Has superado el test del Tema 1 con al menos un 80%.',
    category: 'performance',
  },
  cortas_tema1_5_5: {
    id: 'cortas_tema1_5_5',
    title: 'Precisión total',
    description: 'Has conseguido 5/5 en las respuestas cortas del Tema 1.',
    category: 'performance',
  },
  tema1_completado: {
    id: 'tema1_completado',
    title: 'Tema 1 completado',
    description: 'Has completado todos los requisitos del Tema 1.',
    category: 'progress',
  },
  tema2_desbloqueado: {
    id: 'tema2_desbloqueado',
    title: 'Nuevo nivel',
    description: 'Has desbloqueado el Tema 2.',
    category: 'progress',
  },
}