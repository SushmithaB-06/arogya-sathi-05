import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Bell, Plus, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface Reminder {
  id: string;
  medicine: string;
  time: string;
  active: boolean;
}

const Reminders = () => {
  const { t } = useLanguage();
  const [reminders, setReminders] = useState<Reminder[]>(() => {
    const saved = localStorage.getItem("arogyasathi-reminders");
    return saved ? JSON.parse(saved) : [];
  });
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("");

  useEffect(() => {
    localStorage.setItem("arogyasathi-reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Check reminders every minute
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      reminders.forEach((r) => {
        if (r.active && r.time === currentTime) {
          toast.info(`💊 ${t("medicineReminder")}: ${r.medicine}`, {
            duration: 10000,
            description: `${t("time")}: ${r.time}`,
          });
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification(`💊 ${t("medicineReminder")}`, { body: r.medicine });
          }
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [reminders, t]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const addReminder = () => {
    if (!newMedicine.trim() || !newTime) return;
    setReminders((prev) => [
      ...prev,
      { id: Date.now().toString(), medicine: newMedicine.trim(), time: newTime, active: true },
    ]);
    setNewMedicine("");
    setNewTime("");
    toast.success(t("addReminder") + " ✅");
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("medicineReminder")}</h1>
          <p className="mb-8 text-muted-foreground">{t("disclaimer")}</p>

          {/* Add Reminder Form */}
          <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Plus className="h-5 w-5 text-primary" />
              {t("addReminder")}
            </h3>
            <div className="space-y-4">
              <Input
                value={newMedicine}
                onChange={(e) => setNewMedicine(e.target.value)}
                placeholder={t("medicineName")}
                className="rounded-xl text-lg"
              />
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="rounded-xl text-lg"
              />
              <Button
                onClick={addReminder}
                disabled={!newMedicine.trim() || !newTime}
                size="lg"
                className="w-full gap-2 rounded-xl bg-gradient-hero py-6 text-lg text-primary-foreground"
              >
                <Bell className="h-5 w-5" />
                {t("addReminder")}
              </Button>
            </div>
          </div>

          {/* Reminders List */}
          {reminders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <Bell className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground">{t("noReminders")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {reminders.map((reminder) => (
                  <motion.div
                    key={reminder.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-hero">
                        <Bell className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{reminder.medicine}</p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {reminder.time}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReminder(reminder.id)}
                      className="text-muted-foreground hover:text-emergency"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reminders;
