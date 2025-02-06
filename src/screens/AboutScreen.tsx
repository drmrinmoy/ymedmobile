import React from 'react';
import { View, ScrollView, StyleSheet, Alert, Linking } from 'react-native';
import { Card, Title, List, Button, Text, Surface, Avatar, Chip } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { version } from '../../package.json';

const APP_FEATURES = [
  {
    title: 'Medical Guidelines',
    description: 'Access comprehensive, up-to-date medical guidelines across specialties',
    icon: 'book-open-page-variant',
  },
  {
    title: 'Drug Information',
    description: 'Detailed drug information, dosing, and interactions',
    icon: 'pill',
  },
  {
    title: 'Case Reports',
    description: 'Browse and share clinical case reports with colleagues',
    icon: 'file-document',
  },
  {
    title: 'Professional Network',
    description: 'Connect with healthcare professionals worldwide',
    icon: 'account-group',
  },
];

export function AboutScreen() {
  const { colors } = useTheme();

  const handleOpenLink = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while opening the link');
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Content style={styles.appInfo}>
          <Avatar.Icon 
            size={80} 
            icon="medical-bag"
            style={{ backgroundColor: colors.primary }}
          />
          <Title style={[styles.appName, { color: colors.onSurface }]}>YMed</Title>
          <Text style={{ color: colors.onSurfaceVariant }}>Version {version}</Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            Your trusted AI powered medical companion
          </Text>
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Key Features" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          {APP_FEATURES.map((feature, index) => (
            <React.Fragment key={feature.title}>
              <List.Item
                title={feature.title}
                description={feature.description}
                titleStyle={{ color: colors.onSurface }}
                descriptionStyle={{ color: colors.onSurfaceVariant }}
                left={props => <List.Icon {...props} icon={feature.icon} color={colors.primary} />}
              />
              {index < APP_FEATURES.length - 1 && (
                <View style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
              )}
            </React.Fragment>
          ))}
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="More Information" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content>
          <List.Item
            title="Visit Website"
            description="Learn more about YMed"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="web" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.primary} />}
            onPress={() => handleOpenLink('https://ymed.ai')}
          />
          <List.Item
            title="Privacy Policy"
            description="Read our privacy policy"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="shield-lock" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.primary} />}
            onPress={() => handleOpenLink('https://ymed.ai/privacy')}
          />
          <List.Item
            title="Terms of Service"
            description="View our terms of service"
            titleStyle={{ color: colors.onSurface }}
            descriptionStyle={{ color: colors.onSurfaceVariant }}
            left={props => <List.Icon {...props} icon="file-document" color={colors.primary} />}
            right={props => <List.Icon {...props} icon="chevron-right" color={colors.primary} />}
            onPress={() => handleOpenLink('https://ymed.ai/terms')}
          />
        </Card.Content>
      </Surface>

      <Surface style={[styles.card, { backgroundColor: colors.surface }]} elevation={2}>
        <Card.Title 
          title="Connect With Us" 
          titleStyle={{ color: colors.onSurface, fontWeight: '600' }}
        />
        <Card.Content style={styles.socialLinks}>
          <Button 
            mode="outlined" 
            icon="twitter" 
            onPress={() => handleOpenLink('https://twitter.com/ymed')}
            style={styles.socialButton}
          >
            Twitter
          </Button>
          <Button 
            mode="outlined" 
            icon="linkedin" 
            onPress={() => handleOpenLink('https://linkedin.com/company/ymed')}
            style={styles.socialButton}
          >
            LinkedIn
          </Button>
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
  appInfo: {
    alignItems: 'center',
    padding: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  description: {
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    flex: 1,
  },
}); 