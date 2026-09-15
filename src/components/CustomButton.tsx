import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { theme } from '../theme/colors';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const variantStyles: Record<string, { container: string; text: string }> = {
  primary: {
    container: 'bg-[#EBB338]',
    text: 'text-black font-bold',
  },
  secondary: {
    container: 'bg-[#EBB338]/15',
    text: 'text-white font-semibold',
  },
  outline: {
    container: 'bg-transparent border-[1.5px] border-[#2C2C2E]',
    text: 'text-white font-semibold',
  },
  danger: {
    container: 'bg-[#FF453A]',
    text: 'text-white font-bold',
  },
  ghost: {
    container: 'bg-transparent',
    text: 'text-[#8E8E93]',
  },
};

const sizeStyles: Record<string, { container: string; text: string }> = {
  sm: {
    container: 'py-2 px-3.5 rounded-lg',
    text: 'text-[13px]',
  },
  md: {
    container: 'py-3 px-4.5 rounded-xl',
    text: 'text-[15px]',
  },
  lg: {
    container: 'py-4 px-6 rounded-2xl',
    text: 'text-[16px]',
  },
};

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const currentVariant = variantStyles[variant] || variantStyles.primary;
  const currentSize = sizeStyles[size] || sizeStyles.md;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      className={`items-center justify-center flex-row ${currentVariant.container} ${currentSize.container} ${
        disabled ? 'opacity-50' : ''
      }`}
      style={style}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : theme.colors.primary}
        />
      ) : (
        <View className="flex-row items-center justify-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={`text-center ${currentVariant.text} ${currentSize.text}`} style={textStyle}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
