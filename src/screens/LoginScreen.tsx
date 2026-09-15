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
      className="flex-1 bg-black"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          justifyContent: 'center',
          paddingTop: insets.top + 30,
          paddingBottom: insets.bottom + 20,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View className="items-center mb-6">
          <View className="w-[72px] h-[72px] rounded-[36px] bg-[#1C1C1E] items-center justify-center border border-[#2C2C2E] mb-3">
            <BookOpen size={36} color={theme.colors.primary} />
          </View>
          <Text className="text-[28px] font-bold text-white tracking-tight">Notepad</Text>
          <Text className="text-[15px] text-[#8E8E93] mt-1">Capture thoughts with ease & clarity</Text>
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
          <Text className="text-[17px] font-semibold text-white mb-1">Welcome back</Text>
          <Text className="text-[15px] text-[#8E8E93] mb-5">Sign in to access your saved notes</Text>

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

          <View className="mt-2">
            <CustomButton
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />
          </View>
        </View>

        {/* Switch to Register */}
        <View className="flex-row justify-center items-center mt-6">
          <Text className="text-[15px] text-[#8E8E93] mr-1">Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text className="text-[15px] text-primary font-bold">Create account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
