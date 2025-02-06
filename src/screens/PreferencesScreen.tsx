import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, List, Button, Text, Surface, Switch, RadioButton, HelperText } from 'react-native-paper';
import { apiRequest } from '../utils/api';
import { useTheme } from '../providers/ThemeProvider';

interface Preferences {
  theme: 'light' | 'dark' | 'system';
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
}

export function PreferencesScreen() {
  const [preferences, setPreferences] = useState<Preferences>({
    theme: 'system',
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const handleSavePreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('/api/mobile/settings/preferences', {
        method: 'POST',
        body: JSON.stringify(preferences),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to save preferences');
      }

      Alert.alert('Success', 'Your preferences have been updated');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      {error && (
        <HelperText type="error" visible={true} style={{ color: colors.primary }}>
          {error}
        </HelperText>
      )}

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Theme Settings" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <RadioButton.Group 
            onValueChange={value => setPreferences({ ...preferences, theme: value as 'light' | 'dark' | 'system' })} 
            value={preferences.theme}
          >
            <RadioButton.Item
              label="Light Theme"
              value="light"
              labelStyle={{ color: colors.onSurface }}
              color={colors.primary}
              uncheckedColor={colors.surfaceVariant}
            />
            <RadioButton.Item
              label="Dark Theme"
              value="dark"
              labelStyle={{ color: colors.onSurface }}
              color={colors.primary}
              uncheckedColor={colors.surfaceVariant}
            />
            <RadioButton.Item
              label="System Default"
              value="system"
              labelStyle={{ color: colors.onSurface }}
              color={colors.primary}
              uncheckedColor={colors.surfaceVariant}
            />
          </RadioButton.Group>
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Notification Settings" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <List.Item
            title="Email Notifications"
            description="Receive updates via email"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="email" color={colors.primary} />}
            right={() => (
              <Switch
                value={preferences.notifications.email}
                onValueChange={value => 
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, email: value }
                  })
                }
                color={colors.primary}
              />
            )}
          />
          <List.Item
            title="Push Notifications"
            description="Receive instant updates on your device"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="bell" color={colors.primary} />}
            right={() => (
              <Switch
                value={preferences.notifications.push}
                onValueChange={value => 
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, push: value }
                  })
                }
                color={colors.primary}
              />
            )}
          />
          <List.Item
            title="Marketing Communications"
            description="Receive news and special offers"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="tag" color={colors.primary} />}
            right={() => (
              <Switch
                value={preferences.notifications.marketing}
                onValueChange={value => 
                  setPreferences({
                    ...preferences,
                    notifications: { ...preferences.notifications, marketing: value }
                  })
                }
                color={colors.primary}
              />
            )}
          />
        </Card.Content>
      </Surface>

      <Button 
        mode="contained" 
        onPress={handleSavePreferences}
        loading={loading}
        disabled={loading}
        style={styles.saveButton}
      >
        Save Preferences
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButton: {
    marginTop: 8,
  },
}); 