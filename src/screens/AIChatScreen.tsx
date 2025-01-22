import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Pressable,
  ActivityIndicator,
  Keyboard,
  Animated,
  Dimensions
} from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import MarkdownDisplay from 'react-native-markdown-display';
import axios from 'axios';
import { API_URL } from '../config';

const EXAMPLE_QUESTIONS = [
  "What are the latest guidelines for hypertension management?",
  "Explain the CHAD-VASC score calculation",
  "What's the differential diagnosis for chest pain?",
  "How to interpret an ECG?",
];

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

export default function AIChatScreen() {
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'system',
    content: "I'm MedGuide AI, your medical assistant. How can I help you today?"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showExamples, setShowExamples] = useState(true);

  useEffect(() => {
    if (messages.length > 1) {
      setShowExamples(false);
    }
  }, [messages]);

  const handleSend = async (content: string = input) => {
    if ((!content.trim() && !input.trim()) || loading) return;

    const userMessage = content.trim() || input.trim();
    setInput('');
    Keyboard.dismiss();

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(newMessages);

    setLoading(true);
    scrollToBottom();

    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, {
        messages: newMessages.filter(m => m.role !== 'system')
      });

      setMessages([...newMessages, { 
        role: 'assistant', 
        content: response.data.message 
      }]);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
      
    } catch (error) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const renderMessage = (message: Message, index: number) => {
    if (message.role === 'system') {
      return (
        <View key={index} style={styles.systemMessage}>
          <Text style={[styles.systemText, { color: colors.onSurfaceVariant }]}>
            {message.content}
          </Text>
        </View>
      );
    }

    const isUser = message.role === 'user';
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.messageContainer,
          {
            backgroundColor: isUser ? colors.primary : colors.surface,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            opacity: fadeAnim,
          }
        ]}
      >
        {!isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="medical" size={20} color={colors.primary} />
          </View>
        )}
        <View style={styles.messageContent}>
          {isUser ? (
            <Text style={[styles.messageText, { color: '#FFFFFF' }]}>
              {message.content}
            </Text>
          ) : (
            <MarkdownDisplay
              style={{
                body: { color: colors.onSurface },
                code_block: { 
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurfaceVariant,
                  padding: 8,
                  borderRadius: 4,
                },
                code_inline: { 
                  backgroundColor: colors.surfaceVariant,
                  color: colors.onSurfaceVariant,
                  padding: 4,
                  borderRadius: 4,
                },
                link: { color: colors.primary },
                list_item: { color: colors.onSurface },
                bullet_list: { color: colors.onSurface },
                ordered_list: { color: colors.onSurface },
              }}
            >
              {message.content}
            </MarkdownDisplay>
          )}
        </View>
      </Animated.View>
    );
  };

  const renderExamples = () => (
    <View style={styles.examplesContainer}>
      <Text style={[styles.examplesTitle, { color: colors.onSurface }]}>
        Example questions
      </Text>
      <View style={styles.examplesGrid}>
        {EXAMPLE_QUESTIONS.map((question, index) => (
          <Chip
            key={index}
            onPress={() => handleSend(question)}
            style={[styles.exampleChip, { backgroundColor: colors.surfaceVariant }]}
            textStyle={{ color: colors.onSurfaceVariant }}
          >
            {question}
          </Chip>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map(renderMessage)}
        {showExamples && renderExamples()}
        {loading && (
          <View style={[styles.loadingContainer, { backgroundColor: colors.surface }]}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
              Thinking...
            </Text>
          </View>
        )}
      </ScrollView>

      <View style={[styles.inputContainer, { 
        backgroundColor: colors.surface,
        borderTopColor: colors.outline 
      }]}>
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Ask me anything about medical topics..."
          multiline
          maxLength={1000}
          style={[styles.input, { backgroundColor: colors.surface }]}
          textColor={colors.onSurface}
          placeholderTextColor={colors.onSurfaceVariant}
          disabled={loading}
        />
        <Pressable
          onPress={() => handleSend()}
          style={({ pressed }) => [
            styles.sendButton,
            { opacity: pressed ? 0.7 : 1 }
          ]}
          disabled={!input.trim() || loading}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={input.trim() ? colors.primary : colors.onSurfaceVariant} 
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageContent: {
    flexDirection: 'row',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '50%',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    padding: 12,
    borderRadius: 16,
    marginVertical: 8,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  systemMessage: {
    alignItems: 'center',
    marginVertical: 16,
  },
  systemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  examplesContainer: {
    padding: 16,
    marginTop: 8,
  },
  examplesTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    marginBottom: 8,
  },
}); 