import React from 'react';
import { View, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  rightComponent?: React.ReactNode;
}

export default function Header({ title, showBack = true, rightAction, rightComponent }: HeaderProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.leftSection}>
          {showBack && (
            <IconButton
              icon={() => <Ionicons name="arrow-back" size={24} color={colors.onSurface} />}
              onPress={() => router.back()}
              style={styles.backButton}
            />
          )}
          <Text style={[styles.title, { color: colors.onSurface }]} numberOfLines={1}>
            {title}
          </Text>
        </View>
        
        {rightComponent || (rightAction && (
          <IconButton
            icon={() => <Ionicons name={rightAction.icon} size={24} color={colors.primary} />}
            onPress={rightAction.onPress}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
}); 