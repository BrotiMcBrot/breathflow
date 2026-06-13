import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type ReminderSlot = 'morning' | 'noon' | 'evening';
export const REMINDER_TIMES: Record<ReminderSlot, { hour: number; minute: number }> = {
  morning: { hour: 8, minute: 0 },
  noon: { hour: 13, minute: 0 },
  evening: { hour: 20, minute: 0 },
};

export async function ensureNotificationPermissions(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('reminders', {
        name: 'Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }
    const { status } = await Notifications.getPermissionsAsync();
    if (status === 'granted') return true;
    const req = await Notifications.requestPermissionsAsync();
    return req.status === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleReminder(slot: ReminderSlot, title: string, body: string) {
  try {
    const { hour, minute } = REMINDER_TIMES[slot];
    await Notifications.cancelScheduledNotificationAsync(`breathflow-${slot}`).catch(() => {});
    await Notifications.scheduleNotificationAsync({
      identifier: `breathflow-${slot}`,
      content: { title, body, sound: false },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour, minute,
        channelId: Platform.OS === 'android' ? 'reminders' : undefined,
      } as Notifications.DailyTriggerInput,
    });
  } catch (e) {
    // scheduling not available (e.g. Expo Go limitations) — fail silently
  }
}

export async function cancelReminder(slot: ReminderSlot) {
  try {
    await Notifications.cancelScheduledNotificationAsync(`breathflow-${slot}`);
  } catch {}
}
