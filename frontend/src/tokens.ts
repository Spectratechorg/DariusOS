// Civil Engineering Visualization Design Tokens (from road-design-viz)
export const VIZ_TOKENS = {
  colors: {
    groundExisting: '#8B6F47',       // Existing ground line, muted earth
    gradeFinishedLight: '#0F172A',   // Finished grade in light mode
    gradeFinishedDark: '#F8FAFC',    // Finished grade in dark mode (dominant)
    cut: '#D9534F',                  // Earthworks cut
    cutFill30: 'rgba(217, 83, 79, 0.30)',
    fill: '#2F80ED',                 // Earthworks fill
    fillFill30: 'rgba(47, 128, 237, 0.30)',
    pavementWearing: '#1F2937',      // Wearing course
    pavementBase: '#6B7280',         // Crushed stone base
    pavementSubbase: '#A8A29E',      // Granular subbase
    subgrade: '#8B6F47',             // Compacted subgrade
    contourMinor: '#94A3B8',         // 0.75px contour
    contourIndex: '#475569',         // 1.25px every 5th contour
    rightOfWay: '#64748B',           // Dashed boundary
    flagWarning: '#F59E0B',          // Warning / review required
    flagCritical: '#DC2626',         // Critical out-of-limit
    ok: '#16A34A',                   // Engineering sign-off pass
    gridline: 'rgba(148, 163, 184, 0.12)',
  },
  lineWeights: {
    finishedGrade: 2.5,
    centerline: 2.5,
    existingGround: 1.5,
    curveBoundaries: 1.5,
    indexContours: 1.25,
    rightOfWay: 1.25,
    minorContours: 0.75,
    gridlines: 0.75,
  },
  typography: {
    monoFont: "'JetBrains Mono', 'IBM Plex Mono', monospace",
    sansFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  transitions: {
    layerToggle: 'opacity 180ms cubic-bezier(0.16, 1, 0.3, 1)',
    cardHover: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
  }
} as const;
