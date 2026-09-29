class TranslationService:
    def __init__(self):
        self.hardcoded_translations = {
            "rest": {
                "hi": "आराम करें",
                "bn": "বিশ্রাম নিন",
                "ta": "ஓய்வு எடுங்கள்",
                "mr": "विश्राम करा"
            },
            "drink water": {
                "hi": "पानी पिएं",
                "bn": "জল পান করুন",
                "ta": "தண்ணீர் குடிக்கவும்",
                "mr": "पाणी प्या"
            }
        }

    def translate_clinical_guidance(self, text: str, source_lang: str, target_langs: list[str]) -> dict[str, str]:
        results = {}
        text_lower = text.lower()
        for lang in target_langs:
            # Fallback naive dictionary translation for common terms
            translated_parts = []
            for word in ["rest", "drink water"]:
                if word in text_lower:
                    translated_parts.append(self.hardcoded_translations[word].get(lang, text))
            
            if translated_parts:
                results[lang] = ", ".join(translated_parts)
            else:
                results[lang] = f"[Translated to {lang}]: {text}" # Mock fallback
        
        return results
