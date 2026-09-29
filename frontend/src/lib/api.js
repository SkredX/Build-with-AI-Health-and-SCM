const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail || `API Error: ${res.status}`);
  }
  return res.json();
}

export async function submitTriage(triageData) {
  return fetchAPI('/api/triage', {
    method: 'POST',
    body: JSON.stringify(triageData),
  });
}

export async function getForecast(districtId, drugCode = 'ORS', horizon = 30) {
  return fetchAPI(`/api/forecast/${districtId}?drug_code=${drugCode}&horizon=${horizon}`);
}

export async function getAlerts(state = '') {
  const query = state ? `?state=${encodeURIComponent(state)}` : '';
  return fetchAPI(`/api/alerts${query}`);
}

export async function getInventory(filters = {}) {
  const params = new URLSearchParams(filters).toString();
  return fetchAPI(`/api/inventory${params ? '?' + params : ''}`);
}

export async function getInventorySummary() {
  return fetchAPI('/api/inventory/summary');
}

export async function updateStock(phcId, drugCode, data) {
  return fetchAPI(`/api/inventory/${phcId}/${drugCode}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function submitRedistribution(data) {
  return fetchAPI('/api/redistribution', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function generateFHIRBundle(data) {
  return fetchAPI('/api/fhir/bundle', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getGeoJSON(state, includeOutbreaks = true) {
  return fetchAPI(`/api/geojson/${encodeURIComponent(state)}?include_outbreaks=${includeOutbreaks}`);
}

export async function checkHealth() {
  return fetchAPI('/health');
}
