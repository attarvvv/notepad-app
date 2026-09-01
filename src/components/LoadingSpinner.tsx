import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/colors';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  fullScreen = false,
}) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  message: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
