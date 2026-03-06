import { useState, useEffect, useRef, useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Plus, Trash2, Clock, Volume2, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  requestNotificationPermission,
  registerServiceWorker,
  startReminderChecker,
} from "@/lib/notificationService";

interface Reminder {
  id: string;
  medicine_name: string;
  time: string;
  active: boolean;
  user_id: string;
}

const Reminders = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [newMedicine, setNewMedicine] = useState("");
  const [newTime, setNewTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const remindersRef = useRef<Reminder[]>([]);

  // Keep ref in sync
  useEffect(() => {
    remindersRef.current = reminders;
  }, [reminders]);

  // Fetch reminders from database
  const fetchReminders = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .order("time");
    if (error) {
      toast.error("Failed to load reminders");
    } else {
      setReminders(data || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  // Setup notifications & service worker
  useEffect(() => {
    const setup = async () => {
      const granted = await requestNotificationPermission();
      setNotifEnabled(granted);
      await registerServiceWorker();
    };
    setup();
  }, []);

  // Start the reminder checker
  useEffect(() => {
    const cleanup = startReminderChecker(
      () => remindersRef.current.map((r) => ({
        medicine: r.medicine_name,
        time: r.time,
        active: r.active,
      })),
      (medicine) => {
        toast.info(`💊 Time to take: ${medicine}`, {
          duration: 15000,
          description: "Tap to dismiss",
          icon: <BellRing className="h-5 w-5 text-primary" />,
        });
      }
    );
    return cleanup;
  }, []);

  const addReminder = async () => {
    if (!newMedicine.trim() || !newTime || !user) return;
    const { data, error } = await supabase
      .from("reminders")
      .insert({ medicine_name: newMedicine.trim(), time: newTime, user_id: user.id })
      .select()
      .single();
    if (error) {
      toast.error("Failed to add reminder");
    } else if (data) {
      setReminders((prev) => [...prev, data]);
      setNewMedicine("");
      setNewTime("");
      toast.success("Reminder added! ✅");
    }
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase.from("reminders").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      setReminders((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const toggleReminder = async (id: string, active: boolean) => {
    const { error } = await supabase.from("reminders").update({ active }).eq("id", id);
    if (!error) {
      setReminders((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
    }
  };

  const testNotification = async () => {
    const granted = await requestNotificationPermission();
    if (!granted) {
      toast.error("Please allow notifications in your browser settings");
      return;
    }
    const { showReminderNotification, playAlarmSound } = await import("@/lib/notificationService");
    showReminderNotification("Test Medicine");
    playAlarmSound();
    toast.success("Test notification sent! 🔔");
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold text-foreground">{t("medicineReminder")}</h1>
          <p className="mb-4 text-muted-foreground">{t("disclaimer")}</p>

          {/* Notification Status */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Volume2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">Alarm Notifications</p>
                <p className="text-xs text-muted-foreground">
                  {notifEnabled ? "Enabled — you'll get alerts" : "Enable to receive medicine alerts"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={testNotification} className="text-xs">
                Test 🔔
              </Button>
              <div className={`h-2.5 w-2.5 rounded-full ${notifEnabled ? "bg-green-500" : "bg-muted-foreground/30"}`} />
            </div>
          </div>

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
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : reminders.length === 0 ? (
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
                    className={`flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-card transition-opacity ${!reminder.active ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${reminder.active ? "bg-gradient-hero" : "bg-muted"}`}>
                        <Bell className={`h-6 w-6 ${reminder.active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="text-lg font-semibold text-foreground">{reminder.medicine_name}</p>
                        <p className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {reminder.time} • Daily
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={reminder.active}
                        onCheckedChange={(checked) => toggleReminder(reminder.id, checked)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteReminder(reminder.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
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
