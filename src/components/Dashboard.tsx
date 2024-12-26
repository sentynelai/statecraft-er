import React, { useState } from 'react';
import { Map } from './Map';
import { Header } from './Header';
import { ChatAssistant } from './ChatAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsOverlay } from './StatsOverlay';
import { InfoModals } from './modals/InfoModals';
import { useProvincialData } from '../hooks/useProvincialData';
import { useModalStore } from '../stores/modalStore';

export const Dashboard: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = React.useState<string | null>(null);
  const { data: provincialData } = useProvincialData();
  const { isOpen } = useModalStore();

  return (
    <div className="h-screen bg-dark-950 overflow-hidden relative">
      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        <Map />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Header onOverlayChange={setActiveOverlay} />
      </div>

      {/* Info Modals */}
      <AnimatePresence>
        {isOpen && (
          <div className="relative z-20">
            <InfoModals />
          </div>
        )}
      </AnimatePresence>

      {/* Stats Overlay */}
      <AnimatePresence>
        {activeOverlay && (
          <StatsOverlay 
            type={activeOverlay as 'population' | 'digital' | 'conversations'} 
            onClose={() => setActiveOverlay(null)} 
          />
        )}
      </AnimatePresence>

      {/* Chat Assistant */}
      <ChatAssistant />
    </div>
  );
};