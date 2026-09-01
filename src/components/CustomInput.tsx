import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '../theme/colors';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  isPassword?: boolean;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  containerStyle,
  isPassword = false,
  secureTextEntry,
  style,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={isPassword ? !showPassword : secureTextEntry}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={() => setShowPassword(!showPassword)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.colors.textSecondary} />
            ) : (
              <Eye size={20} color={theme.colors.textSecondary} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    ...theme.typography.bodySmall,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs + 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 50,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.surfaceSubtle,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  leftIconContainer: {
    marginRight: theme.spacing.sm,
  },
  rightIconContainer: {
    padding: theme.spacing.xs,
  },
  input: {
    flex: 1,
    ...theme.typography.bodyMedium,
    color: theme.colors.textPrimary,
    height: '100%',
  },
  errorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
});
