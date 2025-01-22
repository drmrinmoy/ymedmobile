import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Text, TextInput, Button, Switch, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/auth';
import axios from 'axios';
import { API_URL } from '../config';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types/navigation';

type TabType = 'profile' | 'favorites' | 'settings';

interface ProfileData {
  name: string;
  email: string;
  specialty: string;
  hospital: string;
  phone: string | null;
}

interface Settings {
  notifications: boolean;
  darkMode: boolean;
  biometricAuth: boolean;
}

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { colors, isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.displayName || '',
    email: user?.email || '',
    specialty: '',
    hospital: '',
    phone: user?.phoneNumber || null,
  });
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: isDark,
    biometricAuth: false,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/profile`);
      setProfileData(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      await axios.put(
        `${API_URL}/api/profile`,
        profileData
      );
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          onPress: logout,
          style: 'destructive'
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={[styles.avatar, { backgroundColor: colors.surfaceVariant }]}>
          <Ionicons name="person" size={40} color={colors.primary} />
        </View>
        <Text style={[styles.headerTitle, { color: colors.onSurface }]}>
          {profileData.name || 'Complete Your Profile'}
        </Text>
        <Text style={[styles.headerSubtitle, { color: colors.onSurfaceVariant }]}>
          {profileData.specialty || 'Add your specialty'}
        </Text>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={[styles.tabs, { backgroundColor: colors.surfaceVariant }]}>
      {[
        { id: 'profile', icon: 'person-outline', label: 'Profile' },
        { id: 'favorites', icon: 'heart-outline', label: 'Favorites' },
        { id: 'settings', icon: 'settings-outline', label: 'Settings' }
      ].map((tab) => (
        <Pressable 
          key={tab.id}
          style={[
            styles.tab,
            activeTab === tab.id && { backgroundColor: colors.surface }
          ]}
          onPress={() => setActiveTab(tab.id as TabType)}
        >
          <Ionicons 
            name={tab.icon} 
            size={20} 
            color={activeTab === tab.id ? colors.primary : colors.onSurfaceVariant} 
          />
          <Text style={[
            styles.tabText,
            { color: activeTab === tab.id ? colors.primary : colors.onSurfaceVariant }
          ]}>
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );

  const renderSettingsItem = (
    icon: string,
    title: string,
    subtitle: string | null = null,
    right: React.ReactNode = null,
    onPress?: () => void
  ) => (
    <>
      <Pressable
        style={[styles.settingsItem, onPress && styles.settingsItemClickable]}
        onPress={onPress}
      >
        <View style={styles.settingsItemLeft}>
          <Ionicons name={icon} size={24} color={colors.onSurfaceVariant} />
          <View style={styles.settingsItemContent}>
            <Text style={[styles.settingsItemTitle, { color: colors.onSurface }]}>
              {title}
            </Text>
            {subtitle && (
              <Text style={[styles.settingsItemSubtitle, { color: colors.onSurfaceVariant }]}>
                {subtitle}
              </Text>
            )}
          </View>
        </View>
        {right}
      </Pressable>
      <Divider style={{ backgroundColor: colors.outline }} />
    </>
  );

  const renderSettings = () => (
    <View style={styles.settingsContainer}>
      <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.settingsSectionTitle, { color: colors.onSurfaceVariant }]}>
          App Settings
        </Text>
        {renderSettingsItem(
          'notifications-outline',
          'Notifications',
          'Get updates about new content',
          <Switch
            value={settings.notifications}
            onValueChange={(value) => setSettings(prev => ({ ...prev, notifications: value }))}
            color={colors.primary}
          />
        )}
        {renderSettingsItem(
          'moon-outline',
          'Dark Mode',
          'Switch between light and dark themes',
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            color={colors.primary}
          />
        )}
        {renderSettingsItem(
          'finger-print-outline',
          'Biometric Authentication',
          'Use fingerprint or face ID',
          <Switch
            value={settings.biometricAuth}
            onValueChange={(value) => setSettings(prev => ({ ...prev, biometricAuth: value }))}
            color={colors.primary}
          />
        )}
      </View>

      <View style={[styles.settingsSection, { backgroundColor: colors.surface }]}>
        <Text style={[styles.settingsSectionTitle, { color: colors.onSurfaceVariant }]}>
          Support
        </Text>
        {renderSettingsItem(
          'help-circle-outline',
          'Help & FAQ',
          'Get help with the app',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => {}
        )}
        {renderSettingsItem(
          'mail-outline',
          'Contact Us',
          'Send us your feedback',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => {}
        )}
        {renderSettingsItem(
          'information-circle-outline',
          'About',
          'App version 1.0.0',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => {}
        )}
      </View>

      <Button
        mode="outlined"
        onPress={handleSignOut}
        style={[styles.signOutButton, { borderColor: colors.primary }]}
        textColor={colors.primary}
      >
        Sign Out
      </Button>

      {error ? (
        <Text style={[styles.error, { color: colors.primary }]}>{error}</Text>
      ) : null}
    </View>
  );

  const renderForm = () => (
    <View style={styles.form}>
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>Full Name</Text>
        <TextInput
          value={profileData.name}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, name: text }))}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          mode="outlined"
          outlineColor={colors.outline}
          activeOutlineColor={colors.primary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>Email</Text>
        <TextInput
          value={profileData.email}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, email: text }))}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          mode="outlined"
          outlineColor={colors.outline}
          activeOutlineColor={colors.primary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>Phone</Text>
        <TextInput
          value={profileData.phone || 'No phone number'}
          editable={false}
          style={[styles.input, { backgroundColor: colors.surfaceVariant }]}
          textColor={colors.onSurfaceVariant}
          mode="outlined"
          outlineColor={colors.outline}
        />
        <Text style={[styles.helperText, { color: colors.onSurfaceVariant }]}>
          Phone number is set during registration
        </Text>
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>Specialty</Text>
        <TextInput
          value={profileData.specialty}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, specialty: text }))}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          mode="outlined"
          outlineColor={colors.outline}
          activeOutlineColor={colors.primary}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.onSurface }]}>Hospital</Text>
        <TextInput
          value={profileData.hospital}
          onChangeText={(text) => setProfileData(prev => ({ ...prev, hospital: text }))}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          mode="outlined"
          outlineColor={colors.outline}
          activeOutlineColor={colors.primary}
        />
      </View>

      <Button
        mode="contained"
        onPress={handleSave}
        loading={loading}
        style={styles.saveButton}
      >
        Save Profile
      </Button>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderForm();
      case 'favorites':
        return (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={48} color={colors.onSurfaceVariant} />
            <Text style={[styles.emptyStateText, { color: colors.onSurfaceVariant }]}>
              Your favorites will appear here
            </Text>
          </View>
        );
      case 'settings':
        return renderSettings();
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView style={styles.content}>
        {renderContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'transparent',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
  },
  error: {
    marginBottom: 16,
    textAlign: 'center',
  },
  saveButton: {
    marginTop: 8,
  },
  settingsContainer: {
    padding: 16,
  },
  settingsSection: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  settingsSectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 16,
    paddingBottom: 8,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  settingsItemClickable: {
    cursor: 'pointer',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemContent: {
    marginLeft: 16,
    flex: 1,
  },
  settingsItemTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingsItemSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  signOutButton: {
    marginTop: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
}); 