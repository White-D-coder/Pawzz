"use client";

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import { io } from 'socket.io-client';

// Fix for default marker icons in Leaflet with Next.js/Webpack
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationIcon = (color: string) => L.divIcon({
  className: 'custom-div-icon',
  html: `
    <div style="position: relative; width: 12px; height: 12px;">
      <div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.3); position: relative; z-index: 2;"></div>
      <div class="pulse-ring" style="border: 2px solid ${color};"></div>
    </div>
  `,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

interface MapComponentProps {
  listings: any[];
  volunteers: any[];
}

export default function MapComponent({ listings, volunteers }: MapComponentProps) {
  useEffect(() => {
    // Reset any existing leaflet state if needed
  }, []);

  return (
    <div className="w-full h-full rounded-[2.5rem] overflow-hidden shadow-cloud border-4 border-white">
      <MapContainer 
        center={[20.5937, 78.9629]} // Center of India
        zoom={5} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Listings (Clinics, NGOs) */}
        {listings.map((item) => (
          <Marker 
            key={item._id} 
            position={[item.location.coords.coordinates[1], item.location.coords.coordinates[0]]}
            icon={DefaultIcon}
          >
            <Popup className="custom-popup">
              <div className="p-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{item.type === 'clinic' ? '🏥' : '🐾'}</span>
                  <div>
                    <h4 className="font-bold text-teal-900 leading-tight">{item.name}</h4>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{item.type}</span>
                  </div>
                </div>
                {item.imageUrl && (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                )}
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm font-bold text-teal-700">₹{item.price}</span>
                  <a href={`/directory?search=${item.name}`} className="text-xs font-black text-amber-600 underline">View Details</a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Volunteers */}
        {volunteers.map((v) => (
          <Marker 
            key={v._id} 
            position={[v.location.coordinates[1], v.location.coordinates[0]]}
            icon={LocationIcon(v.isCityLead ? '#F59E0B' : '#10B981')}
          >
            <Popup>
              <div className="p-2 text-center">
                <div className="text-3xl mb-1">{v.isCityLead ? '⭐' : '🤝'}</div>
                <h4 className="font-bold text-gray-900">{v.formData.fullName}</h4>
                <p className="text-[10px] font-bold text-teal-700 uppercase tracking-widest mb-2">
                  {v.isCityLead ? 'City Lead' : 'Active Volunteer'}
                </p>
                <p className="text-xs text-gray-500 font-medium">{v.formData.city}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #f0fdfa !important;
        }
        .pulse-ring {
          position: absolute;
          top: -4px;
          left: -4px;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          animation: pulse-animation 2s infinite;
          opacity: 0;
          z-index: 1;
        }
        @keyframes pulse-animation {
          0% {
            transform: scale(0.5);
            opacity: 0.8;
          }
          100% {
            transform: scale(2.5);
            opacity: 0;
          }
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1.5rem !important;
          padding: 0 !important;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
        }
        .custom-popup .leaflet-popup-content {
          margin: 0 !important;
          width: 200px !important;
        }
      `}</style>
    </div>
  );
}
