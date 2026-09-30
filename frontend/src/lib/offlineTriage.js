// Used only when the backend cannot be reached at all (wrong API URL, server down, offline).
// Mirrors the backend's rule-based fallback so the screen still gives the health worker something.
export function offlineTriage(payload) {
  const t = (payload.input_text || '').toLowerCase();
  let r = {
    condition: 'Not identified from notes',
    urgency: 'Low',
    symptoms: [],
    medicines: [],
    guidance_en: 'No clear pattern found. Examine the patient and refer if symptoms worsen.',
  };
  if (/cholera|diarrh|diarrea|vomit|dehydrat|दस्त/.test(t)) {
    r = { condition: 'Diarrhoea with dehydration', urgency: 'High', symptoms: ['Diarrhoea', 'Dehydration'], medicines: ['ORS', 'Zinc'], guidance_en: 'Give ORS in small frequent sips. Refer urgently if the patient cannot drink or is very weak.' };
  } else if (/snake|venom|सांप/.test(t)) {
    r = { condition: 'Snakebite', urgency: 'Critical', symptoms: ['Bite marks', 'Swelling'], medicines: ['Anti-snake venom'], guidance_en: 'Keep the limb still and below heart level. Transfer to a hospital immediately.' };
  } else if (/cough|breath|wheez|खांसी/.test(t)) {
    r = { condition: 'Respiratory infection', urgency: 'Medium', symptoms: ['Cough', 'Shortness of breath'], medicines: ['Paracetamol'], guidance_en: 'Check oxygen level. Refer if breathing is difficult or SpO2 is below 94%.' };
  } else if (/fever|dengue|बुखार/.test(t)) {
    r = { condition: 'Fever, possible dengue', urgency: 'Medium', symptoms: ['Fever', 'Body ache'], medicines: ['Paracetamol'], guidance_en: 'Give paracetamol only (no aspirin or ibuprofen). Encourage fluids and check platelets.' };
  }
  return {
    ...r,
    snomed_code: '',
    confidence: 0.5,
    guidance_hi: '',
    guidance_regional: {},
    deductions: { heuristic_used: true, offline: true },
  };
}
