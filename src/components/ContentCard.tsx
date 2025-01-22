import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../providers/ThemeProvider';

interface ContentCardProps {
  title: string;
  description: string;
  specialty: string;
  tags: { name: string }[];
  icon: string;
  iconColor: string;
  onPress: () => void;
}

export function ContentCard(props: ContentCardProps) {
  const { colors } = useTheme();
  
  return (
    <Pressable onPress={props.onPress}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: props.iconColor }]}>
            <Ionicons name={props.icon} size={24} color="#FFFFFF" />
          </View>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            {props.title}
          </Text>
        </View>
        <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
          {props.specialty}
        </Text>
        <Text style={[styles.description, { color: colors.onSurface }]}>
          {props.description}
        </Text>
        <View style={styles.tags}>
          {props.tags.map((tag, index) => (
            <View 
              key={index} 
              style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
            >
              <Text style={{ color: colors.onSurfaceVariant }}>
                {tag.name}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  title: {
    fontWeight: 'bold',
    marginLeft: 8,
  },
  specialty: {
    marginBottom: 4,
  },
  description: {
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
}); 