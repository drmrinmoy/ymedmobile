import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView as RNTabView, TabBar } from 'react-native-tab-view';
import { useTheme } from 'react-native-paper';
import { getColorString } from '../utils/colors';

interface TabViewProps {
  routes: { key: string; title: string }[];
  renderScene: ({ route }: { route: { key: string } }) => React.ReactNode;
}

export function TabView({ routes, renderScene }: TabViewProps) {
  const [index, setIndex] = React.useState(0);
  const theme = useTheme();
  const layout = useWindowDimensions();

  return (
    <RNTabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={props => (
        <TabBar
          {...props}
          style={{ backgroundColor: theme.colors.surface }}
          indicatorStyle={{ backgroundColor: theme.colors.primary }}
          activeColor={theme.colors.primary}
          inactiveColor={theme.colors.onSurfaceVariant}
          tabStyle={{ backgroundColor: theme.colors.surface }}
        />
      )}
    />
  );
} 