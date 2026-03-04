import { useState, useCallback } from "react";
import { Mic, MicOff } from "lucide-react";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const langToSpeechCode: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  kn: "kn-IN",
  te: "te-IN",
  ta: "ta-IN",
};

interface VoiceInputProps {
  onResult: (text: string) => void;
}

const VoiceInput = ({ onResult }: VoiceInputProps) => {
  const { language, t } = useLanguage();
  const [isListening, setIsListening] = useState(false);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = langToSpeechCode[language];
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      onResult(text);
    };

    recognition.start();
  }, [language, onResult]);

  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        onClick={startListening}
        variant={isListening ? "destructive" : "default"}
        size="lg"
        className={`gap-2 rounded-full px-6 py-6 text-lg ${
          isListening ? "pulse-emergency" : "bg-gradient-hero text-primary-foreground"
        }`}
      >
        {isListening ? (
          <>
            <MicOff className="h-6 w-6" />
            {t("listening")}
          </>
        ) : (
          <>
            <Mic className="h-6 w-6" />
            {t("speakSymptoms")}
          </>
        )}
      </Button>
    </motion.div>
  );
};

export default VoiceInput;
