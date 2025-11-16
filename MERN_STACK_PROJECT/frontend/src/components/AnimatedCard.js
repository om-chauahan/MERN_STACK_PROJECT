import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  delay = 0, 
  hoverable = true,
  ...props 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: delay,
        ease: "easeOut"
      }
    }
  };

  const hoverVariants = hoverable ? {
    hover: {
      y: -5,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.98
    }
  } : {};

  return (
    <motion.div
      className={`card hover-lift ${className}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hoverable ? "hover" : undefined}
      whileTap={hoverable ? "tap" : undefined}
      {...hoverVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
