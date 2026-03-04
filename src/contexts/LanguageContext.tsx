import React, { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "hi" | "kn" | "te" | "ta";

interface LanguageOption {
  code: Language;
  label: string;
  nativeLabel: string;
}

export const languages: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English" },
  { code: "hi", label: "Hindi", nativeLabel: "हिन्दी" },
  { code: "kn", label: "Kannada", nativeLabel: "ಕನ್ನಡ" },
  { code: "te", label: "Telugu", nativeLabel: "తెలుగు" },
  { code: "ta", label: "Tamil", nativeLabel: "தமிழ்" },
];

type Translations = Record<string, Record<Language, string>>;

export const translations: Translations = {
  appName: { en: "ArogyaSathi", hi: "आरोग्यसाथी", kn: "ಆರೋಗ್ಯಸಾಥಿ", te: "ఆరోగ్యసాథి", ta: "ஆரோக்யசாதி" },
  tagline: {
    en: "Your Health Companion for Rural India",
    hi: "ग्रामीण भारत के लिए आपका स्वास्थ्य साथी",
    kn: "ಗ್ರಾಮೀಣ ಭಾರತಕ್ಕಾಗಿ ನಿಮ್ಮ ಆರೋಗ್ಯ ಸಂಗಾತಿ",
    te: "గ్రామీణ భారతదేశానికి మీ ఆరోగ్య సహచరుడు",
    ta: "கிராமப்புற இந்தியாவுக்கான உங்கள் சுகாதார தோழன்",
  },
  checkSymptoms: {
    en: "Check Symptoms",
    hi: "लक्षण जांचें",
    kn: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ",
    te: "లక్షణాలను తనిఖీ చేయండి",
    ta: "அறிகுறிகளை சரிபாருங்கள்",
  },
  findHospital: {
    en: "Find Nearby Hospital",
    hi: "पास का अस्पताल खोजें",
    kn: "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆ ಹುಡುಕಿ",
    te: "సమీపంలోని ఆసుపత్రిని కనుగొనండి",
    ta: "அருகிலுள்ள மருத்துவமனையைக் கண்டறியுங்கள்",
  },
  medicineReminder: {
    en: "Medicine Reminder",
    hi: "दवा रिमाइंडर",
    kn: "ಔಷಧ ಜ್ಞಾಪನೆ",
    te: "మందుల రిమైండర్",
    ta: "மருந்து நினைவூட்டல்",
  },
  speakSymptoms: {
    en: "Speak Your Symptoms",
    hi: "अपने लक्षण बोलें",
    kn: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹೇಳಿ",
    te: "మీ లక్షణాలను చెప్పండి",
    ta: "உங்கள் அறிகுறிகளை சொல்லுங்கள்",
  },
  typeSymptoms: {
    en: "Type or speak your symptoms...",
    hi: "अपने लक्षण टाइप करें या बोलें...",
    kn: "ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಟೈಪ್ ಮಾಡಿ ಅಥವಾ ಹೇಳಿ...",
    te: "మీ లక్షణాలను టైప్ చేయండి లేదా చెప్పండి...",
    ta: "உங்கள் அறிகுறிகளை தட்டச்சு செய்யுங்கள் அல்லது சொல்லுங்கள்...",
  },
  analyze: {
    en: "Analyze Symptoms",
    hi: "लक्षणों का विश्लेषण करें",
    kn: "ರೋಗಲಕ್ಷಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    te: "లక్షణాలను విశ్లేషించండి",
    ta: "அறிகுறிகளை ஆய்வு செய்யுங்கள்",
  },
  emergency: {
    en: "⚠️ EMERGENCY: Please visit a hospital immediately!",
    hi: "⚠️ आपातकाल: कृपया तुरंत अस्पताल जाएं!",
    kn: "⚠️ ತುರ್ತು: ದಯವಿಟ್ಟು ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಹೋಗಿ!",
    te: "⚠️ అత్యవసరం: దయచేసి వెంటనే ఆసుపత్రికి వెళ్ళండి!",
    ta: "⚠️ அவசரம்: தயவுசெய்து உடனடியாக மருத்துவமனைக்கு செல்லுங்கள்!",
  },
  home: { en: "Home", hi: "होम", kn: "ಮುಖಪುಟ", te: "హోమ్", ta: "முகப்பு" },
  callHospital: {
    en: "Call Hospital",
    hi: "अस्पताल को कॉल करें",
    kn: "ಆಸ್ಪತ್ರೆಗೆ ಕರೆ ಮಾಡಿ",
    te: "ఆసుపత్రికి కాల్ చేయండి",
    ta: "மருத்துவமனைக்கு அழைக்கவும்",
  },
  possibleCondition: {
    en: "Possible Condition",
    hi: "संभावित स्थिति",
    kn: "ಸಂಭಾವ್ಯ ಸ್ಥಿತಿ",
    te: "సాధ్యమైన పరిస్థితి",
    ta: "சாத்தியமான நிலை",
  },
  homeRemedies: {
    en: "Home Remedies",
    hi: "घरेलू उपचार",
    kn: "ಮನೆ ಮದ್ದು",
    te: "ఇంటి చిట్కాలు",
    ta: "வீட்டு வைத்தியம்",
  },
  suggestedMedicine: {
    en: "Suggested Medicine",
    hi: "सुझाई गई दवा",
    kn: "ಸೂಚಿಸಿದ ಔಷಧ",
    te: "సూచించిన మందు",
    ta: "பரிந்துரைக்கப்பட்ட மருந்து",
  },
  precautions: {
    en: "Precautions",
    hi: "सावधानियां",
    kn: "ಮುನ್ನೆಚ್ಚರಿಕೆಗಳು",
    te: "జాగ్రత్తలు",
    ta: "முன்னெச்சரிக்கைகள்",
  },
  addReminder: {
    en: "Add Reminder",
    hi: "रिमाइंडर जोड़ें",
    kn: "ಜ್ಞಾಪನೆ ಸೇರಿಸಿ",
    te: "రిమైండర్ జోడించండి",
    ta: "நினைவூட்டல் சேர்க்கவும்",
  },
  medicineName: {
    en: "Medicine Name",
    hi: "दवा का नाम",
    kn: "ಔಷಧದ ಹೆಸರು",
    te: "మందు పేరు",
    ta: "மருந்தின் பெயர்",
  },
  time: {
    en: "Time",
    hi: "समय",
    kn: "ಸಮಯ",
    te: "సమయం",
    ta: "நேரம்",
  },
  selectLanguage: {
    en: "Select Language",
    hi: "भाषा चुनें",
    kn: "ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ",
    te: "భాషను ఎంచుకోండి",
    ta: "மொழியை தேர்ந்தெடுக்கவும்",
  },
  listening: {
    en: "Listening...",
    hi: "सुन रहा है...",
    kn: "ಕೇಳುತ್ತಿದೆ...",
    te: "వింటోంది...",
    ta: "கேட்கிறது...",
  },
  heroDescription: {
    en: "Free AI-powered health guidance in your language. Check symptoms, find hospitals, and never miss your medicine.",
    hi: "आपकी भाषा में मुफ्त AI-संचालित स्वास्थ्य मार्गदर्शन। लक्षण जांचें, अस्पताल खोजें, और दवा कभी न भूलें।",
    kn: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಉಚಿತ AI-ಚಾಲಿತ ಆರೋಗ್ಯ ಮಾರ್ಗದರ್ಶನ। ರೋಗಲಕ್ಷಣಗಳನ್ನು ಪರಿಶೀಲಿಸಿ, ಆಸ್ಪತ್ರೆಗಳನ್ನು ಹುಡುಕಿ, ಮತ್ತು ಔಷಧವನ್ನು ಎಂದಿಗೂ ಮರೆಯಬೇಡಿ.",
    te: "మీ భాషలో ఉచిత AI-ఆధారిత ఆరోగ్య మార్గదర్శకత్వం. లక్షణాలను తనిఖీ చేయండి, ఆసుపత్రులను కనుగొనండి, మందులు మర్చిపోకండి.",
    ta: "உங்கள் மொழியில் இலவச AI-இயங்கும் சுகாதார வழிகாட்டுதல். அறிகுறிகளை சரிபாருங்கள், மருத்துவமனைகளைக் கண்டறியுங்கள், மருந்தை மறக்காதீர்கள்.",
  },
  disclaimer: {
    en: "This is not a substitute for professional medical advice. Always consult a doctor for serious conditions.",
    hi: "यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है। गंभीर स्थितियों के लिए हमेशा डॉक्टर से परामर्श करें।",
    kn: "ಇದು ವೃತ್ತಿಪರ ವೈದ್ಯಕೀಯ ಸಲಹೆಗೆ ಪರ್ಯಾಯವಲ್ಲ. ಗಂಭೀರ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಯಾವಾಗಲೂ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    te: "ఇది వృత్తిపరమైన వైద్య సలహాకు ప్రత్యామ్నాయం కాదు. తీవ్రమైన పరిస్థితులకు ఎల్లప్పుడూ వైద్యుడిని సంప్రదించండి.",
    ta: "இது தொழில்முறை மருத்துவ ஆலோசனைக்கு மாற்றாக இல்லை. தீவிர நிலைமைகளுக்கு எப்போதும் மருத்துவரை அணுகுங்கள்.",
  },
  noReminders: {
    en: "No reminders yet. Add your first medicine reminder!",
    hi: "अभी कोई रिमाइंडर नहीं। अपना पहला दवा रिमाइंडर जोड़ें!",
    kn: "ಇನ್ನೂ ಯಾವುದೇ ಜ್ಞಾಪನೆಗಳಿಲ್ಲ. ನಿಮ್ಮ ಮೊದಲ ಔಷಧ ಜ್ಞಾಪನೆಯನ್ನು ಸೇರಿಸಿ!",
    te: "ఇంకా రిమైండర్‌లు లేవు. మీ మొదటి మందుల రిమైండర్‌ను జోడించండి!",
    ta: "இன்னும் நினைவூட்டல்கள் இல்லை. உங்கள் முதல் மருந்து நினைவூட்டலை சேர்க்கவும்!",
  },
  delete: { en: "Delete", hi: "हटाएं", kn: "ಅಳಿಸಿ", te: "తొలగించు", ta: "நீக்கு" },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.["en"] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
