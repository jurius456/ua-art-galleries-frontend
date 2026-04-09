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

let queue: Array<{ queries: string[]; addressKey: string; resolve: (coords: [number, number] | null) => void }> = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;

  const { queries, addressKey, resolve } = queue.shift()!;

  try {
    const cached = getCachedCoordinates(addressKey);
    if (cached) {
      resolve(cached);
    } else {
      let found: [number, number] | null = null;
      for (const query of queries) {
        if (!query.trim()) continue;
        
        await new Promise(r => setTimeout(r, 1100)); // Respect nominatim limit
        
        const q = encodeURIComponent(query);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${q}&limit=1`);
        
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            found = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
            break; // Stop trying fallbacks
          }
        }
      }
      
      if (found) {
        setCachedCoordinates(addressKey, found);
        resolve(found);
      } else {
        resolve(null);
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

export const sanitizeAndBuildQueries = (address: string, city: string): string[] => {
  const queries: string[] = [];
  if (!address && !city) return queries;

  // Cleanup common Ukrainian abbreviations that confuse Nominatim
  let cleanAddress = address
    .replace(/м\.\s*/ig, '')
    .replace(/місто\s*/ig, '')
    .replace(/Пр\.\s*/ig, 'проспект ')
    .replace(/-?й провулок/ig, ' провулок')
    .trim();

  const cleanCity = city.replace(/м\.\s*/ig, '').trim();

  // Try 1: Exact cleaned address with city and country
  if (cleanAddress && cleanCity && !cleanAddress.includes(cleanCity)) {
    queries.push(`${cleanAddress}, ${cleanCity}, Україна`);
  } else if (cleanAddress) {
    queries.push(`${cleanAddress}, Україна`);
  }

  // Try 2: Address without specific unit numbers (just street and building) if it contains comma or flat numbers
  // This is a basic heuristic. Nominatim sometimes fails on complex building numbers
  const simpleAddress = cleanAddress.split(',')[0].trim();
  if (simpleAddress !== cleanAddress) {
    if (cleanCity && !simpleAddress.includes(cleanCity)) {
       queries.push(`${simpleAddress}, ${cleanCity}, Україна`);
    } else {
       queries.push(`${simpleAddress}, Україна`);
    }
  }

  // Try 3: Just the city, so at least it shows up on the map in the city
  if (cleanCity) {
    queries.push(`${cleanCity}, Україна`);
    queries.push(cleanCity); // English or native fallback without country
  }

  // unique values
  return Array.from(new Set(queries));
};

export const geocodeAddress = (addressKey: string, queries: string[]): Promise<[number, number] | null> => {
  if (!queries || queries.length === 0) return Promise.resolve(null);
  
  const cached = getCachedCoordinates(addressKey);
  if (cached) return Promise.resolve(cached);

  return new Promise((resolve) => {
    queue.push({ queries, addressKey, resolve });
    processQueue();
  });
};
