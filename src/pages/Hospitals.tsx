import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Phone, Navigation, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Hospital {
  name: string;
  address: string;
  phone: string;
  distance: string;
  lat: number;
  lng: number;
}

const defaultHospitals: Hospital[] = [
  { name: "Primary Health Centre", address: "Village Main Road", phone: "108", distance: "2 km", lat: 12.9716, lng: 77.5946 },
  { name: "Community Health Centre", address: "Block Headquarters", phone: "102", distance: "8 km", lat: 12.9816, lng: 77.6046 },
  { name: "District Hospital", address: "District Town", phone: "104", distance: "25 km", lat: 12.9916, lng: 77.6146 },
  { name: "Government General Hospital", address: "City Center", phone: "112", distance: "40 km", lat: 13.0016, lng: 77.6246 },
];

const Hospitals = () => {
  const { t } = useLanguage();
  const [hospitals] = useState<Hospital[]>(defaultHospitals);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const openInMaps = (hospital: Hospital) => {
    const url = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${hospital.lat},${hospital.lng}`
      : `https://www.google.com/maps/search/hospital+near+me`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("findHospital")}</h1>
          <p className="mb-6 text-muted-foreground">
            {userLocation ? "📍 Location detected" : loading ? "Getting your location..." : "📍 Location not available"}
          </p>

          {/* Search nearby button */}
          <Button
            onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")}
            size="lg"
            className="mb-8 w-full gap-2 rounded-xl bg-gradient-hero py-6 text-lg text-primary-foreground"
          >
            <Navigation className="h-5 w-5" />
            {t("findHospital")}
          </Button>

          {/* Emergency numbers */}
          <div className="mb-8 rounded-2xl bg-gradient-emergency p-6 text-emergency-foreground">
            <h3 className="mb-3 text-lg font-bold">🚨 Emergency Numbers</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Ambulance", number: "108" },
                { label: "Emergency", number: "112" },
                { label: "Health Helpline", number: "104" },
                { label: "Women Helpline", number: "181" },
              ].map((em) => (
                <a
                  key={em.number}
                  href={`tel:${em.number}`}
                  className="flex items-center gap-2 rounded-lg bg-card/20 px-3 py-2 font-medium backdrop-blur-sm transition-colors hover:bg-card/30"
                >
                  <Phone className="h-4 w-4" />
                  {em.label}: {em.number}
                </a>
              ))}
            </div>
          </div>

          {/* Hospital List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {hospitals.map((hospital, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-card"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{hospital.name}</h3>
                      <p className="text-sm text-muted-foreground">{hospital.address}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                      {hospital.distance}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={`tel:${hospital.phone}`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      <Phone className="h-4 w-4" />
                      {t("callHospital")}
                    </a>
                    <button
                      onClick={() => openInMaps(hospital)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-medium text-foreground transition-colors hover:bg-secondary"
                    >
                      <MapPin className="h-4 w-4" />
                      Map
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Hospitals;
