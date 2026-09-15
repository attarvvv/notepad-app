import React, { useState } from 'react';
import {
  View,
  Text,
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
      className="flex-1 bg-black"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View className="items-center mb-5">
          <View className="w-16 h-16 rounded-[32px] bg-[#1C1C1E] items-center justify-center border border-[#2C2C2E] mb-3">
            <UserPlus size={32} color={theme.colors.primary} />
          </View>
          <Text className="text-[28px] font-bold text-white tracking-tight">Create Account</Text>
          <Text className="text-[15px] text-[#8E8E93] mt-1">Start saving and organizing your notes</Text>
        </View>

        {!isSupabaseConfigured() && (
          <View className="flex-row items-center bg-[#2C2C2E] border border-[#2C2C2E] rounded-xl p-3 mb-4">
            <AlertCircle size={18} color={theme.colors.textSecondary} className="mr-2" />
            <Text className="text-[13px] text-[#8E8E93] flex-1">
              Connect your Supabase credentials in <Text className="font-semibold text-white">src/lib/supabase.ts</Text>
            </Text>
          </View>
        )}

        {/* Card Form */}
        <View className="bg-[#1C1C1E] rounded-2xl p-5 border border-[#2C2C2E]">
          <Text className="text-[17px] font-semibold text-white mb-1">Get Started</Text>
          <Text className="text-[15px] text-[#8E8E93] mb-5">Enter your details to create an account</Text>

          {errors.general ? (
            <View className="bg-danger/20 p-3 rounded-lg mb-4">
              <Text className="text-[13px] text-danger text-center">{errors.general}</Text>
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

          <View className="mt-2">
            <CustomButton
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              size="lg"
            />
          </View>
        </View>

        {/* Switch to Login */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-[15px] text-[#8E8E93] mr-1">Already have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-[15px] text-primary font-bold">Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
