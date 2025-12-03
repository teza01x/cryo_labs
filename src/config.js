// Design System Configuration
export const DESIGN = {
  // Grid system
  PIXEL_SIZE: 8,
  CONTAINER_MAX_WIDTH: 1200,

  // Spacing scale (based on 8px grid)
  SPACING: {
    XS: 8,
    SM: 16,
    MD: 24,
    LG: 32,
    XL: 48,
    XXL: 64,
  },

  // Typography
  FONT: {
    MONO: "'JetBrains Mono', 'Courier New', monospace",
    SANS: "'Inter', system-ui, sans-serif",
  },

  // Colors
  COLORS: {
    BG: '#0a0e14',
    BG_LIGHT: '#151a21',
    TEXT: '#e6edf3',
    TEXT_MUTED: '#8b949e',
    ACCENT: '#00d9ff',
    ACCENT_DIM: '#00a8cc',
    ICE: '#a8d8ea',
    BORDER: 'rgba(255,255,255,0.06)',
  },

  // Animation timings
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
  },
}

// Performance Configuration
export const PERFORMANCE = {
  // Canvas settings
  MAX_PARTICLES: 2000,
  PARTICLE_SPAWN_RATE: 0.3,
  FRAME_SKIP: {
    ICE_FLOAT: 3,
    WATER_FLOW: 6,
  },

  // Grid simulation
  CELL_SIZE: 8,
  WATER_LINE_PERCENT: 0.56,

  // Effects
  STEAM_PARTICLES_PER_BURST: 18,
  SMOKE_PARTICLES_PER_BURST: 12,
  SNOWFLAKE_COUNT: {
    MIN: 80,
    MAX: 150,
  },

  // Interaction
  MELT_RADIUS: 8,
  FREEZE_RADIUS: 5,
  HOVER_DEBOUNCE: 16,
}

// Feature Flags
export const FEATURES = {
  ENABLE_SNOWFALL: true,
  ENABLE_GAME_FIELD: true,
  ENABLE_DEV_TOOLS: false, // Set to false for production
  ENABLE_ANALYTICS: false,
  RESPECT_REDUCED_MOTION: true,
}
