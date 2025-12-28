// App Color Palette
// Primary: #8B0000 (Dark Red)
// Secondary colors derived from primary

export const colors = {
  // Primary Colors
  primary: '#8B0000', // Dark Red
  primaryDark: '#660000', // Darker shade
  primaryLight: '#B30000', // Lighter shade
  
  // Secondary Colors (derived from primary)
  secondary: '#FF6B35', // Warm Orange - complements dark red
  secondaryDark: '#E55A2B', // Darker orange
  secondaryLight: '#FF8C5A', // Lighter orange
  
  // Accent Colors
  accent: '#FFD700', // Gold accent
  accentDark: '#CCAA00',
  accentLight: '#FFE44D',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Semantic Colors
  success: '#4CAF50',
  successLight: '#81C784',
  successDark: '#388E3C',
  
  error: '#F44336',
  errorLight: '#E57373',
  errorDark: '#D32F2F',
  
  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',
  
  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
  // Background Colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F5F5',
  backgroundDark: '#121212',
  
  // Text Colors
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#9E9E9E',
  textInverse: '#FFFFFF',
  
  // Border Colors
  border: '#E0E0E0',
  borderLight: '#F5F5F5',
  borderDark: '#BDBDBD',
  
  // Shadow Colors
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Overlay Colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Color helper functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Export default colors object
export default colors;

