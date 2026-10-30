import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { Screen, typography } from '../components/ui';

export default function NotFound() {
  return <Screen><View style={{ padding: 24, gap: 20 }}><Text style={typography.title}>A wrong turn.</Text><Text style={typography.body}>This page doesn’t exist.</Text><Link href="/" style={{ ...typography.heading, paddingVertical: 16 }}>Back to goals</Link></View></Screen>;
}
