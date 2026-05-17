export const ANIMATION = {
  STAGGER_DELAY: 0.08,
  FADE_DURATION: 0.3,
  SLIDE_DURATION: 0.4,
  SCALE_DURATION: 0.3,
  INITIAL_DELAY: 0.05,
  TRANSITION: {
    DEFAULT: 'easeOut',
    SPRING: 'spring',
    ELASTIC: 'elastic',
  }
} as const

export const STAGGER_CHILDREN = {
  HOME: {
    dailyQuote: 0,
    moodCheck: 0.05,
    recommendations: 0.1,
    quickEntries: 0.15,
    psychology: 0.2,
    stats: 0.25,
    progress: 0.3,
  },
  ASSESSMENTS: {
    header: 0,
    hotSection: 0.05,
    categories: 0.1,
    content: 0.15,
  },
  PROFILE: {
    userCard: 0,
    menuSection: 0.05,
    footer: 0.1,
  },
  TRAINING: {
    header: 0,
    tracks: 0.05,
    content: 0.1,
  }
} as const

export const TRANSITION_PRESETS = {
  FAST: { duration: 0.2 },
  NORMAL: { duration: 0.3 },
  SLOW: { duration: 0.4 },
  SPRING: { type: 'spring', stiffness: 300, damping: 30 },
  ELASTIC: { type: 'spring', stiffness: 200, damping: 20 },
} as const
