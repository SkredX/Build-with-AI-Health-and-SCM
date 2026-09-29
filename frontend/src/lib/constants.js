export const INDIAN_STATES = [
  'Rajasthan', 'Maharashtra', 'Kerala', 'Tamil Nadu', 'West Bengal',
  'Uttar Pradesh', 'Bihar', 'Karnataka', 'Madhya Pradesh', 'Assam',
  'Gujarat', 'Odisha', 'Andhra Pradesh', 'Telangana', 'Punjab',
  'Haryana', 'Jharkhand', 'Chhattisgarh', 'Uttarakhand', 'Himachal Pradesh',
];

export const URGENCY_LEVELS = {
  'CRITICAL EMERGENCY': { color: 'rose', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'EMERGENCY RED': { color: 'rose', bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
  'URGENT YELLOW': { color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
  'ROUTINE': { color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
};

export const STATUS_CONFIG = {
  Critical: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', dot: 'bg-rose-500' },
  Warning: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  Operational: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  Optimal: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
};

export const DRUG_CATEGORIES = [
  { code: 'ORS', name: 'ORS Sachets', unit: 'packets', reorderLevel: 50 },
  { code: 'ZINC', name: 'Zinc Sulfate 20mg', unit: 'tablets', reorderLevel: 100 },
  { code: 'PCM', name: 'Paracetamol 500mg', unit: 'tablets', reorderLevel: 100 },
  { code: 'AMOX', name: 'Amoxicillin 500mg', unit: 'capsules', reorderLevel: 50 },
  { code: 'ASV', name: 'Polyvalent Anti-Snake Venom', unit: 'vials', reorderLevel: 5 },
  { code: 'SAL', name: 'Salbutamol Nebules', unit: 'nebules', reorderLevel: 20 },
  { code: 'DOX', name: 'Doxycycline 100mg', unit: 'capsules', reorderLevel: 50 },
  { code: 'IFA', name: 'Iron Folic Acid', unit: 'tablets', reorderLevel: 200 },
  { code: 'MET', name: 'Metformin 500mg', unit: 'tablets', reorderLevel: 100 },
  { code: 'AML', name: 'Amlodipine 5mg', unit: 'tablets', reorderLevel: 100 },
];

export const DISPATCH_MODES = [
  { value: 'ambulance_108', label: 'Ambulance 108 Return Leg', eta: '45 mins' },
  { value: 'cold_van', label: 'District Vaccine Cold-Van', eta: '1.2 hrs' },
  { value: 'drone', label: 'Rapid Drone Delivery (NHM Pilot)', eta: '22 mins' },
];

export const INPUT_MODES = [
  { value: 'audio', label: 'Voice Memo', icon: 'mic' },
  { value: 'image', label: 'Rx Photo OCR', icon: 'file-image' },
  { value: 'text', label: 'Clinical Notes', icon: 'pen-line' },
];

export const SPEECH_LANGUAGES = [
  { code: 'hi-IN', label: 'HI/Marwari', short: 'HI' },
  { code: 'bn-IN', label: 'Bengali', short: 'BN' },
  { code: 'ta-IN', label: 'Tamil', short: 'TA' },
  { code: 'en-IN', label: 'English', short: 'EN' },
];
