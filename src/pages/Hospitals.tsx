import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Navigation, Loader2, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hospitals = () => {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mapUrl, setMapUrl] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          // Embed OpenStreetMap with hospitals nearby
          setMapUrl(
            `https://www.openstreetmap.org/export/embed.html?bbox=${loc.lng - 0.05},${loc.lat - 0.05},${loc.lng + 0.05},${loc.lat + 0.05}&layer=mapnik&marker=${loc.lat},${loc.lng}`
          );
          setLoading(false);
        },
        () => {
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  }, []);

  const openHospitalSearch = () => {
    if (userLocation) {
      window.open(
        `https://www.google.com/maps/search/hospital/@${userLocation.lat},${userLocation.lng},14z`,
        "_blank"
      );
    } else {
      window.open("https://www.google.com/maps/search/hospital+near+me", "_blank");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("findHospital")}</h1>
          <p className="mb-6 text-muted-foreground">
            {userLocation ? "📍 Location detected" : loading ? "Getting your location..." : "📍 Enable location to find hospitals"}
          </p>

          {/* Emergency Ambulance Call - Big prominent button */}
          <motion.a
            href="tel:102"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="pulse-emergency mb-8 flex items-center justify-center gap-4 rounded-2xl bg-gradient-emergency p-6 text-emergency-foreground shadow-lg transition-transform active:scale-95"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-card/20 backdrop-blur-sm">
              <Phone className="h-7 w-7" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">🚑 Call Ambulance</div>
              <div className="text-lg opacity-90">Dial 102 — Free Emergency Service</div>
            </div>
          </motion.a>

          {/* Search Hospitals on Map */}
          <Button
            onClick={openHospitalSearch}
            size="lg"
            className="mb-6 w-full gap-2 rounded-xl bg-gradient-hero py-6 text-lg text-primary-foreground"
          >
            <Navigation className="h-5 w-5" />
            🏥 Find Hospitals on Google Maps
            <ExternalLink className="h-4 w-4" />
          </Button>

          {/* Embedded Map */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-card">
            {loading ? (
              <div className="flex h-80 items-center justify-center bg-card">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : mapUrl ? (
              <div className="relative">
                <iframe
                  src={mapUrl}
                  className="h-80 w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Nearby hospitals map"
                />
                <a
                  href={`https://www.openstreetmap.org/?mlat=${userLocation?.lat}&mlon=${userLocation?.lng}#map=14/${userLocation?.lat}/${userLocation?.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg bg-card/90 px-3 py-1.5 text-sm font-medium text-foreground shadow-md backdrop-blur-sm hover:bg-card"
                >
                  <MapPin className="h-3 w-3" />
                  Open Full Map
                </a>
              </div>
            ) : (
              <div className="flex h-80 flex-col items-center justify-center bg-card p-8 text-center">
                <MapPin className="mb-4 h-12 w-12 text-muted-foreground/30" />
                <p className="text-lg font-medium text-muted-foreground">
                  Enable location access to see the map
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You can still search for hospitals using the button above
                </p>
              </div>
            )}
          </div>

          {/* Quick Tips */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 text-lg font-semibold text-foreground">💡 Quick Tips</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">🚑</span>
                <span><strong className="text-foreground">Dial 102</strong> for free government ambulance service anywhere in India</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">🏥</span>
                <span>Visit your nearest <strong className="text-foreground">Primary Health Centre (PHC)</strong> for basic treatment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-xl">📱</span>
                <span>Click the <strong className="text-foreground">"Find Hospitals"</strong> button to see real hospitals near you on the map</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hospitals;
