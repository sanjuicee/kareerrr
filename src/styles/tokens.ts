/**
 * CAREER PILOT — DESIGN SYSTEM TOKENS
 * Technical-Editorial Instrument Aesthetic
 */

export const tokens = {
  colors: {
    // Spatial Backdrops
    bgMidnight: '#080A0D',
    bgSurface: '#0E1217',
    bgElevated: '#151A21',
    bgGlass: 'rgba(14, 18, 23, 0.85)',

    // Hairline Borders & Structural Grids
    borderHairline: 'rgba(255, 255, 255, 0.08)',
    borderSubtle: 'rgba(255, 255, 255, 0.15)',
    borderAccent: 'rgba(0, 240, 180, 0.4)',

    // Typography
    textPrimary: '#F0F4F8',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',

    // Precision Telemetry & Dimension Accents
    accentCyan: '#00F0B4',   // Optimal match, verified facts, primary telemetry
    accentAmber: '#F59E0B',  // Friction points, trade-offs, uncertainty
    accentSky: '#38BDF8',    // Cognitive aptitudes, analytical vectors
    accentIndigo: '#818CF8', // Demonstrated skills, technical competencies
    accentViolet: '#A78BFA', // Work style, environment preferences
    accentRose: '#FB7185',   // Risk tolerance, volatility limits
    accentPink: '#F472B6',   // Values & core intrinsic motivations
    accentEmerald: '#34D399',// Education, credentials, qualifications
    accentPurple: '#C084FC', // Long-term horizon & ambitions
  },

  typography: {
    fontSerif: '"Instrument Serif", Georgia, serif',
    fontSans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontMono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },

  elevation: {
    coreZ: 30,
    activeLayerZ: 25,
    floatingLayerZ: 10,
    backdropZ: 0,
  },

  motion: {
    springFast: { type: 'spring', stiffness: 400, damping: 30 },
    springBalanced: { type: 'spring', stiffness: 260, damping: 25 },
    springGentle: { type: 'spring', stiffness: 180, damping: 22 },
    easeOutExpo: [0.16, 1, 0.3, 1],
  },
} as const;
