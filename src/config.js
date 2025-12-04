// Performance Configuration
export const PERFORMANCE = {
  // Snowfall settings
  SNOWFLAKE_COUNT: {
    MIN: window.innerWidth < 768 ? 40 : 80,
    MAX: window.innerWidth < 768 ? 80 : 150,
  },
}

// Feature Flags
export const FEATURES = {
  ENABLE_SNOWFALL: true,
  ENABLE_GAME_FIELD: true,
  ENABLE_DEV_TOOLS: false, // Set to false for production
  ENABLE_ANALYTICS: false,
  RESPECT_REDUCED_MOTION: true,
}
