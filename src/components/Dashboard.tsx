import React from 'react';
import { Map } from './Map';
import { Header } from './Header';
import { ChatAssistant } from './ChatAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { StatsOverlay } from './StatsOverlay';
import { QuickStats } from './QuickStats';
import { useProvincialData } from '../hooks/useStoreData';

export const Dashboard: React.FC = () => {
  const [activeOverlay, setActiveOverlay] = React.useState<string | null>(null);
  const [showSidebar, setShowSidebar] = React.useState(false);
  const { data, isLoading } = useProvincialData();

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