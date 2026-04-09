export const getCachedCoordinates = (address: string): [number, number] | null => {
  try {
    const cached = localStorage.getItem(`geocode_${address}`);
    if (cached) {
      const data = JSON.parse(cached);
      // Cache valid for 30 days
      if (Date.now() - data.timestamp < 30 * 24 * 60 * 60 * 1000) {
        return data.coords;
      }
    }
  } catch (e) {
    // Ignore cache errors
  }
  return null;
};

export const setCachedCoordinates = (address: string, coords: [number, number]) => {
  try {
    localStorage.setItem(
      `geocode_${address}`,
      JSON.stringify({ coords, timestamp: Date.now() })
    );
  } catch (e) {
    // Ignore cache errors
  }
};

let queue: Array<{ address: string; resolve: (coords: [number, number] | null) => void }> = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { address, resolve } = queue.shift()!;

  try {
    // Check cache again just in case
    const cached = getCachedCoordinates(address);
    if (cached) {
      resolve(cached);
    } else {
      // Small delay to respect Nominatim limits (max 1 req/sec)
      await new Promise(r => setTimeout(r, 1100));

      const query = encodeURIComponent(address);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
      
      if (!response.ok) {
        resolve(null);
      } else {
        const data = await response.json();
        if (data && data.length > 0) {
          const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
          setCachedCoordinates(address, coords);
          resolve(coords);
        } else {
          resolve(null);
        }
      }
    }
  } catch (e) {
    console.error('Geocoding error:', e);
    resolve(null);
  }

  isProcessing = false;
  
  if (queue.length > 0) {
    processQueue();
  }
};

export const geocodeAddress = (address: string): Promise<[number, number] | null> => {
  if (!address) return Promise.resolve(null);
  
  const cached = getCachedCoordinates(address);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    queue.push({ address, resolve });
    processQueue();
  });
};
