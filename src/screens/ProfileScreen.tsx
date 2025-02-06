import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert, Linking, Platform, StatusBar, SafeAreaView, Animated } from 'react-native';
import { Text, TextInput, Button, Switch, Divider, Avatar, Surface } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthProvider';
import axios from 'axios';
import { API_URL } from '../config';
import { useRouter } from 'expo-router';

type RootStackParamList = {
  Profile: undefined;
  Security: undefined;
  Billing: undefined;
  Preferences: undefined;
  Help: undefined;
  Contact: undefined;
  About: undefined;
};

type TabParamList = {
  Home: undefined;
  Library: { activeTab?: string };
  Search: undefined;
  AI: undefined;
  Profile: undefined;
};

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

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.name || '',
    email: user?.email || '',
    specialty: '',
    hospital: '',
    phone: '',
  });
  const [settings, setSettings] = useState<Settings>({
    notifications: true,
    darkMode: isDarkMode,
    biometricAuth: false,
  });
  const [error, setError] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadProfileData();
    // Start fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
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

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Router.replace is handled in AuthProvider
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          }
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface }]}>
      <View style={styles.headerInner}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.onSurface }]}>Profile</Text>
            <Text style={[styles.subtitle, { color: colors.onSurfaceVariant }]}>
              {user?.name || 'Complete your profile'}
            </Text>
          </View>
          <Pressable
            onPress={() => router.push('/preferences')}
            style={({ pressed }) => [
              styles.settingsButton,
              { 
                backgroundColor: pressed ? colors.surfaceVariant : `${colors.primary}10`,
              }
            ]}
          >
            <Ionicons name="settings-outline" size={22} color={colors.primary} />
          </Pressable>
        </View>
        
        <View style={styles.headerProfile}>
          <View style={[styles.avatarContainer, { backgroundColor: `${colors.primary}15` }]}>
            <Ionicons name="person-outline" size={32} color={colors.primary} />
          </View>
          <View style={styles.headerInfo}>
            <Text style={[styles.headerEmail, { color: colors.onSurfaceVariant }]} numberOfLines={1}>
              {user?.email}
            </Text>
            <Text style={[styles.headerSpecialty, { color: colors.primary }]} numberOfLines={1}>
              {profileData.specialty || 'Add your specialty'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderTabs = () => (
    <Surface style={[styles.tabsContainer, { backgroundColor: colors.surface }]} elevation={0}>
      <View style={styles.tabsRow}>
        {[
          { id: 'profile', icon: 'person-outline', label: 'Profile' },
          { id: 'favorites', icon: 'heart-outline', label: 'Favorites' },
          { id: 'settings', icon: 'settings-outline', label: 'Settings' }
        ].map((tab) => (
          <Pressable 
            key={tab.id}
            style={[
              styles.tab,
              { backgroundColor: activeTab === tab.id ? `${colors.primary}15` : 'transparent' }
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
              { 
                color: activeTab === tab.id ? colors.primary : colors.onSurfaceVariant,
                fontWeight: activeTab === tab.id ? '600' : '400'
              }
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </Surface>
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
            value={isDarkMode}
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
          Account & Security
        </Text>
        {renderSettingsItem(
          'shield-outline',
          'Security Settings',
          'Password, 2FA, Login history',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => router.push('/security')
        )}
        {renderSettingsItem(
          'card-outline',
          'Billing & Subscription',
          'Manage your subscription',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => router.push('/subscription')
        )}
        {renderSettingsItem(
          'language-outline',
          'Preferences',
          'Language, Theme, Accessibility',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => router.push('/preferences')
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
          () => router.push('/help')
        )}
        {renderSettingsItem(
          'mail-outline',
          'Contact Us',
          'Send us your feedback',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => router.push('/contact')
        )}
        {renderSettingsItem(
          'information-circle-outline',
          'About',
          'App version 1.0.0',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => router.push('/about')
        )}
        {renderSettingsItem(
          'document-text-outline',
          'Documentation',
          'User guides and documentation',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => Linking.openURL('https://docs.ymed.ai')
        )}
        {renderSettingsItem(
          'shield-checkmark-outline',
          'Privacy Policy',
          'Read our privacy policy',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => Linking.openURL('https://ymed.ai/privacy')
        )}
        {renderSettingsItem(
          'document-outline',
          'Terms of Service',
          'Read our terms of service',
          <Ionicons name="chevron-forward" size={24} color={colors.onSurfaceVariant} />,
          () => Linking.openURL('https://ymed.ai/terms')
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <Animated.View style={[{ flex: 1, opacity: fadeAnim }]}>
        {renderHeader()}
        {renderTabs()}
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {renderContent()}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerInner: {
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  headerEmail: {
    fontSize: 15,
    marginBottom: 4,
  },
  headerSpecialty: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  tabText: {
    fontSize: 14,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
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