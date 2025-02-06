import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { Text, Surface, Chip, Button, Divider, RadioButton } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { API_URL } from '../config';

interface Question {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  questions: Question[];
  lastUpdated: string;
}

export default function QuizDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    if (!id) {
      setError('No quiz ID provided');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`${API_URL}/api/quizzes/${id}`);
      console.log('Quiz data:', response.data);
      setQuiz(response.data);
      setSelectedAnswers({});
      setCurrentQuestionIndex(0);
      setShowExplanation(false);
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (quiz && currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.primary }]}>{error || 'Quiz not found'}</Text>
        <Button mode="contained" onPress={loadQuiz} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.primary }]}>Question not found</Text>
        <Button mode="contained" onPress={loadQuiz} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Surface style={styles.surfaceContainer} elevation={2}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Pressable
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.onSurface} />
              <Text style={[styles.backText, { color: colors.onSurface }]}>Back</Text>
            </Pressable>

            {quiz.title && (
              <Text style={[styles.title, { color: colors.onSurface }]}>
                {quiz.title}
              </Text>
            )}
            
            {quiz.specialty && (
              <Text style={[styles.specialty, { color: colors.onSurfaceVariant }]}>
                {quiz.specialty}
              </Text>
            )}

            {quiz.tags && quiz.tags.length > 0 && (
              <View style={styles.tags}>
                {quiz.tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    style={[styles.tag, { backgroundColor: colors.surfaceVariant }]}
                    textStyle={{ color: colors.onSurfaceVariant }}
                  >
                    {tag.name}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />

          {quiz.description && (
            <>
              <View style={styles.section}>
                <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
                  {quiz.description}
                </Text>
              </View>
              <Divider style={[styles.divider, { backgroundColor: colors.surfaceVariant }]} />
            </>
          )}

          <View style={styles.section}>
            <Text style={[styles.questionNumber, { color: colors.primary }]}>
              Question {currentQuestionIndex + 1} of {quiz.questions.length}
            </Text>
            <Text style={[styles.questionText, { color: colors.primary }]}>
              {currentQuestion.text}
            </Text>
            {currentQuestion.options && currentQuestion.options.length > 0 ? (
              <View style={styles.optionsContainer}>
                <RadioButton.Group
                  onValueChange={value => handleAnswer(currentQuestion.id, value)}
                  value={selectedAnswers[currentQuestion.id] || ''}
                >
                  {currentQuestion.options.map((option, index) => {
                    const optionId = option.id || `${currentQuestion.id}-option-${index}`;
                    return (
                      <View key={optionId} style={styles.optionItem}>
                        <RadioButton.Item
                          label={option.text || ''}
                          value={optionId}
                          labelStyle={[styles.optionText, { color: colors.primary }]}
                          color={colors.primary}
                          uncheckedColor={colors.primary}
                          style={styles.radioButton}
                        />
                      </View>
                    );
                  })}
                </RadioButton.Group>
              </View>
            ) : (
              <Text style={[styles.error, { color: colors.primary }]}>
                No options available for this question
              </Text>
            )}

            <View style={styles.buttonContainer}>
              <Button 
                mode="outlined" 
                onPress={handlePrevious}
                disabled={currentQuestionIndex === 0}
                style={styles.navigationButton}
              >
                Previous
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setShowExplanation(true)}
                disabled={!selectedAnswers[currentQuestion.id]}
                style={styles.navigationButton}
              >
                Show Explanation
              </Button>
              <Button 
                mode="contained" 
                onPress={handleNext}
                disabled={currentQuestionIndex === quiz.questions.length - 1}
                style={styles.navigationButton}
              >
                Next
              </Button>
            </View>

            {showExplanation && currentQuestion.explanation && (
              <View style={[styles.explanation, { backgroundColor: colors.surfaceVariant }]}>
                <Text style={[styles.explanationText, { color: colors.onSurface }]}>
                  {currentQuestion.explanation}
                </Text>
              </View>
            )}
          </View>

          {quiz.lastUpdated && (
            <View style={styles.footer}>
              <Text style={[styles.lastUpdated, { color: colors.onSurfaceVariant }]}>
                Last updated: {new Date(quiz.lastUpdated).toLocaleDateString()}
              </Text>
            </View>
          )}
        </View>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  surfaceContainer: {
    borderRadius: 12,
  },
  card: {
    borderRadius: 12,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  specialty: {
    fontSize: 16,
    marginBottom: 12,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    height: 32,
  },
  divider: {
    height: 1,
  },
  section: {
    padding: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  questionNumber: {
    fontSize: 14,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 8,
  },
  navigationButton: {
    flex: 1,
  },
  explanation: {
    marginTop: 24,
    padding: 16,
    borderRadius: 8,
  },
  explanationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    alignItems: 'flex-end',
  },
  lastUpdated: {
    fontSize: 14,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    paddingHorizontal: 16,
  },
  retryButton: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  },
  optionsContainer: {
    marginTop: 16,
  },
  optionItem: {
    marginVertical: 4,
  },
  optionText: {
    fontSize: 16,
    flex: 1,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
}); 