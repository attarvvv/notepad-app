import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StickyNote, SearchX } from 'lucide-react-native';
import { theme } from '../theme/colors';
import { CustomButton } from './CustomButton';

interface EmptyStateProps {
  type?: 'empty' | 'search';
  title?: string;
  description?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type = 'empty',
  title,
  description,
  actionTitle,
  onAction,
}) => {
  const defaultTitle = type === 'empty' ? 'No notes yet' : 'No notes found';
  const defaultDescription =
    type === 'empty'
      ? 'Tap the + button below to create your first note and jot down your thoughts.'
      : "We couldn't find any notes matching your search query.";

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {type === 'empty' ? (
          <StickyNote size={48} color={theme.colors.primary} strokeWidth={1.5} />
        ) : (
          <SearchX size={48} color={theme.colors.primary} strokeWidth={1.5} />
        )}
      </View>
      <Text style={styles.title}>{title || defaultTitle}</Text>
      <Text style={styles.description}>{description || defaultDescription}</Text>
      {actionTitle && onAction && (
        <CustomButton
          title={actionTitle}
          onPress={onAction}
          variant="secondary"
          size="sm"
          style={styles.actionButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
    paddingVertical: theme.spacing.xxxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: theme.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    ...theme.typography.titleMedium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  description: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    marginTop: theme.spacing.lg,
  },
});
