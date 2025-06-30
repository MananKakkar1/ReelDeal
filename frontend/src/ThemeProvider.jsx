import React, { createContext, useContext, useState, useMemo } from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';
import { lightTheme, darkTheme, defaultTheme } from './theme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(defaultTheme);
  const isDark = theme === darkTheme;

  const toggleTheme = () => setTheme(isDark ? lightTheme : darkTheme);

  const value = useMemo(() => ({ theme, isDark, toggleTheme }), [theme, isDark]);

  return (
    <ThemeContext.Provider value={value}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
} 