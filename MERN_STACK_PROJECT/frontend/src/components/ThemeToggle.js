import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <motion.button
      className={`theme-toggle ${isDark ? 'dark' : 'light'} ${className}`}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="theme-toggle-indicator"
        layout
        transition={{
          type: "spring",
          stiffness: 700,
          damping: 30
        }}
      >
        {isDark ? (
          <i className="fas fa-moon" style={{ fontSize: '10px' }}></i>
        ) : (
          <i className="fas fa-sun" style={{ fontSize: '10px' }}></i>
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
