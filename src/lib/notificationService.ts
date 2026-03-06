// Notification Service for Medicine Reminders
// Provides alarm-like persistent notifications

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return false;
  }
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    return registration;
  } catch (err) {
    console.error('SW registration failed:', err);
    return null;
  }
}

export function showReminderNotification(medicineName: string) {
  if (Notification.permission !== 'granted') return;

  // Try using service worker notification (persists even when tab is closed)
  navigator.serviceWorker?.ready.then((registration) => {
    registration.showNotification(`💊 Medicine Reminder`, {
      body: `Time to take: ${medicineName}`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [300, 100, 300, 100, 300],
      tag: `reminder-${medicineName}`,
      requireInteraction: true, // Stays until user interacts (like an alarm)
      silent: false,
    });
  }).catch(() => {
    // Fallback to regular notification
    new Notification(`💊 Medicine Reminder`, {
      body: `Time to take: ${medicineName}`,
      icon: '/favicon.ico',
      tag: `reminder-${medicineName}`,
      requireInteraction: true,
    });
  });
}

// Play alarm sound
let audioContext: AudioContext | null = null;

export function playAlarmSound() {
  try {
    audioContext = audioContext || new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;

    oscillator.start();
    // Beep pattern: on-off-on-off-on
    setTimeout(() => { gainNode.gain.value = 0; }, 200);
    setTimeout(() => { gainNode.gain.value = 0.3; }, 400);
    setTimeout(() => { gainNode.gain.value = 0; }, 600);
    setTimeout(() => { gainNode.gain.value = 0.3; }, 800);
    setTimeout(() => {
      oscillator.stop();
      gainNode.disconnect();
    }, 1000);
  } catch (e) {
    console.warn('Could not play alarm sound:', e);
  }
}

// Start the reminder checker interval (runs every 30 seconds for accuracy)
export function startReminderChecker(
  getReminders: () => { medicine: string; time: string; active: boolean }[],
  onTriggered?: (medicine: string) => void
) {
  const triggered = new Set<string>();

  const check = () => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const key = `${currentTime}-${now.toDateString()}`;

    getReminders().forEach((r) => {
      const reminderKey = `${r.medicine}-${key}`;
      if (r.active && r.time === currentTime && !triggered.has(reminderKey)) {
        triggered.add(reminderKey);
        showReminderNotification(r.medicine);
        playAlarmSound();
        onTriggered?.(r.medicine);
      }
    });
  };

  // Check immediately and then every 30 seconds
  check();
  const interval = setInterval(check, 30000);
  return () => clearInterval(interval);
}
