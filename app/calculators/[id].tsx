import { useLocalSearchParams } from 'expo-router';
import CalculatorDetailScreen from '../../src/screens/CalculatorDetailScreen';

export default function CalculatorDetailRoute() {
  const { id } = useLocalSearchParams();
  return <CalculatorDetailScreen id={id as string} />;
} 