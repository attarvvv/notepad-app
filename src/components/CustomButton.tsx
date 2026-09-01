import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
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
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'secondary':
        return {
          container: {
            backgroundColor: theme.colors.primaryLight,
            borderColor: 'transparent',
          },
          text: {
            color: theme.colors.textPrimary,
          },
        };
      case 'outline':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: theme.colors.border,
            borderWidth: 1.5,
          },
          text: {
            color: theme.colors.textPrimary,
          },
        };
      case 'danger':
        return {
          container: {
            backgroundColor: theme.colors.danger,
            borderColor: 'transparent',
          },
          text: {
            color: theme.colors.white,
          },
        };
      case 'ghost':
        return {
          container: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          },
          text: {
            color: theme.colors.textSecondary,
          },
        };
      case 'primary':
      default:
        return {
          container: {
            backgroundColor: theme.colors.primary,
            borderColor: 'transparent',
          },
          text: {
            color: '#000000',
            fontWeight: '700',
          },
        };
    }
  };

  const getSizeStyles = (): { container: ViewStyle; text: TextStyle } => {
    switch (size) {
      case 'sm':
        return {
          container: {
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderRadius: theme.borderRadius.sm,
          },
          text: {
            fontSize: 13,
            fontWeight: '600',
          },
        };
      case 'lg':
        return {
          container: {
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: theme.borderRadius.lg,
          },
          text: {
            fontSize: 16,
            fontWeight: '600',
          },
        };
      case 'md':
      default:
        return {
          container: {
            paddingVertical: 12,
            paddingHorizontal: 18,
            borderRadius: theme.borderRadius.md,
          },
          text: {
            fontSize: 15,
            fontWeight: '600',
          },
        };
    }
  };

  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        vStyles.container,
        sStyles.container,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? theme.colors.white : theme.colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.text, vStyles.text, sStyles.text, textStyle]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
});
