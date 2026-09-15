import React from 'react';
import { View, Text } from 'react-native';
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
    <View className="items-center justify-center px-6 py-8">
      <View className="w-24 h-24 rounded-full bg-[#EBB338]/15 items-center justify-center mb-4">
        {type === 'empty' ? (
          <StickyNote size={48} color={theme.colors.primary} strokeWidth={1.5} />
        ) : (
          <SearchX size={48} color={theme.colors.primary} strokeWidth={1.5} />
        )}
      </View>
      <Text className="text-[17px] font-semibold text-white mb-1 text-center">
        {title || defaultTitle}
      </Text>
      <Text className="text-[15px] text-[#8E8E93] text-center leading-[22px]">
        {description || defaultDescription}
      </Text>
      {actionTitle && onAction && (
        <View className="mt-4">
          <CustomButton
            title={actionTitle}
            onPress={onAction}
            variant="secondary"
            size="sm"
          />
        </View>
      )}
    </View>
  );
};
