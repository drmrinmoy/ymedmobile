import { View, Text } from 'react-native';
import { useTheme } from '../../src/providers/ThemeProvider';

export default function HomeScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.onSurface, fontSize: 20 }}>Home Screen</Text>
      </View>
    </View>
  );
} 