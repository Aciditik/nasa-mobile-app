import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  registerForPushNotifications: async (): Promise<string | null> => {
    let token = null;

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return null;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push token:', token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  },

  scheduleLocalNotification: async (title: string, body: string, seconds: number = 5): Promise<string> => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' },
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
    });
    return id;
  },

  scheduleDailyAPODNotification: async (): Promise<string> => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '🌌 Daily NASA Picture',
        body: "Today's Astronomy Picture of the Day is ready!",
        data: { type: 'daily_apod' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });
    return id;
  },

  cancelNotification: async (notificationId: string): Promise<void> => {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  },

  cancelAllNotifications: async (): Promise<void> => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  },

  sendImmediateNotification: async (title: string, body: string): Promise<void> => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' },
      },
      trigger: null,
    });
  },

  addNotificationReceivedListener: (callback: (notification: Notifications.Notification) => void) => {
    return Notifications.addNotificationReceivedListener(callback);
  },

  addNotificationResponseReceivedListener: (
    callback: (response: Notifications.NotificationResponse) => void
  ) => {
    return Notifications.addNotificationResponseReceivedListener(callback);
  },
};
