// src/app/contexts/LocationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  const [location, setLocationState] = useState(() => {
    try {
      const saved = localStorage.getItem('fixmate_location');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist to localStorage on every change
  useEffect(() => {
    if (location) localStorage.setItem('fixmate_location', JSON.stringify(location));
    else localStorage.removeItem('fixmate_location');
  }, [location]);

  const buildLocation = (data, lat, lng) => ({
    lat,
    lng,
    address: data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
    shortAddress: [
      data.address?.road || data.address?.suburb || data.address?.neighbourhood,
      data.address?.city || data.address?.town || data.address?.village,
    ].filter(Boolean).join(', ') || data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    city: data.address?.city || data.address?.town || data.address?.village || data.address?.county || '',
    district: data.address?.state_district || data.address?.county || '',
    country: data.address?.country || '',
    postcode: data.address?.postcode || '',
  });

  // Reverse geocode a lat/lng
  const reverseGeocode = useCallback(async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const data = await res.json();
      return buildLocation(data, lat, lng);
    } catch {
      return {
        lat, lng,
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        shortAddress: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: '', district: '', country: '', postcode: '',
      };
    }
  }, []);

  // Use browser GPS
  const detectLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return null;
    }
    setLoading(true);
    setError(null);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async ({ coords }) => {
          const loc = await reverseGeocode(coords.latitude, coords.longitude);
          setLocationState(loc);
          setLoading(false);
          resolve(loc);
        },
        (err) => {
          setLoading(false);
          setError(
            err.code === 1 ? 'Location permission denied. Please allow access in your browser.'
            : err.code === 2 ? 'Unable to determine location. Try searching manually.'
            : 'Location request timed out.'
          );
          resolve(null);
        },
        { timeout: 10000, enableHighAccuracy: true }
      );
    });
  }, [reverseGeocode]);

  // Search by text query
  const searchLocation = useCallback(async (query) => {
    if (!query?.trim()) return [];
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'en' } }
      );
      const results = await res.json();
      return results.map((r) => buildLocation(r, parseFloat(r.lat), parseFloat(r.lon)));
    } catch { return []; }
  }, []);

  // Set location by coords (e.g. map click)
  const setLocationByCoords = useCallback(async (lat, lng) => {
    setLoading(true);
    const loc = await reverseGeocode(lat, lng);
    setLocationState(loc);
    setLoading(false);
    return loc;
  }, [reverseGeocode]);

  const setLocation = useCallback((loc) => setLocationState(loc), []);
  const clearLocation = useCallback(() => setLocationState(null), []);

  return (
    <LocationContext.Provider value={{
      location, loading, error, setError,
      detectLocation, searchLocation,
      setLocationByCoords, setLocation, clearLocation,
    }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
  return ctx;
}
