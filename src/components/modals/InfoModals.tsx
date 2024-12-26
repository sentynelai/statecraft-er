import React, { useRef } from 'react';
import { Users, Facebook, MessageSquare, Calendar, Newspaper, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useProvincialData } from '../../hooks/useProvincialData';
import { calculateTotalPopulation, calculateAudienceTotals } from '../../lib/utils/calculations';
import { Modal } from '../ui/Modal';
import { motion } from 'framer-motion';
import { useModalStore } from '../../stores/modalStore';

export const InfoModals: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data } = useProvincialData();
  const { closeAllModals } = useModalStore();
  
  const totalPopulation = calculateTotalPopulation(data);
  const audienceTotals = calculateAudienceTotals(data);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const modals = [
    {
      title: 'Demografía',
      icon: Users,
      showCloseButton: true, // Only the first modal will have the close button
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
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook A</span>
                </div>
                <span>{audienceTotals.fbA.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Facebook className="w-4 h-4 text-blue-400" />
                  <span>Facebook B</span>
                </div>
                <span>{audienceTotals.fbB.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>GMP</span>
                <span>{audienceTotals.gmp.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>WhatsApp</span>
                <span>{audienceTotals.whatsapp.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tendencias',
      icon: MessageSquare,
      showCloseButton: false,
      content: (
        <p className="text-dark-400">
          Las tendencias actuales muestran un crecimiento significativo en la participación 
          ciudadana y el uso de plataformas digitales para la comunicación gubernamental.
        </p>
      )
    },
    {
      title: 'Eventos',
      icon: Calendar,
      showCloseButton: false,
      content: (
        <p className="text-dark-400">
          Próximamente se realizarán diversos eventos culturales y sociales en toda la 
          provincia, fomentando la integración y el desarrollo comunitario.
        </p>
      )
    },
    {
      title: 'Noticias',
      icon: Newspaper,
      showCloseButton: false,
      content: (
        <p className="text-dark-400">
          Las últimas noticias destacan importantes avances en infraestructura y 
          desarrollo social en diferentes departamentos de la provincia.
        </p>
      )
    }
  ];

  return (
    <div className="fixed top-24 left-0 right-0 px-4">
      <div className="relative max-w-7xl mx-auto">
        <button
          onClick={() => handleScroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 bg-dark-900/90 rounded-full backdrop-blur-sm z-10 hover:bg-dark-800/90 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        >
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

        <button
          onClick={() => handleScroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 bg-dark-900/90 rounded-full backdrop-blur-sm z-10 hover:bg-dark-800/90 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};