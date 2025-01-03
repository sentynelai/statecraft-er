import React from 'react';
import { Users, Facebook, MessageCircle, Chrome, Calendar, Newspaper, X } from 'lucide-react';
import { useProvincialData } from '../../hooks/useProvincialData';
import { calculateTotalPopulation, calculateAudienceTotals } from '../../lib/utils/calculations';
import { getRandomEvents } from '../../lib/utils/events';
import { Modal } from '../ui/Modal';
import { ModalOverlay } from '../ui/ModalOverlay';
import { motion, AnimatePresence } from 'framer-motion';
import { useModalStore } from '../../stores/modalStore';
import { EventCard } from './EventCard';
import { NewsCard } from './NewsCard';

export const InfoModals: React.FC = () => {
  const { data } = useProvincialData();
  const { closeAllModals, isOpen } = useModalStore();
  
  const totalPopulation = calculateTotalPopulation(data);
  const audienceTotals = calculateAudienceTotals(data);
  const randomEvents = getRandomEvents(data);

  const modals = [
    {
      title: 'Demografía',
      icon: Users,
      showCloseButton: true,
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#00FF9C]/20">
              <Users className="w-5 h-5 text-[#00FF9C]" />
            </div>
            <div>
              <p className="text-sm text-dark-400">Población Total</p>
              <p className="text-lg font-semibold">{totalPopulation.toLocaleString('es-AR')}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium mb-4">Audiencia Digital</h3>
            <div className="space-y-4">
              {[
                { name: 'Facebook A', icon: Facebook, color: '#1877F2', value: audienceTotals.fbA },
                { name: 'Facebook B', icon: Facebook, color: '#1877F2', value: audienceTotals.fbB },
                { name: 'Google', icon: Chrome, color: '#4285F4', value: audienceTotals.gmp },
                { name: 'WhatsApp', icon: MessageCircle, color: '#25D366', value: audienceTotals.whatsapp }
              ].map((platform) => (
                <div key={platform.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <platform.icon className="w-4 h-4" style={{ color: platform.color }} />
                      <span>{platform.name}</span>
                    </div>
                    <span>{platform.value.toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-dark-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: platform.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${(platform.value / audienceTotals.total) * 100}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tendencias',
      icon: MessageCircle,
      showCloseButton: false,
      content: (
        <div className="space-y-4">
          <p className="text-dark-400">
            Las publicaciones tratan sobre <strong>seguridad</strong>, <strong>salud pública</strong>, 
            <strong>eventos culturales</strong>, <strong>turismo</strong> y <strong>problemáticas 
            sociales y económicas</strong>, reflejando las principales preocupaciones e intereses 
            de la comunidad.
          </p>
        </div>
      )
    },
    {
      title: 'Eventos',
      icon: Calendar,
      showCloseButton: false,
      content: (
        <div className="space-y-4">
          <p className="text-dark-400">
            Las publicaciones tratan sobre <strong>seguridad</strong>, <strong>salud pública</strong>, 
            <strong>eventos culturales</strong>, <strong>turismo</strong> y <strong>problemáticas 
            sociales y económicas</strong>, reflejando las principales preocupaciones e intereses 
            de la comunidad.
          </p>
          
          {randomEvents.map((event, index) => (
            <EventCard key={index} content={event} index={index} />
          ))}
        </div>
      )
    },
    {
      title: 'Noticias',
      icon: Newspaper,
      showCloseButton: false,
      content: (
        <div className="space-y-4">

          <p className="text-dark-400">
            Las publicaciones tratan sobre <strong>seguridad</strong>, <strong>salud pública</strong>, 
            <strong>eventos culturales</strong>, <strong>turismo</strong> y <strong>problemáticas 
            sociales y económicas</strong>, reflejando las principales preocupaciones e intereses 
            de la comunidad.
          </p>
          
          {data.slice(0, 3).map((dept, index) => (
            <NewsCard key={index} content={dept.conclusiones} index={index} />
          ))}
        </div>
      )
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <ModalOverlay />
          <div className="fixed top-24 left-0 right-0 bottom-4 px-4 z-40 overflow-y-auto">
            <div className="max-w-7xl mx-auto pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modals.map((modal, index) => (
                  <Modal
                    key={modal.title}
                    title={modal.title}
                    icon={modal.icon}
                    onClose={modal.showCloseButton ? closeAllModals : undefined}
                  >
                    {modal.content}
                  </Modal>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};