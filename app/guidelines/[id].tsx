import { useLocalSearchParams } from 'expo-router';
import GuidelineDetailScreen from '../../src/screens/GuidelineDetailScreen';

export default function GuidelineDetailRoute() {
  const { id } = useLocalSearchParams();
  return <GuidelineDetailScreen id={id as string} />;
} 