import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useTheme } from '../providers/ThemeProvider';
import Header from '../components/Header';

export default function HelpScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleContactPress = () => {
    router.push('/contact');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Help & FAQ" />
      <ScrollView style={styles.content}>
        <List.Section>
          <List.Subheader>Frequently Asked Questions</List.Subheader>
          <List.Accordion
            title="How do I use the app?"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
          >
            <List.Item
              title="Using the App"
              description="Our app provides easy access to medical guidelines, cases, and calculators. Navigate through the bottom tabs to access different features."
            />
          </List.Accordion>
          
          <List.Accordion
            title="How do I contact support?"
            left={props => <List.Icon {...props} icon="email-outline" />}
          >
            <List.Item
              title="Contact Support"
              description="You can contact our support team through the Contact Us page."
              onPress={handleContactPress}
              right={props => <List.Icon {...props} icon="chevron-right" />}
            />
          </List.Accordion>
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