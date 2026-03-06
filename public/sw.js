// Service Worker for Medicine Reminder Notifications
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Listen for messages from the main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_REMINDER') {
    const { medicine, time, id } = event.data;
    // Store reminder info
    self.reminderData = self.reminderData || {};
    self.reminderData[id] = { medicine, time };
  }
  if (event.data && event.data.type === 'REMOVE_REMINDER') {
    if (self.reminderData) {
      delete self.reminderData[event.data.id];
    }
  }
});

// Check reminders every minute via periodic background sync or setInterval
// Since service workers can't use setInterval reliably, we use the 'periodicsync' event
// Fallback: the main app will post messages to trigger notifications

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      if (clients.length > 0) {
        clients[0].focus();
      } else {
        self.clients.openWindow('/reminders');
      }
    })
  );
});

// Handle push events for future server-side push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || '💊 Medicine Reminder', {
      body: data.body || 'Time to take your medicine!',
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [300, 100, 300, 100, 300],
      tag: 'medicine-reminder',
      requireInteraction: true,
      actions: [
        { action: 'taken', title: '✅ Taken' },
        { action: 'snooze', title: '⏰ Snooze 10min' },
      ],
    })
  );
});
