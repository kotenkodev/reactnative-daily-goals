import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export function successFeedback() {
  if (Platform.OS === 'web') return;
  const effect = Platform.OS === 'android'
    ? Haptics.performAndroidHapticsAsync(Haptics.AndroidHaptics.Confirm)
    : Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  // Feedback is optional; unavailable hardware must never interrupt saving.
  void effect.catch(() => {});
}
