// src/app/components/common/LocationBar.jsx
import { useState } from 'react';
import { MapPin, ChevronDown, Loader2 } from 'lucide-react';
import { useLocationContext } from '../../contexts/LocationContext';
import LocationPicker from './LocationPicker';

export default function LocationBar() {
  const { location, loading } = useLocationContext();
  const [open, setOpen] = useState(false);

  const displayText = location
    ? (location.shortAddress || location.city || 'Location set')
    : 'Set your location';

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 transition-all group max-w-xs"
        title={location?.address || 'Set your location'}
      >
        {loading
          ? <Loader2 className="w-4 h-4 text-blue-500 animate-spin flex-shrink-0" />
          : <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
        }
        <span className="text-sm font-medium text-gray-800 truncate max-w-[200px]">
          {displayText}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 group-hover:text-blue-500 transition-colors" />
      </button>

      {open && <LocationPicker onClose={() => setOpen(false)} />}
    </>
  );
}
