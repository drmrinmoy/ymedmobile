import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Card, Title, List, Button, Text, Surface, TextInput, HelperText, Divider } from 'react-native-paper';
import { apiRequest } from '../utils/api';
import { useTheme } from '../providers/ThemeProvider';

export function SecurityScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiRequest('/api/mobile/settings/security/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.success) {
        throw new Error(response.error || 'Failed to change password');
      }

      Alert.alert('Success', 'Your password has been updated');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
          title="Change Password" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <TextInput
            label="Current Password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor={colors.surfaceVariant}
            textColor={colors.onSurface}
          />
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor={colors.surfaceVariant}
            textColor={colors.onSurface}
          />
          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            outlineColor={colors.surfaceVariant}
            textColor={colors.onSurface}
          />
          <Button 
            mode="contained" 
            onPress={handleChangePassword}
            loading={loading}
            disabled={loading}
            style={styles.button}
          >
            Change Password
          </Button>
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Two-Factor Authentication" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <List.Item
            title="Enable 2FA"
            description="Add an extra layer of security to your account"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="shield-check" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.primary} />}
            onPress={() => Alert.alert('Coming Soon', '2FA setup will be available in a future update')}
          />
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Security Log" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <List.Item
            title="View Activity"
            description="Check your recent account activity"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="history" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.primary} />}
            onPress={() => Alert.alert('Coming Soon', 'Security log will be available in a future update')}
          />
        </Card.Content>
      </Surface>
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 