import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { theme } from '../theme/colors';

export const RootNavigator: React.FC = () => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner message="Initializing your notes..." />
      </View>
    );
  }

  return session ? <AppStack /> : <AuthStack />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
