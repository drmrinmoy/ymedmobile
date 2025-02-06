import { View, StyleSheet } from 'react-native';
import { Text, List } from 'react-native-paper';
import { useTheme } from '../../src/providers/ThemeProvider';
import Header from '../../src/components/Header';

export default function SecurityScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Security" />
      <View style={styles.content}>
        <List.Section>
          <List.Item
            title="Change Password"
            left={props => <List.Icon {...props} icon="lock" />}
          />
          <List.Item
            title="Two-Factor Authentication"
            left={props => <List.Icon {...props} icon="shield-check" />}
          />
          <List.Item
            title="Privacy Settings"
            left={props => <List.Icon {...props} icon="eye" />}
          />
          <List.Item
            title="Login History"
            left={props => <List.Icon {...props} icon="history" />}
          />
        </List.Section>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 