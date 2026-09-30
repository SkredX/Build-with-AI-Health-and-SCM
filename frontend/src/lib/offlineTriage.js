// Used only when the backend cannot be reached at all (wrong API URL, server down, offline).
// Mirrors the backend's rule-based fallback so the screen still gives the health worker something.
export function offlineTriage(payload) {
  let t = (payload.input_text || '').toLowerCase();

  // If a sample or prescription photo in SVG base64 is provided, decode and extract its text
  if (payload.image_base64 && typeof payload.image_base64 === 'string' && payload.image_base64.includes('base64,')) {
    try {
      const raw = payload.image_base64.split('base64,')[1];
      if (typeof window !== 'undefined' && window.atob) {
        t += ' ' + decodeURIComponent(escape(window.atob(raw))).toLowerCase();
      }
    } catch (_) {}
  }

  let r = {
    condition: 'Condition not identified',
    urgency: 'Low',
    snomed_code: '',
    confidence: 0.5,
    prognosis: 'Further diagnostic evaluation required. Examine vitals and re-evaluate if symptoms persist.',
    symptoms: [],
    medicines: [],
    guidance_hi: 'लक्षण स्पष्ट नहीं हैं। कृपया डॉक्टर से जांच करवाएं।',
    guidance_en: 'No clear clinical pattern found. Examine the patient thoroughly and refer if symptoms worsen.',
    deductions: { heuristic_used: true, offline: true },
  };

  // Snakebite patterns: English, Devanagari Hindi, Romanized Hindi (Hinglish), Rx terms
  if (/snake|venom|viper|cobra|krait|fang|envenom|asv|antivenom|saanp|sanp|saamp|samp|kaata|kata|kaat|kat|dasa|dassa|dhasa|dhas|sarpa|sarp|naag|nag|सांप|साँप|सर्प|नाग|डस|काट/.test(t)) {
    r = {
      condition: "Suspected Snakebite (Envenomation Crisis)",
      urgency: 'CRITICAL EMERGENCY',
      snomed_code: '242635008',
      confidence: 0.94,
      prognosis: 'Critical emergency. High risk of systemic coagulopathy and acute kidney injury if ASV neutralization is delayed beyond 2 hours. Favorable recovery if 10 vials of ASV are infused promptly.',
      symptoms: ['Fang marks / Bite site', 'Local swelling and pain', 'Suspected snake envenomation'],
      medicines: ['Polyvalent Anti-Snake Venom (ASV x10 vials in Normal Saline)', 'Tetanus Toxoid'],
      guidance_hi: 'काटे हुए हिस्से को स्थिर रखें और दिल के स्तर से नीचे रखें। चीरा या कसकर पट्टी (tourniquet) बिल्कुल न लगाएं। तुरंत एम्बुलेंस 108 बुलाएं या नजदीकी अस्पताल ले जाएं।',
      guidance_en: 'Immobilize the bitten limb below heart level with a splint. Do NOT apply tourniquet, suction, or incisions. Transfer to hospital immediately for ASV administration.',
      guidance_regional: {
        hindi: 'काटे हुए हिस्से को स्थिर रखें और दिल के स्तर से नीचे रखें। चीरा या कसकर पट्टी (tourniquet) बिल्कुल न लगाएं। तुरंत नजदीकी अस्पताल ले जाएं।',
        marwari: 'काट्योड़े अंग ने हिलाओ मत, दिल री सीध सूं नीचो राखो। चीरो या कस’र पट्टी मत बांधो, तुरंत अस्पताल ले जावो।',
        bengali: 'কামড়ানো স্থানটি স্থির রাখুন এবং হৃদপিন্ডের নিচে রাখুন। কোনো বাঁধন বা কাটবেন না। অবিলম্বে হাসপাতালে নিয়ে যান।',
        tamil: 'கடித்த பகுதியை அசைக்காமல் இதய மட்டத்திற்கு கீழே வைக்கவும். கயிறு கட்டவோ கீறல் போடவோ கூடாது. உடனடியாக மருத்துவமனைக்கு அழைத்துச் செல்லவும்.',
      },
      deductions: { antivenom: 1, heuristic_used: true, offline: true },
    };
  } else if (/cholera|diarrh|diarrea|vomit|dehydrat|loose\s*motion|rice\s*water|doxycycline|dast|ulti|haiza|pet\s*kharab|kamzori|दस्त|उल्टी|हैजा/.test(t)) {
    r = {
      condition: 'Acute Diarrhoeal Disease / Suspected Cholera',
      urgency: 'EMERGENCY RED',
      snomed_code: '63650001',
      confidence: 0.92,
      prognosis: 'Favorable with rapid rehydration and oral zinc therapy. Risk of hypovolemic shock, severe electrolyte collapse, and acute renal failure within 6-12 hours if fluid replenishment is withheld.',
      symptoms: ['Profuse watery diarrhoea', 'Vomiting', 'Dehydration risk'],
      medicines: ['ORS Sachets x10', 'Zinc Sulfate 20mg', 'IV Ringer Lactate if severe'],
      guidance_hi: 'ओआरएस का घोल थोड़ी-थोड़ी देर में लगातार पिलाते रहें। कमजोरी ज्यादा हो या पानी न पी पाए तो तुरंत अस्पताल ले जाएं।',
      guidance_en: 'Administer ORS frequently in small sips. If patient is severely dehydrated or unable to drink, initiate IV fluids and refer urgently.',
      guidance_regional: {
        hindi: 'ओआरएस का घोल थोड़ी-थोड़ी देर में लगातार पिलाते रहें। कमजोरी ज्यादा हो या पानी न पी पाए तो तुरंत अस्पताल ले जाएं।',
        marwari: 'ओआरएस घोल थोड़ा-थोड़ा लगातार पावो। घणी कमजोरी होवे तो तुरत अस्पताल ले जावो।',
        bengali: 'ঘন ঘন ওআরএস দ্রবণ খাওয়ান। রোগী বেশি দুর্বল হলে অবিলম্বে হাসপাতালে নিয়ে যান।',
        tamil: 'ஓஆர்எஸ் கரைசலை அடிக்கடி கொடுக்கவும். அதிக சோர்வு ஏற்பட்டால் உடனடியாக மருத்துவமனைக்கு கொண்டு செல்லவும்.',
      },
      deductions: { ors: 10, zinc: 14, heuristic_used: true, offline: true },
    };
  } else if (/cough|breath|wheez|asthma|bronch|pneumonia|dyspnea|chest|salbutamol|amoxicillin|khansi|khaansi|saans|sans|balgam|dum|seene|खांसी|सांस|बलगम/.test(t)) {
    r = {
      condition: 'Acute Respiratory Infection / Bronchitis',
      urgency: 'URGENT YELLOW',
      snomed_code: '10509002',
      confidence: 0.90,
      prognosis: 'Favorable prognosis with bronchodilator nebulization and oral antibiotics. Low risk of respiratory failure provided SpO2 is maintained > 92%. Monitor for progression to pneumonia.',
      symptoms: ['Persistent cough', 'Shortness of breath', 'Chest congestion'],
      medicines: ['Amoxicillin 500mg', 'Salbutamol Nebulization/Inhaler', 'Paracetamol 500mg'],
      guidance_hi: 'मरीज का ऑक्सीजन स्तर (SpO2) जांचें। गर्म पानी की भाप दें। यदि सांस लेने में ज्यादा तकलीफ हो तो तुरंत अस्पताल ले जाएं।',
      guidance_en: 'Check oxygen saturation (SpO2). Administer bronchodilator if wheezing. Refer urgently if breathing is labored or SpO2 < 92%.',
      guidance_regional: {
        hindi: 'मरीज का ऑक्सीजन स्तर जांचें। यदि सांस लेने में ज्यादा तकलीफ हो तो तुरंत अस्पताल ले जाएं।',
        marwari: 'ऑक्सीजन जांचो। सांस लेवण में घणी तकलीफ होवे तो तुरत अस्पताल ले जावो।',
        bengali: 'অক্সিজেন পরীক্ষা করুন। শ্বাসকষ্ট বাড়লে দ্রুত হাসপাতালে নিয়ে যান।',
        tamil: 'ஆக்சிஜன் அளவை சோதிக்கவும். மூச்சுத் திணறல் அதிகமானால் உடனடியாக மருத்துவமனைக்கு கொண்டு செல்லவும்.',
      },
      deductions: { amoxicillin: 15, pcm: 3, heuristic_used: true, offline: true },
    };
  } else if (/fever|dengue|malaria|shiver|chills|bukhar|bukhaar|badan\s*dard|sir\s*dard|sar\s*dard|dengu|बुखार|डेंगू|मलेरिया/.test(t)) {
    r = {
      condition: 'Acute Febrile Illness / Suspected Dengue',
      urgency: 'URGENT YELLOW',
      snomed_code: '38362002',
      confidence: 0.88,
      prognosis: 'Good recovery expected with adequate hydration and strict paracetamol fever control. Defervescence phase (days 3-7) carries risk of plasma leakage; platelet counts must be tracked.',
      symptoms: ['High fever', 'Severe body ache', 'Headache'],
      medicines: ['Paracetamol 650mg TDS', 'Oral Rehydration Fluids (ORS)'],
      guidance_hi: 'केवल पैरासिटामोल दें, ब्रूफेन या डिस्प्रिन बिल्कुल न दें। खूब पानी और तरल पदार्थ पिलाएं। प्लेटलेट्स की जांच करवाएं।',
      guidance_en: 'Administer Paracetamol strictly. Contraindicated: Aspirin/Ibuprofen/NSAIDs due to bleeding risk. Encourage plenty of fluids and monitor platelet count.',
      guidance_regional: {
        hindi: 'केवल पैरासिटामोल दें, ब्रूफेन या डिस्प्रिन बिल्कुल न दें। खूब तरल पदार्थ पिलाएं।',
        marwari: 'सिर्फ पैरासिटामोल दीजो, ब्रूफेन या डिस्प्रिन बिल्कुल मत दीजो। खूब पानी पावो।',
        bengali: 'শুধুমাত্র প্যারাসিটামল দিন। অ্যাসপিরিন বা আইবুপ্রোফেন দেবেন না। প্রচুর তরল খাওয়ান।',
        tamil: 'பாராசிட்டமால் மட்டுமே கொடுக்கவும். ஆஸ்பிரின் அல்லது இப்யூபுரூஃபன் கொடுக்கக் கூடாது. நிறைய திரவங்கள் கொடுக்கவும்.',
      },
      deductions: { pcm: 4, ors: 4, heuristic_used: true, offline: true },
    };
  }

  return r;
}
