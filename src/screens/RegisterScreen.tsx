import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Mail, Lock, UserPlus, AlertCircle } from 'lucide-react-native';
import { AuthStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { isSupabaseConfigured } from '../lib/supabase';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signUp, signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});

  const validate = () => {
    const nextErrors: typeof errors = {};
    if (!email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      nextErrors.password = 'Password is required';
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    if (!isSupabaseConfigured()) {
      Alert.alert(
        'Supabase Not Configured',
        'Please update your Supabase URL & Anon Key in src/lib/supabase.ts to authenticate with your live Supabase project.',
        [{ text: 'OK' }]
      );
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const { error } = await signUp(email, password);
      if (error) {
        setErrors({ general: error.message });
        Alert.alert('Registration Failed', error.message);
      } else {
        // Attempt immediate direct sign-in so user bypasses manual login / confirmation
        const loginRes = await signIn(email, password);
        if (loginRes.error) {
          // If Supabase still requires email confirmation on backend, show brief message
          Alert.alert('Notice', loginRes.error.message);
        }
      }
    } catch (err: any) {
      setErrors({ general: err.message || 'An unexpected error occurred' });
      Alert.alert('Error', err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoCircle}>
            <UserPlus size={32} color={theme.colors.primary} />
          </View>
          <Text style={styles.appTitle}>Create Account</Text>
          <Text style={styles.tagline}>Start saving and organizing your notes</Text>
        </View>

        {!isSupabaseConfigured() && (
          <View style={styles.configNotice}>
            <AlertCircle size={18} color={theme.colors.textSecondary} style={{ marginRight: 8 }} />
            <Text style={styles.configNoticeText}>
              Connect your Supabase credentials in <Text style={styles.codeText}>src/lib/supabase.ts</Text>
            </Text>
          </View>
        )}

        {/* Card Form */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Get Started</Text>
          <Text style={styles.formSubtitle}>Enter your details to create an account</Text>

          {errors.general ? (
            <View style={styles.generalErrorBox}>
              <Text style={styles.generalErrorText}>{errors.general}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Email Address"
            placeholder="you@example.com"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            error={errors.email}
            leftIcon={<Mail size={18} color={theme.colors.textMuted} />}
          />

          <CustomInput
            label="Password"
            placeholder="At least 6 characters"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            isPassword
            error={errors.password}
            leftIcon={<Lock size={18} color={theme.colors.textMuted} />}
          />

          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            isPassword
            error={errors.confirmPassword}
            leftIcon={<Lock size={18} color={theme.colors.textMuted} />}
          />

          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={styles.registerButton}
          />
        </View>

        {/* Switch to Login */}
        <View style={styles.switchAuthContainer}>
          <Text style={styles.switchAuthText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.switchAuthLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    justifyContent: 'center',
  },
  brandingContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
    ...theme.shadows.soft,
  },
  appTitle: {
    ...theme.typography.titleLarge,
    color: theme.colors.textPrimary,
  },
  tagline: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  configNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  configNoticeText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  codeText: {
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  formTitle: {
    ...theme.typography.titleMedium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  formSubtitle: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  generalErrorBox: {
    backgroundColor: theme.colors.dangerLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.lg,
  },
  generalErrorText: {
    ...theme.typography.bodySmall,
    color: theme.colors.danger,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: theme.spacing.sm,
  },
  switchAuthContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xxl,
  },
  switchAuthText: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  switchAuthLink: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
