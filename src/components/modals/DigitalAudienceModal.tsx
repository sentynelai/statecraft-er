import React from 'react';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Video, X, TrendingUp } from 'lucide-react';

interface DigitalAudienceModalProps {
  onClose: () => void;
}

export const DigitalAudienceModal: React.FC<DigitalAudienceModalProps> = ({ onClose }) => {
  const platforms = [
    {
      name: 'Facebook',
      label: 'Audiencia Total',
      value: '0.1M',
      trend: '+15%',
      trendLabel: 'vs. mes anterior',
      icon: Facebook,
      color: '#1877F2',
      progress: 30
    },
    {
      name: 'Instagram',
      label: 'Audiencia Total',
      value: '0.1M',
      trend: '+22%',
      trendLabel: 'vs. mes anterior',
      icon: Instagram,
      color: '#E4405F',
      progress: 30
    },
    {
      name: 'Twitter',
      label: 'Audiencia Total',
      value: '0.0M',
      trend: '+8%',
      trendLabel: 'vs. mes anterior',
      icon: Twitter,
      color: '#1DA1F2',
      progress: 15
    },
    {
      name: 'TikTok',
      label: 'Audiencia Total',
      value: '0.1M',
      trend: '+45%',
      trendLabel: 'vs. mes anterior',
      icon: Video,
      color: '#00F2EA',
      progress: 30
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
                    <p className="text-dark-400">{platform.label}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold">{platform.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="w-4 h-4 text-[#00FF9C]" />
                      <span className="text-[#00FF9C]">{platform.trend}</span>
                      <span className="text-dark-400 text-sm">{platform.trendLabel}</span>
                    </div>
                  </div>

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