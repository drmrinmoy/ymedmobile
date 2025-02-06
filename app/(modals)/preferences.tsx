import { View, StyleSheet } from 'react-native';
import { List, Switch } from 'react-native-paper';
import { useTheme } from '../../src/providers/ThemeProvider';
import Header from '../../src/components/Header';

export default function PreferencesScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Preferences" />
      <View style={styles.content}>
        <List.Section>
          <List.Item
            title="Dark Mode"
            left={props => <List.Icon {...props} icon="theme-light-dark" />}
            right={() => <Switch value={false} onValueChange={() => {}} />}
          />
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell" />}
            right={() => <Switch value={true} onValueChange={() => {}} />}
          />
          <List.Item
            title="Sound Effects"
            left={props => <List.Icon {...props} icon="volume-high" />}
            right={() => <Switch value={true} onValueChange={() => {}} />}
          />
          <List.Item
            title="Auto-Update"
            left={props => <List.Icon {...props} icon="update" />}
            right={() => <Switch value={true} onValueChange={() => {}} />}
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