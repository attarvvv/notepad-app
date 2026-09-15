import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
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
    <View className={`p-5 items-center justify-center ${fullScreen ? 'flex-1 bg-black' : ''}`}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? <Text className="text-[15px] text-[#8E8E93] mt-3">{message}</Text> : null}
    </View>
  );
};
