import { useLocalSearchParams } from 'expo-router';
import QuizDetailScreen from '../../src/screens/QuizDetailScreen';

export default function QuizDetailRoute() {
  const { id } = useLocalSearchParams();
  return <QuizDetailScreen id={id as string} />;
} 