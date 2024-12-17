import React, { useState } from 'react';
import { useProvincialData } from '../hooks/useStoreData';
import { motion, AnimatePresence } from 'framer-motion';
import { ConversationModal } from './modals/ConversationModal';
import { DigitalAudienceModal } from './modals/DigitalAudienceModal';
import { PopulationStatsModal } from './modals/PopulationStatsModal';
import { getChatResponse } from '../lib/services/openai';

type ModalType = 'conversations' | 'digital' | 'population' | null;

interface AIResponse {
  type: ModalType;
  content: string;
}

export const HeaderMetrics: React.FC = () => {
  const { data } = useProvincialData();
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [aiResponse, setAIResponse] = useState<AIResponse | null>(null);

  const handleMetricClick = async (type: ModalType) => {
    if (!type) return;
    
    setActiveModal(type);
    
    let prompt = '';
    switch (type) {
      case 'conversations':
        prompt = 'En una sola oración, resume el análisis de conversaciones en Entre Ríos.';
        break;
      case 'digital':
        prompt = 'En una sola oración, resume el alcance digital en Entre Ríos.';
        break;
      case 'population':
        prompt = 'En una sola oración, resume la distribución poblacional de Entre Ríos.';
        break;
    }

    try {
      const response = await getChatResponse(prompt);
      setAIResponse({ type, content: response || '' });
    } catch (error) {
      console.error('Error getting AI response:', error);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setAIResponse(null);
  };

  const metrics = [
    {
      label: 'Conversaciones',
      value: '215,000',
      percentage: 75,
      color: '#00FF9C',
      type: 'conversations' as const
    },
    {
      label: 'Alcance',
      value: '90%',
      percentage: 90,
      color: '#3B82F6',
      type: 'digital' as const
    },
    {
      label: 'Población',
      value: '626,291',
      percentage: 63,
      color: '#8B5CF6',
      type: 'population' as const
    }
  ];

  return (
    <>
      <div className="flex items-center gap-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleMetricClick(metric.type)}
          >
            <div className="relative h-16 w-16">
              <svg className="transform -rotate-90 w-full h-full">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  className="stroke-dark-800"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke={metric.color}
                  strokeWidth="6"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 28 * (1 - metric.percentage / 100) 
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-sm font-medium">{metric.percentage}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-dark-400">{metric.label}</p>
              <p className="text-lg font-semibold">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeModal === 'conversations' && (
          <ConversationModal onClose={handleCloseModal} aiResponse={aiResponse?.content} />
        )}
        {activeModal === 'digital' && (
          <DigitalAudienceModal onClose={handleCloseModal} aiResponse={aiResponse?.content} />
        )}
        {activeModal === 'population' && (
          <PopulationStatsModal onClose={handleCloseModal} aiResponse={aiResponse?.content} />
        )}
      </AnimatePresence>
    </>
  );
};