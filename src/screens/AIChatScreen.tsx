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
  Dimensions,
  Clipboard,
  ToastAndroid,
  Alert,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';
import { Text, TextInput, Chip, IconButton, Surface, Menu, Divider } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import MarkdownDisplay from 'react-native-markdown-display';
import axios from 'axios';
import { API_URL } from '../config';
import { useRouter } from 'expo-router';
import Header from '../components/Header';
import { TextInput as NativeTextInput } from 'react-native';
import { MathJaxSvg } from 'react-native-mathjax-html-to-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXAMPLE_QUESTIONS = [
  "Latest hypertension guidelines",
  "CHAD-VASC score calculation",
  "Chest pain diagnosis",
  "ECG interpretation basics"
];

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
};

interface SSEMessage {
  message?: string;
  data?: string;
}

type SSEEvent = MessageEvent | CloseEvent  | ErrorEvent 

type RootStackParamList = {
  [key: string]: undefined;
};

type ChatHistory = {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
};

export default function AIChatScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([{
    role: 'system',
    content: "Hello! 👋 How can I assist you today? Whether you're looking for medical guidelines, case studies, drug information, or quizzes, I'm here to help. Let me know what you need! 📋"
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [showExamples, setShowExamples] = useState(true);
  const [controller, setController] = useState<AbortController | null>(null);
  const lastMessageRef = useRef<string>("");
  const [inputHeight, setInputHeight] = useState(40);
  const inputRef = useRef<NativeTextInput>(null);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  useEffect(() => {
    if (messages.length > 1) {
      setShowExamples(false);
    }
  }, [messages]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        scrollToBottom();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    loadChatHistories();
  }, []);

  const loadChatHistories = async () => {
    try {
      setIsLoadingHistory(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/ai/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setChatHistories(response.data);
    } catch (error) {
      console.error('Failed to load chat histories:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const saveChatHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const title = messages.length > 1 ? messages[1].content.slice(0, 50) + '...' : 'New Chat';
      const lastMessage = messages[messages.length - 1].content;

      const response = await axios.request({
        method: currentChatId ? 'PUT' : 'POST',
        url: currentChatId 
          ? `${API_URL}/api/ai/chats/${currentChatId}`
          : `${API_URL}/api/ai/chats`,
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        data: {
          title,
          messages,
          timestamp: new Date()
        }
      });

      if (!currentChatId) {
        setCurrentChatId(response.data.id);
      }
      
      loadChatHistories();
    } catch (error) {
      console.error('Failed to save chat:', error);
    }
  };

  const loadChat = async (chatId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/ai/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setMessages(response.data.messages);
      setCurrentChatId(chatId);
      setShowHistoryMenu(false);
      setShowExamples(false);
    } catch (error) {
      console.error('Failed to load chat:', error);
      toast('Failed to load chat');
    }
  };

  const startNewChat = () => {
    setMessages([{
      role: 'system',
      content: "Hello! 👋 How can I assist you today?  I'm here to help. Let me know what you need! 📋"
    }]);
    setCurrentChatId(null);
    setShowHistoryMenu(false);
    setShowExamples(true);
  };

  const stopGenerating = () => {
    if (controller) {
      controller.abort();
      setController(null);
      setLoading(false);
    }
  };

  const handleSend = async (content: string = input) => {
    if ((!content.trim() && !input.trim()) || loading) return;

    const userMessage: Message = { role: 'user', content: content.trim() || input.trim(), timestamp: new Date() };
    setInput("");
    Keyboard.dismiss();
    setLoading(true);

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);

    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        toast('Please log in to continue');
        return;
      }

      const abortController = new AbortController();
      setController(abortController);

      console.log('Sending request to:', `${API_URL}/api/ai/chat`);
      
      const response = await axios.post(
        `${API_URL}/api/ai/chat`,
        {
          messages: newMessages.filter(m => m.role !== 'system'),
          chatId: currentChatId
        },
        {
          signal: abortController.signal,
          responseType: 'text',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          onDownloadProgress: (progressEvent) => {
            const responseText = progressEvent.event.target.responseText;
            if (!responseText) return;

            try {
              // Try to parse as JSON
              try {
                const data = JSON.parse(responseText);
                if (data.message) {
                  const assistantMessage: Message = {
                    role: 'assistant',
                    content: data.message,
                    timestamp: new Date()
                  };
                  setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.role === 'assistant') {
                      return [...prev.slice(0, -1), assistantMessage];
                    }
                    return [...prev, assistantMessage];
                  });
                  lastMessageRef.current = data.message;
                  scrollToBottom();
                }
              } catch {
                // If not valid JSON, use as raw text
                const assistantMessage: Message = {
                  role: 'assistant',
                  content: responseText,
                  timestamp: new Date()
                };
                setMessages(prev => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage && lastMessage.role === 'assistant') {
                    return [...prev.slice(0, -1), assistantMessage];
                  }
                  return [...prev, assistantMessage];
                });
                lastMessageRef.current = responseText;
                scrollToBottom();
              }
            } catch (e) {
              console.error('Error processing response:', e);
            }
          }
        }
      );

      // Save chat history after successful response
      await saveChatHistory();
      
    } catch (error: any) {
      console.error('Full error details:', error);
      if (error.name === 'AbortError' || axios.isCancel(error)) {
        console.log('Response generation stopped');
        // Remove the incomplete message
        setMessages(prev => prev.filter(msg => msg !== userMessage));
      } else {
        console.error('Chat error:', error);
        setMessages(prev => [...prev.filter(msg => msg !== userMessage), { 
          role: 'assistant', 
          content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
          timestamp: new Date()
        }]);
      }
    } finally {
      setController(null);
      setLoading(false);
      scrollToBottom();
    }
  };

  const regenerateResponse = async () => {
    if (loading || messages.length === 0) return;
    const lastUserMessage = messages.findLast(m => m.role === 'user');
    if (!lastUserMessage) return;

    // Remove the last assistant message if it exists
    const newMessages = messages.filter(m => 
      !(m.role === 'assistant' && m.content === lastMessageRef.current)
    );
    setMessages(newMessages);
    lastMessageRef.current = "";
    
    // Resubmit with the last user message
    await handleSend(lastUserMessage.content);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setString(text);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Text copied to clipboard', ToastAndroid.SHORT);
    } else {
      Alert.alert('Copied', 'Text copied to clipboard');
    }
  };

  const handleInternalLink = (href: string) => {
    if (href.startsWith('/')) {
      router.push(href);
    }
  };

  const renderMessage = (message: Message, index: number) => {
    if (!message || !message.content) return null;

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

    // Function to process math expressions
    const processMathContent = (content: string) => {
      // First, protect markdown headers from being caught in math regex
      content = content.replace(/^###\s+/gm, 'HEADER_PLACEHOLDER ');
      
      // Match both display and inline math
      const mathRegex = /(\\\[[\s\S]*?\\\])|(\\\([\s\S]*?\\\))|(\$\$[\s\S]*?\$\$)|(\$[^\$\n]+?\$)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = mathRegex.exec(content)) !== null) {
        // Add text before the math expression
        if (match.index > lastIndex) {
          parts.push({
            type: 'text',
            content: content.slice(lastIndex, match.index)
          });
        }

        // Get the math expression and determine if it's display mode
        const fullMatch = match[0];
        const isDisplayMode = fullMatch.startsWith('\\[') || fullMatch.startsWith('$$');

        // Keep the delimiters for proper rendering
        parts.push({
          type: 'math',
          content: fullMatch,
          displayMode: isDisplayMode
        });

        lastIndex = match.index + fullMatch.length;
      }

      // Add remaining text
      if (lastIndex < content.length) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex)
        });
      }

      // Restore headers
      parts.forEach(part => {
        if (part.type === 'text') {
          part.content = part.content.replace(/HEADER_PLACEHOLDER /g, '### ');
        }
      });

      return parts;
    };

    const renderContent = (content: string) => {
      const parts = processMathContent(content);
      
      return (
        <View>
          {parts.map((part, index) => {
            if (part.type === 'math') {
              return (
                <View 
                  key={`math_${index}`} 
                  style={[
                    styles.mathContainer,
                    part.displayMode && styles.displayMathContainer,
                    { backgroundColor: colors.surfaceVariant }
                  ]}
                >
                  <MathJaxSvg
                    fontSize={part.displayMode ? 20 : 18}
                    color={colors.onSurface}
                    style={part.displayMode ? styles.displayMathContent : styles.mathContent}
                  >
                    {`${part.content}`}
                  </MathJaxSvg>
                </View>
              );
            } else {
              return (
                <MarkdownDisplay
                  key={`text_${index}`}
                  style={{
                    body: { 
                      color: colors.onSurface,
                      fontSize: 15,
                      lineHeight: 22,
                    },
                    code_block: { 
                      backgroundColor: colors.surfaceVariant,
                      color: colors.onSurfaceVariant,
                      padding: 12,
                      borderRadius: 8,
                      marginVertical: 8,
                    },
                    code_inline: { 
                      backgroundColor: colors.surfaceVariant,
                      color: colors.onSurfaceVariant,
                      padding: 4,
                      borderRadius: 4,
                    },
                    link: { 
                      color: colors.primary,
                      textDecorationLine: 'underline',
                    },
                    list_item: { 
                      color: colors.onSurface,
                      marginVertical: 4,
                    },
                    bullet_list: { 
                      color: colors.onSurface,
                      marginVertical: 8,
                    },
                    ordered_list: { 
                      color: colors.onSurface,
                      marginVertical: 8,
                    },
                    heading1: {
                      color: colors.onSurface,
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginVertical: 12,
                    },
                    heading2: {
                      color: colors.onSurface,
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginVertical: 10,
                    },
                    heading3: {
                      color: colors.onSurface,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginVertical: 8,
                    },
                  }}
                  onLinkPress={(url) => {
                    if (url.startsWith('/')) {
                      router.push(url);
                      return false;
                    }
                    return true;
                  }}
                >
                  {part.content}
                </MarkdownDisplay>
              );
            }
          })}
        </View>
      );
    };
    
    return (
      <Animated.View
        key={index}
        style={[
          styles.messageContainer,
          {
            backgroundColor: isUser ? colors.primary : colors.surface,
            alignSelf: isUser ? 'flex-end' : 'flex-start',
            opacity: fadeAnim,
            width: isUser ? '80%' : '90%',
          }
        ]}
      >
        {!isUser && (
          <View style={[styles.avatarContainer, { backgroundColor: colors.surfaceVariant }]}>
            <Ionicons name="medical" size={20} color={colors.primary} />
          </View>
        )}
        <Pressable 
          style={styles.messageContent}
          onLongPress={() => copyToClipboard(message.content)}
          delayLongPress={500}
        >
          {isUser ? (
            <Text style={[styles.messageText, { color: '#FFFFFF' }]}>
              {message.content}
            </Text>
          ) : (
            <View style={styles.assistantMessageContent}>
              {renderContent(message.content)}
              {message.content === lastMessageRef.current && (
                <Pressable
                  onPress={regenerateResponse}
                  style={({ pressed }) => [
                    styles.regenerateButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Ionicons name="refresh" size={14} color={colors.onSurfaceVariant} />
                  <Text style={[styles.regenerateText, { color: colors.onSurfaceVariant }]}>
                    Regenerate
                  </Text>
                </Pressable>
              )}
            </View>
          )}
          {message.timestamp && (
            <Text style={[styles.timestamp, { color: colors.onSurfaceVariant }]}>
              {new Date(message.timestamp).toLocaleTimeString()}
            </Text>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  const renderExamples = () => (
    <View style={styles.examplesContainer}>
      <View style={[styles.welcomeCard, { backgroundColor: colors.surface }]}>
        <View style={styles.welcomeHeader}>
          <Ionicons name="medical" size={24} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { color: colors.onSurface }]}>
            Medical AI Assistant
          </Text>
        </View>
        <Text style={[styles.welcomeSubtitle, { color: colors.onSurfaceVariant }]}>
          Ask me anything about:
        </Text>
        <View style={styles.topicsGrid}>
          {[
            { icon: 'document-text', text: 'Guidelines' },
            { icon: 'flask', text: 'Case Studies' },
            { icon: 'medkit', text: 'Treatments' },
            { icon: 'book', text: 'References' }
          ].map((item, index) => (
            <View key={index} style={[styles.topicItem, { backgroundColor: colors.surfaceVariant }]}>
              <Ionicons name={item.icon} size={20} color={colors.primary} />
              <Text style={[styles.topicText, { color: colors.onSurface }]}>{item.text}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <Text style={[styles.examplesTitle, { color: colors.onSurface }]}>
        Try asking about:
      </Text>
      <View style={styles.examplesGrid}>
        {EXAMPLE_QUESTIONS.map((question, index) => (
          <Pressable
            key={index}
            onPress={() => handleSend(question)}
            style={({ pressed }) => [
              styles.exampleButton,
              { 
                backgroundColor: colors.surfaceVariant,
                opacity: pressed ? 0.8 : 1
              }
            ]}
          >
            <Ionicons name="help-circle-outline" size={16} color={colors.primary} />
            <Text style={[styles.exampleText, { color: colors.onSurface }]}>
              {question}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );

  const renderHistoryMenu = () => (
    <Menu
      visible={showHistoryMenu}
      onDismiss={() => setShowHistoryMenu(false)}
      anchor={
        <IconButton
          icon="history"
          size={24}
          onPress={() => setShowHistoryMenu(true)}
          style={styles.historyButton}
        />
      }
      style={[styles.historyMenu, { backgroundColor: colors.surface }]}
    >
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.onSurface }]}>Chat History</Text>
        <View style={styles.historyActions}>
          <IconButton
            icon="plus"
            size={20}
            onPress={startNewChat}
            style={styles.newChatButton}
          />
          {chatHistories.length > 0 && (
            <IconButton
              icon="delete"
              size={20}
              onPress={deleteAllChats}
              style={[styles.deleteButton, { marginLeft: 4 }]}
            />
          )}
        </View>
      </View>
      <Divider />
      {isLoadingHistory ? (
        <ActivityIndicator style={styles.historyLoading} />
      ) : chatHistories.length === 0 ? (
        <Text style={[styles.noHistoryText, { color: colors.onSurfaceVariant }]}>
          No chat history yet
        </Text>
      ) : (
        <FlatList
          data={chatHistories}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => loadChat(item.id)}
              style={({ pressed }) => [
                styles.historyItem,
                {
                  backgroundColor: currentChatId === item.id 
                    ? colors.primary + '20' 
                    : pressed ? colors.surfaceVariant : 'transparent'
                }
              ]}
            >
              <View style={styles.historyItemContent}>
                <Ionicons 
                  name="chatbubble-outline" 
                  size={16} 
                  color={colors.primary} 
                />
                <View style={styles.historyItemText}>
                  <Text 
                    style={[styles.historyItemTitle, { color: colors.onSurface }]}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text 
                    style={[styles.historyItemDate, { color: colors.onSurfaceVariant }]}
                  >
                    {new Date(item.timestamp).toLocaleDateString()}
                  </Text>
                </View>
                <IconButton
                  icon="delete"
                  size={16}
                  onPress={() => deleteChat(item.id)}
                  style={styles.historyItemDelete}
                />
              </View>
            </Pressable>
          )}
          style={styles.historyList}
        />
      )}
    </Menu>
  );

  const deleteAllChats = async () => {
    Alert.alert(
      'Delete All Chats',
      'Are you sure you want to delete all chats? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) return;

              const response = await axios.delete(`${API_URL}/api/ai/chats`, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (response.status === 204) {
                setChatHistories([]);
                setCurrentChatId(null);
                setMessages([{
                  role: 'system',
                  content: "Hello! 👋 How can I assist you today? Whether you're looking for medical guidelines, case studies, drug information, or quizzes, I'm here to help. Let me know what you need! 📋"
                }]);
                setShowHistoryMenu(false);
                setShowExamples(true);
                toast('All chats deleted');
              }
            } catch (error) {
              console.error('Failed to delete all chats:', error);
              toast('Failed to delete all chats');
            }
          },
        },
      ],
    );
  };

  const deleteChat = async (chatId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.delete(`${API_URL}/api/ai/chats/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        setChatHistories(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([{
            role: 'system',
            content: "Hello! 👋 How can I assist you today? Whether you're looking for medical guidelines, case studies, drug information, or quizzes, I'm here to help. Let me know what you need! 📋"
          }]);
          setShowExamples(true);
        }
        toast('Chat deleted');
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      toast('Failed to delete chat');
    }
  };

  const toast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Info', message);
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <Header 
          title="AI Chat" 
          rightComponent={renderHistoryMenu()}
        />
        
        <KeyboardAvoidingView 
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map(renderMessage)}
            {showExamples && renderExamples()}
            {loading && (
              <Animated.View 
                style={[
                  styles.loadingContainer, 
                  { 
                    backgroundColor: colors.surface,
                    transform: [{ scale: fadeAnim }] 
                  }
                ]}
              >
                <ActivityIndicator color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.onSurfaceVariant }]}>
                  Thinking...
                </Text>
                <Pressable
                  onPress={stopGenerating}
                  style={({ pressed }) => [
                    styles.stopButton,
                    { opacity: pressed ? 0.7 : 1 }
                  ]}
                >
                  <Ionicons name="stop-circle" size={16} color={colors.primary} />
                  <Text style={[styles.stopText, { color: colors.primary }]}>
                    Stop
                  </Text>
                </Pressable>
              </Animated.View>
            )}
          </ScrollView>

          <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything about medical topics..."
                placeholderTextColor={colors.onSurfaceVariant}
                multiline
                style={[
                  styles.input,
                  { 
                    backgroundColor: colors.surfaceVariant,
                    color: colors.onSurface,
                    height: Math.min(80, Math.max(40, inputHeight)),
                    minHeight: 40,
                    maxHeight: 80,
                    opacity: loading ? 0.5 : 1,
                  }
                ]}
                textColor={colors.onSurface}
                disabled={loading}
                autoCapitalize="none"
                autoCorrect={true}
                returnKeyType="send"
                blurOnSubmit={false}
                onContentSizeChange={(e) => {
                  const height = e.nativeEvent.contentSize.height;
                  setInputHeight(Math.min(80, Math.max(40, height)));
                }}
                onSubmitEditing={() => {
                  if (input.trim()) {
                    handleSend();
                  }
                }}
              />
              <IconButton
                icon={loading ? "stop" : "send"}
                size={24}
                iconColor={loading ? colors.primary : colors.primary}
                style={[
                  styles.sendButton,
                  loading && { backgroundColor: colors.surfaceVariant }
                ]}
                disabled={!input.trim() && !loading}
                onPress={() => loading ? stopGenerating() : handleSend()}
              />
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingTop: 8,
  },
  messageContainer: {
    maxWidth: '90%',
    marginVertical: 8,
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
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
    flex: 1,
  },
  assistantMessageContent: {
    flex: 1,
  },
  paragraphSeparator: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  inputContainer: {
    borderTopWidth: 1,
    padding: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    position: 'relative',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    fontSize: 16,
    elevation: 0,
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
    marginHorizontal: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
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
  welcomeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  welcomeSubtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    width: '48%',
  },
  topicText: {
    fontSize: 14,
    fontWeight: '500',
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  examplesGrid: {
    gap: 8,
  },
  exampleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  exampleText: {
    fontSize: 14,
    flex: 1,
  },
  regenerateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  regenerateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    opacity: 0.7,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  stopText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  sendButton: {
    margin: 0,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
  },
  mathContainer: {
    marginVertical: 8,
    width: '100%',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  displayMathContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    width: '100%',
    minHeight: 60,
  },
  mathContent: {
    width: '100%',
    minHeight: 30,
    alignSelf: 'center',
    marginHorizontal: 4,
  },
  displayMathContent: {
    width: '100%',
    minHeight: 50,
    alignSelf: 'center',
    textAlign: 'center',
    marginHorizontal: 8,
  },
  historyButton: {
    margin: 0,
  },
  historyMenu: {
    width: width * 0.8,
    maxWidth: 400,
    marginTop: 50,
    borderRadius: 12,
    elevation: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  newChatButton: {
    margin: 0,
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  historyItemTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 12,
  },
  historyLoading: {
    padding: 20,
  },
  noHistoryText: {
    padding: 20,
    textAlign: 'center',
    fontSize: 14,
  },
  historyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    margin: 0,
  },
  historyItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  historyItemText: {
    flex: 1,
    marginLeft: 12,
  },
  historyItemDelete: {
    margin: 0,
    opacity: 0.7,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
  },
}); 