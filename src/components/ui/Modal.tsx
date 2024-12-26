import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ModalProps {
  title: string;
  icon: LucideIcon;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ title, icon: Icon, onClose, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-shrink-0 w-80 glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-[#00FF9C]" />
          <h2 className="font-medium">{title}</h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-dark-800/50 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {children}
    </motion.div>
  );
};