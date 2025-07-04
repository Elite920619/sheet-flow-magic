
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
    return savedTheme || 'dark'; // Default to ultra-dark mode
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      // Set ultra-dark background
      document.body.style.background = 'linear-gradient(135deg, rgb(2 6 23) 0%, rgb(15 23 42) 50%, rgb(30 41 59) 100%)';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.background = '';
    }

    // Enhanced CSS for ultra-dark mode focus
    const style = document.createElement('style');
    style.innerHTML = `
      .profile-status-hover {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .profile-status-hover:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
      }
      .dark .profile-status-hover:hover {
        box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6);
        background: linear-gradient(135deg, rgb(30 41 59) 0%, rgb(15 23 42) 100%);
      }
      
      /* Ultra-enhanced dark mode scrollbar */
      .dark ::-webkit-scrollbar {
        width: 10px;
      }
      .dark ::-webkit-scrollbar-track {
        background: rgb(2 6 23);
        border-radius: 8px;
      }
      .dark ::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, rgb(30 41 59) 0%, rgb(51 65 85) 100%);
        border-radius: 8px;
        border: 1px solid rgb(15 23 42);
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: linear-gradient(135deg, rgb(51 65 85) 0%, rgb(71 85 105) 100%);
      }
      
      /* Ultra-dark mode selection */
      .dark ::selection {
        background-color: rgb(59 130 246 / 0.4);
        color: rgb(248 250 252);
      }

      /* Premium focus states */
      .dark *:focus-visible {
        outline: 2px solid rgb(59 130 246);
        outline-offset: 2px;
        box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      }

      /* Ultra-premium card hover effects */
      .dark .premium-card {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }
      .dark .premium-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
        background: linear-gradient(135deg, rgb(15 23 42) 0%, rgb(30 41 59) 100%);
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
