// src/app/components/common/LocationPicker.jsx
// Uses OpenStreetMap + Leaflet (free, no API key needed)
// Make sure to run: npm install leaflet
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocationContext } from '../../contexts/LocationContext';
import { MapPin, Search, Navigation, X, Check, Loader2, AlertCircle } from 'lucide-react';

export default function LocationPicker({ onClose }) {
  const { location, loading, error, setError, detectLocation, searchLocation, setLocationByCoords } =
    useLocationContext();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [currentLoc, setCurrentLoc] = useState(location);

  const mapEl = useRef(null);
  const mapObj = useRef(null);
  const markerObj = useRef(null);
  const debounce = useRef(null);

  // ── Load Leaflet once ───────────────────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    const initMap = () => {
      if (!mounted || !mapEl.current || mapObj.current) return;
      const L = window.L;

      const lat = currentLoc?.lat ?? 6.9271;
      const lng = currentLoc?.lng ?? 79.8612;

      const map = L.map(mapEl.current, { zoomControl: true }).setView([lat, lng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: '',
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="#3b82f6"/>
          <circle cx="16" cy="16" r="7" fill="white"/>
          <circle cx="16" cy="16" r="4" fill="#3b82f6"/>
        </svg>`,
      });

      if (currentLoc) {
        markerObj.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      }

      map.on('click', async (e) => {
        const { lat: clickLat, lng: clickLng } = e.latlng;
        if (markerObj.current) markerObj.current.setLatLng([clickLat, clickLng]);
        else markerObj.current = L.marker([clickLat, clickLng], { icon: pinIcon }).addTo(map);
        const loc = await setLocationByCoords(clickLat, clickLng);
        setCurrentLoc(loc);
      });

      mapObj.current = map;
      setMapReady(true);
    };

    // Inject CSS once
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    if (window.L) {
      setTimeout(initMap, 100);
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setTimeout(initMap, 100);
      document.head.appendChild(script);
    }

    return () => {
      mounted = false;
      if (mapObj.current) { mapObj.current.remove(); mapObj.current = null; }
    };
  }, []);

  // ── Fly map to coords ───────────────────────────────────────────────────
  const flyTo = useCallback((lat, lng) => {
    if (!mapObj.current || !window.L) return;
    const L = window.L;
    mapObj.current.flyTo([lat, lng], 15, { duration: 1.2 });

    const pinIcon = L.divIcon({
      className: '',
      iconSize: [32, 40],
      iconAnchor: [16, 40],
      html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24s16-14 16-24C32 7.163 24.837 0 16 0z" fill="#3b82f6"/>
        <circle cx="16" cy="16" r="7" fill="white"/>
        <circle cx="16" cy="16" r="4" fill="#3b82f6"/>
      </svg>`,
    });

    if (markerObj.current) markerObj.current.setLatLng([lat, lng]);
    else markerObj.current = L.marker([lat, lng], { icon: pinIcon }).addTo(mapObj.current);
  }, []);

  // ── Debounced search ────────────────────────────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const res = await searchLocation(query);
      setResults(res);
      setSearching(false);
    }, 450);
    return () => clearTimeout(debounce.current);
  }, [query, searchLocation]);

  const pickResult = (r) => {
    setCurrentLoc(r);
    setLocationByCoords(r.lat, r.lng);
    flyTo(r.lat, r.lng);
    setQuery('');
    setResults([]);
  };

  const handleDetect = async () => {
    setDetecting(true);
    setError(null);
    const loc = await detectLocation();
    if (loc) { setCurrentLoc(loc); flyTo(loc.lat, loc.lng); }
    setDetecting(false);
  };

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ maxHeight: '90vh' }}>

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Set Your Location</h2>
              <p className="text-xs text-gray-500">Search, click the map, or use GPS</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="px-4 py-3 border-b flex-shrink-0 relative z-10">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, area, street, landmark..."
                className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 bg-gray-50"
                autoFocus
              />
              {searching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-gray-400" />
              )}
              {query && !searching && (
                <button onClick={() => { setQuery(''); setResults([]); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={handleDetect}
              disabled={detecting}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0"
            >
              {detecting
                ? <Loader2 className="w-4 h-4 animate-spin" />
                : <Navigation className="w-4 h-4" />}
              {detecting ? 'Locating...' : 'Use GPS'}
            </button>
          </div>

          {/* Search dropdown */}
          {results.length > 0 && (
            <div className="absolute left-4 right-4 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-20">
              {results.map((r, i) => (
                <button key={i} onClick={() => pickResult(r)}
                  className="flex items-start gap-3 w-full px-4 py-3 hover:bg-blue-50 text-left transition-colors border-b border-gray-100 last:border-0">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{r.shortAddress}</p>
                    <p className="text-xs text-gray-400 truncate">{r.address}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div className="mx-4 mt-3 flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex-shrink-0">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ── Map ── */}
        <div className="relative flex-1" style={{ minHeight: '300px' }}>
          <div ref={mapEl} className="absolute inset-0" />
          {!mapReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
              <p className="text-sm text-gray-500">Loading map...</p>
            </div>
          )}
          {mapReady && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs text-gray-600 shadow-md pointer-events-none border border-gray-100">
              📍 Click anywhere on the map to pin your location
            </div>
          )}
        </div>

        {/* ── Confirm footer ── */}
        <div className="px-4 py-4 border-t bg-gray-50 flex-shrink-0">
          {location ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {location.shortAddress}
                </p>
                <p className="text-xs text-gray-400 truncate">{location.address}</p>
              </div>
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors flex-shrink-0 shadow-sm"
              >
                <Check className="w-4 h-4" />
                Confirm
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-1">
              Search or click the map to set your location
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
