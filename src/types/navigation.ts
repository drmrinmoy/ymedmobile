import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Guidelines: { id: string };
  Cases: { id: string };
  Calculators: { id: string };
  Quizzes: { id: string };
  DrugDetails: { id: string };
};

export type TabParamList = {
  Home: undefined;
  Library: { activeTab?: string };
  Search: undefined;
  AI: undefined;
  Profile: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  CompositeScreenProps<
    BottomTabScreenProps<TabParamList, T>,
    NativeStackScreenProps<RootStackParamList>
  >; 