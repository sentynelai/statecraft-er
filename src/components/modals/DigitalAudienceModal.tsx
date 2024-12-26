import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, MessageSquare, Users, X } from 'lucide-react';
import { useProvincialData } from '../../hooks/useProvincialData';
import { calculateAudienceTotals } from '../../lib/utils/calculations';

interface DigitalAudienceModalProps {
  onClose: () => void;
  aiResponse?: string;
}

export const DigitalAudienceModal: React.FC<DigitalAudienceModalProps> = ({ onClose, aiResponse }) => {
  const { data } = useProvincialData();
  const audienceTotals = calculateAudienceTotals(data);

  const platforms = [
    {
      name: 'Facebook A',
      value: audienceTotals.fbA,
      icon: Facebook,
      color: '#1877F2',
      progress: (audienceTotals.fbA / audienceTotals.total) * 100
    },
    {
      name: 'Facebook B',
      value: audienceTotals.fbB,
      icon: Facebook,
      color: '#1877F2',
      progress: (audienceTotals.fbB / audienceTotals.total) * 100
    },
    {
      name: 'GMP',
      value: audienceTotals.gmp,
      icon: MessageSquare,
      color: '#00FF9C',
      progress: (audienceTotals.gmp / audienceTotals.total) * 100
    },
    {
      name: 'WhatsApp',
      value: audienceTotals.whatsapp,
      icon: Users,
      color: '#25D366',
      progress: (audienceTotals.whatsapp / audienceTotals.total) * 100
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-950/90 rounded-xl w-full max-w-4xl border border-dark-800/50 backdrop-blur-xl"
      >
        <div className="p-6 flex justify-between items-center border-b border-dark-800/50">
          <h2 className="text-2xl font-bold">Audiencia Digital</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platforms.map((platform, index) => (
              <motion.div
                key={platform.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-dark-800/30 rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${platform.color}20` }}
                  >
                    <platform.icon 
                      className="w-6 h-6"
                      style={{ color: platform.color }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{platform.name}</h3>
                    <p className="text-dark-400">Audiencia Total</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-3xl font-bold">
                    {platform.value.toLocaleString('es-AR')}
                  </p>

                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${platform.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: platform.color }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};