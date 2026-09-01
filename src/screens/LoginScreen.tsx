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
import { Mail, Lock, BookOpen, AlertCircle } from 'lucide-react-native';
import { AuthStackParamList } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { theme } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import { isSupabaseConfigured } from '../lib/supabase';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
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
      const { error } = await signIn(email, password);
      if (error) {
        setErrors({ general: error.message });
        Alert.alert('Login Failed', error.message);
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
          { paddingTop: insets.top + 30, paddingBottom: insets.bottom + 20 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.brandingContainer}>
          <View style={styles.logoCircle}>
            <BookOpen size={36} color={theme.colors.primary} />
          </View>
          <Text style={styles.appTitle}>Notepad</Text>
          <Text style={styles.tagline}>Capture thoughts with ease & clarity</Text>
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
          <Text style={styles.formTitle}>Welcome back</Text>
          <Text style={styles.formSubtitle}>Sign in to access your saved notes</Text>

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
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            isPassword
            error={errors.password}
            leftIcon={<Lock size={18} color={theme.colors.textMuted} />}
          />

          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.signInButton}
          />
        </View>

        {/* Switch to Register */}
        <View style={styles.switchAuthContainer}>
          <Text style={styles.switchAuthText}>Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.switchAuthLink}>Create account</Text>
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
    marginBottom: theme.spacing.xxl,
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  signInButton: {
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
