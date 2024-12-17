import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';
import { HeaderMetrics } from './HeaderMetrics';

export const Header: React.FC = () => {
  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 p-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Logo />
        <HeaderMetrics />
      </div>
    </motion.div>
  );
};