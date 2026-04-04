/**
 * Request notification permission and schedule medicine reminders
 * using the browser Notifications API with service worker.
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;

  const result = await Notification.requestPermission();
  return result === "granted";
}

export function getNotificationPermission(): NotificationPermission | "unsupported" {
  if (!("Notification" in window)) return "unsupported";
  return Notification.permission;
}

interface ReminderSchedule {
  medicine: string;
  dosage: string;
  time: string; // "8:30 AM" etc.
  instruction: string;
}

export function scheduleLocalReminder(reminder: ReminderSchedule) {
  if (Notification.permission !== "granted") return;

  const now = new Date();
  const target = parseTime(reminder.time);
  if (!target || target <= now) return;

  const delay = target.getTime() - now.getTime();

  setTimeout(() => {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "SHOW_NOTIFICATION",
        payload: {
          title: `💊 Time for ${reminder.medicine}`,
          body: `${reminder.dosage} — ${reminder.instruction}`,
          tag: `reminder-${reminder.medicine}-${reminder.time}`,
        },
      });
    } else {
      new Notification(`💊 Time for ${reminder.medicine}`, {
        body: `${reminder.dosage} — ${reminder.instruction}`,
        icon: "/icon-192.png",
      });
    }
  }, delay);
}

function parseTime(timeStr: string): Date | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return null;

  let hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}
