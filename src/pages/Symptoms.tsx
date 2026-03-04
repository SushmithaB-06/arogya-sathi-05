import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { analyzeSymptoms, SymptomResult } from "@/lib/symptomAnalyzer";
import VoiceInput from "@/components/VoiceInput";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, AlertTriangle, Home, Pill, ShieldAlert, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const Symptoms = () => {
  const { language, t } = useLanguage();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<SymptomResult | null>(null);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    const res = analyzeSymptoms(input);
    setResult(res);
    setAnalyzed(true);
  };

  const handleVoiceResult = (text: string) => {
    setInput((prev) => (prev ? prev + " " + text : text));
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("checkSymptoms")}</h1>
          <p className="mb-8 text-muted-foreground">{t("disclaimer")}</p>

          {/* Voice Input */}
          <div className="mb-6 flex justify-center">
            <VoiceInput onResult={handleVoiceResult} />
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("typeSymptoms")}
              className="min-h-[120px] resize-none rounded-xl border-border bg-card text-lg"
            />
          </div>

          {/* Analyze Button */}
          <Button
            onClick={handleAnalyze}
            disabled={!input.trim()}
            size="lg"
            className="w-full gap-2 rounded-xl bg-gradient-hero py-6 text-lg text-primary-foreground"
          >
            <Search className="h-5 w-5" />
            {t("analyze")}
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {analyzed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 space-y-6"
            >
              {result ? (
                <>
                  {/* Emergency Alert */}
                  {result.isEmergency && (
                    <div className="pulse-emergency rounded-2xl bg-gradient-emergency p-6 text-emergency-foreground">
                      <div className="flex items-center gap-3 text-xl font-bold">
                        <AlertTriangle className="h-8 w-8" />
                        {t("emergency")}
                      </div>
                      <Link
                        to="/hospitals"
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-card px-4 py-2 font-medium text-emergency"
                      >
                        <MapPin className="h-4 w-4" />
                        {t("findHospital")}
                      </Link>
                    </div>
                  )}

                  {/* Condition */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <h3 className="mb-2 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                      {t("possibleCondition")}
                    </h3>
                    <p className="text-xl font-medium text-foreground">
                      {result.condition[language]}
                    </p>
                  </div>

                  {/* Home Remedies */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Home className="h-5 w-5 text-healing" />
                      {t("homeRemedies")}
                    </h3>
                    <ul className="space-y-2">
                      {result.homeRemedies[language].map((remedy, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-healing" />
                          {remedy}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Medicine */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <Pill className="h-5 w-5 text-accent" />
                      {t("suggestedMedicine")}
                    </h3>
                    <ul className="space-y-2">
                      {result.medicine[language].map((med, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" />
                          {med}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Precautions */}
                  <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                    <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                      <AlertTriangle className="h-5 w-5 text-emergency" />
                      {t("precautions")}
                    </h3>
                    <ul className="space-y-2">
                      {result.precautions[language].map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-foreground">
                          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emergency" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-card">
                  <p className="text-lg text-muted-foreground">
                    {language === "hi"
                      ? "कोई मिलान नहीं मिला। कृपया अपने लक्षण अधिक विस्तार से बताएं।"
                      : language === "kn"
                      ? "ಯಾವುದೇ ಹೊಂದಾಣಿಕೆ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ರೋಗಲಕ್ಷಣಗಳನ್ನು ಹೆಚ್ಚು ವಿವರವಾಗಿ ಹೇಳಿ."
                      : "No matching condition found. Please describe your symptoms in more detail."}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Symptoms;
