import { Modal, StyleSheet, Text, View } from 'react-native';
import { ActionButton, typography } from './ui';
import { colors } from '../theme';

export function ConfirmDialog({ visible, title, message, confirmLabel, onCancel, onConfirm }: {
  visible: boolean; title: string; message: string; confirmLabel: string; onCancel: () => void; onConfirm: () => void;
}) {
  return <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
    <View style={styles.scrim}><View style={styles.dialog} accessibilityViewIsModal>
      <Text accessibilityRole="header" style={typography.heading}>{title}</Text>
      <Text style={typography.body}>{message}</Text>
      <ActionButton label={confirmLabel} variant="danger" onPress={onConfirm} />
      <ActionButton label="Keep it" variant="quiet" onPress={onCancel} />
    </View></View>
  </Modal>;
}
const styles = StyleSheet.create({
  scrim: { flex: 1, backgroundColor: '#13231BCC', padding: 24, justifyContent: 'center', alignItems: 'center' },
  dialog: { width: '100%', maxWidth: 420, padding: 24, borderRadius: 20, backgroundColor: colors.background, gap: 16 },
});
