import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { AnimatePresence } from 'framer-motion';
import { LocationInfo } from './map/LocationInfo';
import { useProvincialData } from '../hooks/useProvincialData';
import type { LocationData } from '../lib/types/map';

const ENTRE_RIOS_CENTER = { lat: -31.7333, lng: -60.5333 };

export const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const { data: locations, isLoading } = useProvincialData();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  useEffect(() => {
    if (!mapRef.current || isLoading || !locations?.length) return;

    const loader = new Loader({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: 'weekly'
    });

    loader.load().then((google) => {
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new google.maps.Map(mapRef.current!, {
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
      }

      // Clear existing markers
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];

      // Add markers for each location
      locations.forEach(location => {
        const marker = new google.maps.Marker({
          position: { lat: location.lat, lng: location.lng },
          map: mapInstanceRef.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#00FF9C',
            fillOpacity: 0.4,
            strokeWeight: 1,
            strokeColor: '#00FF9C',
            scale: 8
          }
        });

        marker.addListener('click', () => setSelectedLocation(location));
        markersRef.current.push(marker);
      });
    });

    return () => {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    };
  }, [locations, isLoading]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="absolute inset-0" />
      
      <AnimatePresence>
        {selectedLocation && (
          <LocationInfo 
            data={selectedLocation} 
            onClose={() => setSelectedLocation(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};