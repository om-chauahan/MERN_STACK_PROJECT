import React from 'react';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = '',
  disabled = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const buttonVariants = {
    hover: {
      scale: disabled ? 1 : 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: disabled ? 1 : 0.95,
      transition: {
        duration: 0.1
      }
    }
  };

  const baseClasses = `btn btn-${variant}${size ? ` btn-${size}` : ''} ${className}`;

  return (
    <motion.button
      className={baseClasses}
      variants={buttonVariants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      disabled={disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default AnimatedButton;
