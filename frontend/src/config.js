// frontend/src/config.js
export const USE_MOCK_DATA = false; // Make sure this is false
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log("⚙️ Config loaded:");
console.log("   API_URL:", API_URL);
console.log("   USE_MOCK_DATA:", USE_MOCK_DATA);