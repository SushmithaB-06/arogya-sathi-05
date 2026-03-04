import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Stethoscope, MapPin, Bell, Heart, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Stethoscope,
      title: t("checkSymptoms"),
      description: t("speakSymptoms"),
      path: "/symptoms",
      gradient: "bg-gradient-hero",
    },
    {
      icon: MapPin,
      title: t("findHospital"),
      description: t("callHospital"),
      path: "/hospitals",
      gradient: "bg-gradient-warm",
    },
    {
      icon: Bell,
      title: t("medicineReminder"),
      description: t("addReminder"),
      path: "/reminders",
      gradient: "bg-gradient-hero",
    },
  ];

  const stats = [
    { icon: Users, value: "500M+", label: "Rural Indians" },
    { icon: Shield, value: "24/7", label: "Health Access" },
    { icon: Heart, value: "5+", label: "Languages" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container relative mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Heart className="h-4 w-4" />
              {t("appName")}
            </div>
            <h1 className="mb-6 text-4xl font-bold leading-tight md:text-6xl">
              <span className="text-gradient-hero">{t("appName")}</span>
            </h1>
            <p className="mb-4 text-xl font-medium text-foreground md:text-2xl">
              {t("tagline")}
            </p>
            <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground md:text-lg">
              {t("heroDescription")}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 flex justify-center gap-8 md:gap-16"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                <div className="text-2xl font-bold text-foreground md:text-3xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="px-4 pb-16">
        <div className="container mx-auto grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * i + 0.3 }}
            >
              <Link to={feature.path} className="group block">
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card transition-all hover:shadow-elevated hover:-translate-y-1">
                  <div
                    className={`mb-5 flex h-14 w-14 items-center justify-center rounded-xl ${feature.gradient}`}
                  >
                    <feature.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-4 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="border-t border-border px-4 py-8">
        <div className="container mx-auto">
          <p className="text-center text-sm text-muted-foreground">
            {t("disclaimer")}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
