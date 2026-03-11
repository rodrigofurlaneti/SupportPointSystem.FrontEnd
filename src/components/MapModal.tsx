import { X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Customer } from '../schemas/customer.schema';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapModalProps {
  customer: Customer | null;
  onClose: () => void;
}

export function MapModal({ customer, onClose }: MapModalProps) {
  if (!customer) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-800 w-full max-w-2xl rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
        <div className="p-5 border-b border-slate-700 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-black">{customer.companyName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="h-[400px]">
          {customer.latitude && customer.longitude ? (
            <MapContainer
              center={[customer.latitude, customer.longitude]}
              zoom={16}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[customer.latitude, customer.longitude]}>
                <Popup>{customer.companyName}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Coordenadas não disponíveis
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
