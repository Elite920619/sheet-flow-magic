
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem('theme') as Theme;
    return savedTheme || 'dark'; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Enhanced CSS for dark mode focus
    const style = document.createElement('style');
    style.innerHTML = `
      .profile-status-hover {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .profile-status-hover:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }
      .dark .profile-status-hover:hover {
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, rgb(51 65 85) 0%, rgb(30 41 59) 100%);
      }
      
      /* Enhanced dark mode scrollbar */
      .dark ::-webkit-scrollbar {
        width: 8px;
      }
      .dark ::-webkit-scrollbar-track {
        background: rgb(15 23 42);
      }
      .dark ::-webkit-scrollbar-thumb {
        background: rgb(51 65 85);
        border-radius: 4px;
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: rgb(71 85 105);
      }
      
      /* Dark mode selection */
      .dark ::selection {
        background-color: rgb(59 130 246 / 0.3);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
