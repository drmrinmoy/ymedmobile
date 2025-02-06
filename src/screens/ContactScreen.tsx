import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, List } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import Header from '../components/Header';

export default function ContactScreen() {
  const { colors } = useTheme();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Implement contact form submission
      console.log('Submit contact form:', { subject, message });
      // Show success message
    } catch (error) {
      // Show error message
      console.error('Contact form error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Contact Us" />
      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.title, { color: colors.onSurface }]}>
            Get in Touch
          </Text>
          <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
            Have a question or feedback? We'd love to hear from you.
          </Text>
        </View>

        <List.Section style={[styles.section, { backgroundColor: colors.surface }]}>
          <List.Subheader>Quick Support</List.Subheader>
          <List.Item
            title="FAQ"
            description="Check our frequently asked questions"
            left={props => <List.Icon {...props} icon="help-circle-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
          <List.Item
            title="Documentation"
            description="Browse our user guides"
            left={props => <List.Icon {...props} icon="book-outline" />}
            right={props => <List.Icon {...props} icon="chevron-right" />}
          />
        </List.Section>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.formTitle, { color: colors.onSurface }]}>
            Send us a Message
          </Text>
          <View style={styles.form}>
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              multiline
              numberOfLines={6}
              style={styles.input}
            />
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={loading}
              style={styles.button}
              disabled={!subject || !message || loading}
            >
              Send Message
            </Button>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <List.Subheader>Other Ways to Reach Us</List.Subheader>
          <List.Item
            title="Email"
            description="support@ymed.ai"
            left={props => <List.Icon {...props} icon="email-outline" />}
          />
          <List.Item
            title="Phone"
            description="+1 (555) 123-4567"
            left={props => <List.Icon {...props} icon="phone-outline" />}
          />
          <List.Item
            title="Hours"
            description="Mon-Fri, 9:00 AM - 5:00 PM EST"
            left={props => <List.Icon {...props} icon="clock-outline" />}
          />
        </View>
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
  section: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
    lineHeight: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '500',
    padding: 16,
    paddingBottom: 8,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 