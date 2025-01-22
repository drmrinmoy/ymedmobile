import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Chip, IconButton, Button, ProgressBar } from 'react-native-paper';
import { useTheme } from '../providers/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import axios from 'axios';
import { API_URL } from '../config';

type Props = NativeStackScreenProps<RootStackParamList, 'Quizzes'>;

interface Option {
  id: string;
  text: string;
  explanation?: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  specialty: string;
  tags: Array<{ id: string; name: string }>;
  questions: Question[];
  timeLimit?: number; // in minutes
}

interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export default function QuizScreen({ route, navigation }: Props) {
  const { colors } = useTheme();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [route.params?.id]);

  const loadQuiz = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/quizzes/${route.params?.id}`);
      setQuiz(response.data);
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (optionId: string) => {
    if (showExplanation) return;
    
    setSelectedOption(optionId);
    const currentQuestion = quiz!.questions[currentQuestionIndex];
    const isCorrect = optionId === currentQuestion.correctOptionId;
    
    setAnswers([...answers, {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      isCorrect,
    }]);
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex === quiz!.questions.length - 1) {
      setQuizCompleted(true);
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const renderScore = () => {
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const totalQuestions = quiz!.questions.length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    return (
      <View style={[styles.scoreCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.scoreTitle, { color: colors.onSurface }]}>
          Quiz Complete!
        </Text>
        <Text style={[styles.scoreText, { color: colors.primary }]}>
          {correctAnswers} / {totalQuestions}
        </Text>
        <Text style={[styles.scorePercentage, { color: colors.onSurfaceVariant }]}>
          {percentage.toFixed(1)}%
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.finishButton}
        >
          Finish
        </Button>
      </View>
    );
  };

  const renderQuestion = (question: Question) => (
    <View style={styles.questionContainer}>
      <Text style={[styles.questionText, { color: colors.onSurface }]}>
        {question.text}
      </Text>
      <View style={styles.options}>
        {question.options.map((option) => (
          <Chip
            key={option.id}
            selected={selectedOption === option.id}
            onPress={() => handleAnswer(option.id)}
            style={[
              styles.option,
              { 
                backgroundColor: showExplanation
                  ? option.id === question.correctOptionId
                    ? colors.primary
                    : selectedOption === option.id
                    ? colors.surfaceVariant
                    : colors.surfaceVariant
                  : selectedOption === option.id
                  ? colors.primary
                  : colors.surfaceVariant
              }
            ]}
            textStyle={{ 
              color: showExplanation
                ? option.id === question.correctOptionId || selectedOption === option.id
                  ? colors.surface
                  : colors.onSurfaceVariant
                : selectedOption === option.id
                ? colors.surface
                : colors.onSurfaceVariant
            }}
          >
            {option.text}
          </Chip>
        ))}
      </View>
      {showExplanation && (
        <View style={[styles.explanation, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.explanationText, { color: colors.onSurfaceVariant }]}>
            {question.explanation}
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      </View>
    );
  }

  if (error || !quiz) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.error, { color: colors.onSurfaceVariant }]}>{error}</Text>
      </View>
    );
  }

  if (quizCompleted) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderScore()}
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <IconButton
            icon="arrow-back"
            size={24}
            onPress={() => navigation.goBack()}
            iconColor={colors.onSurface}
          />
          <Text style={[styles.progress, { color: colors.onSurfaceVariant }]}>
            {currentQuestionIndex + 1} / {quiz.questions.length}
          </Text>
        </View>
        <ProgressBar 
          progress={Number(((currentQuestionIndex + 1) / quiz.questions.length).toFixed(2))}
          color={colors.primary}
          style={styles.progressBar}
        />
      </View>

      <ScrollView style={styles.content}>
        {renderQuestion(quiz.questions[currentQuestionIndex])}
      </ScrollView>

      {showExplanation && (
        <View style={[styles.footer, { backgroundColor: colors.surface }]}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.nextButton}
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  progress: {
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  questionContainer: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 24,
  },
  options: {
    gap: 12,
  },
  option: {
    marginBottom: 8,
  },
  explanation: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  nextButton: {
    marginTop: 8,
  },
  scoreCard: {
    margin: 16,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scorePercentage: {
    fontSize: 20,
    marginBottom: 24,
  },
  finishButton: {
    minWidth: 200,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    padding: 16,
    textAlign: 'center',
  },
}); 