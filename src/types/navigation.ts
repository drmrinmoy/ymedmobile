import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';

export type TabParamList = {
  Home: undefined;
  Library: { activeTab?: string } | undefined;
  Search: undefined;
  AI: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  Login: undefined;
  Security: undefined;
  Billing: undefined;
  Preferences: undefined;
  Help: undefined;
  Contact: undefined;
  About: undefined;
  GuidelineDetailScreen: undefined;
  CaseDetail: { id: string };
  CalculatorDetail: { id: string };
  QuizDetail: { id: string };
  DrugDetails: { id: string };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>; 