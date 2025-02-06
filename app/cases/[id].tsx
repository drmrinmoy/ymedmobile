import { useLocalSearchParams } from 'expo-router';
import CaseDetailScreen from '../../src/screens/CaseDetailScreen';

export default function CaseDetailRoute() {
  const { id } = useLocalSearchParams();
  return <CaseDetailScreen id={id as string} />;
} 