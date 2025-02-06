import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Settings" showBackButton={false} />
      <ScrollView style={styles.content}>
        <List.Section>
          <List.Item
            title="Profile"
            left={props => <List.Icon {...props} icon="account-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/profile')}
          />
          <List.Item
            title="Notifications"
            left={props => <List.Icon {...props} icon="bell-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/notifications')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>Support</List.Subheader>
          <List.Item
            title="Help & FAQ"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/help')}
          />
          <List.Item
            title="Contact Us"
            left={props => <List.Icon {...props} icon="email-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/contact')}
          />
        </List.Section>

        <List.Section>
          <List.Subheader>About</List.Subheader>
          <List.Item
            title="About YMed"
            description="Version 1.0.0"
            left={props => <List.Icon {...props} icon="information-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
            onPress={() => router.push('/about')}
          />
        </List.Section>
      </ScrollView>
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