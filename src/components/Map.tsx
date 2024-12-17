import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useProvincialData } from '../hooks/useStoreData';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, School, Building2, MessageSquare, Signal, X } from 'lucide-react';

const ENTRE_RIOS_CENTER = { lat: -31.7333, lng: -60.5333 };

interface LocationData {
  departamento: string;
  poblacion: number;
  escuelas: number;
  hospitales: number;
  conversations: {
    total: number;
    topics: { name: string; count: number }[];
  };
  social: {
    reach: number;
    engagement: number;
  };
}

interface InfoBoxProps {
  data: LocationData;
  onClose: () => void;
}

const InfoBox: React.FC<InfoBoxProps> = ({ data, onClose }) => (
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
        <h2 className="text-2xl font-bold">{data.departamento}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-dark-800/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Demographics */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00FF9C]/20">
                <Users className="w-5 h-5 text-[#00FF9C]" />
              </div>
              <div>
                <p className="text-sm text-dark-400">Población</p>
                <p className="text-lg font-semibold">{data.poblacion.toLocaleString('es-AR')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <School className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-dark-400">Escuelas</p>
                <p className="text-lg font-semibold">{data.escuelas}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-dark-400">Hospitales</p>
                <p className="text-lg font-semibold">{data.hospitales}</p>
              </div>
            </div>
          </div>

          {/* Conversations */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <MessageSquare className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-dark-400">Conversaciones</p>
                <p className="text-lg font-semibold">{data.conversations.total.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              {data.conversations.topics.map((topic, index) => (
                <div key={topic.name} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="text-dark-400">{topic.name}</span>
                    <span>{topic.count}</span>
                  </div>
                  <motion.div 
                    className="h-1 bg-dark-800 rounded-full overflow-hidden"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <motion.div
                      className="h-full bg-orange-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(topic.count / data.conversations.total) * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Reach */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Signal className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-dark-400">Alcance Digital</p>
                <p className="text-lg font-semibold">{(data.social.reach / 1000).toFixed(1)}K</p>
              </div>
            </div>
            <div className="p-4 bg-dark-800/30 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-dark-400">Engagement</span>
                <span className="text-green-500">{data.social.engagement}%</span>
              </div>
              <motion.div 
                className="h-2 bg-dark-800 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
              >
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${data.social.engagement}%` }}
                  transition={{ duration: 1 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const { data: provincialData, isLoading } = useProvincialData();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    if (!mapRef.current || isLoading) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    });

    loader.load().then((google) => {
      const map = new google.maps.Map(mapRef.current!, {
        center: ENTRE_RIOS_CENTER,
        zoom: 8,
        styles: [
          {
            featureType: "all",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#ffffff" }, { weight: 1 }]
          },
          {
            featureType: "landscape",
            elementType: "geometry",
            stylers: [{ color: "#222222" }]
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#111111" }]
          }
        ],
        disableDefaultUI: true,
        zoomControl: true
      });

      provincialData.forEach(dept => {
        const marker = new google.maps.Marker({
          position: { lat: dept.lat, lng: dept.lng },
          map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#00FF9C',
            fillOpacity: 0.4,
            strokeWeight: 1,
            strokeColor: '#00FF9C',
            scale: 8
          }
        });

        marker.addListener('click', () => {
          const mockData: LocationData = {
            ...dept,
            conversations: {
              total: Math.floor(Math.random() * 5000) + 1000,
              topics: [
                { name: 'Educación', count: Math.floor(Math.random() * 1000) + 200 },
                { name: 'Salud', count: Math.floor(Math.random() * 800) + 150 },
                { name: 'Transporte', count: Math.floor(Math.random() * 600) + 100 }
              ]
            },
            social: {
              reach: Math.floor(Math.random() * 50000) + 10000,
              engagement: Math.floor(Math.random() * 40) + 20
            }
          };
          setSelectedLocation(mockData);
        });
      });
    });
  }, [provincialData, isLoading]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />
      
      <AnimatePresence>
        {selectedLocation && (
          <InfoBox 
            data={selectedLocation} 
            onClose={() => setSelectedLocation(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};