import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Dimensions, StatusBar, Image, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING } from '../constants/theme';
import { useToast, Toast, ToastTitle, ToastDescription } from '@gluestack-ui/themed';
import { apiUrl } from '@/constants/api';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const role = await AsyncStorage.getItem('userRole');
      if (role) {
        if (role === 'admin') router.replace('/admin/dashboard');
        else if (role === 'manager') router.replace('/manager/dashboard');
      }
    };
    checkSession();
  }, []);

  const showToast = (title: string, description: string, action: 'error' | 'success' | 'info' = 'error') => {
    toast.show({
      placement: 'top',
      render: ({ id }) => {
        return (
          <Toast nativeID={id} action={action} variant="solid">
            <ToastTitle>{title}</ToastTitle>
            <ToastDescription>{description}</ToastDescription>
          </Toast>
        );
      },
    });
  };

  const handleLogin = async () => {
    try {
      const response = await fetch(apiUrl('/api/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const role = data.role;

        if (role === 'admin' || role === 'manager') {
          await AsyncStorage.setItem('userRole', role);
          showToast('Login Berhasil', `Selamat datang, ${role}!`, 'success');
          
          if (role === 'admin') {
            router.replace('/admin/dashboard');
          } else {
            router.replace('/manager/dashboard');
          }
        } else {
          showToast('Login Gagal', 'Akses hanya diizinkan untuk Admin dan Manager.');
        }

      } else {
        showToast('Login Gagal', data.message || 'Terjadi kesalahan');
      }
    } catch (error) {
      showToast('Login Gagal', 'Tidak dapat terhubung ke server.');
    }
  };

  const handleForgotPassword = () => {
    showToast("Lupa Password", "Fitur reset password akan segera hadir.", 'info');
  };

  const handleRegister = () => {
    showToast("Registrasi", "Silakan hubungi Admin Akademik untuk pendaftaran akun baru.", 'info');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ title: 'LMS' }} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

          {/* --- BACKGROUND HEADER --- */}
          <View style={styles.headerBackground}>
            <View style={styles.circle1} />
            <View style={styles.circle2} />
          </View>

          {/* --- LOGO & TITLE --- */}
          <View style={styles.logoContainer}>
            <View style={styles.logoBox}>
              <Image
                source={require('../assets/images/logo.png')}
                style={{ width: 100, height: 94 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Selamat Datang!</Text>
            <Text style={styles.subtitle}>Silakan masuk untuk melanjutkan belajar.</Text>
          </View>

          {/* --- LOGIN CARD --- */}
          <View style={styles.card}>

            {/* Input Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Contoh: siti, budi, admin"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>

            {/* Input Password */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* NEW: Lupa Password (Aligned Right) */}
            <TouchableOpacity style={styles.forgotPassBtn} onPress={handleForgotPassword}>
              <Text style={styles.forgotPassText}>Lupa Password?</Text>
            </TouchableOpacity>

            {/* Button Masuk */}
            <TouchableOpacity style={styles.loginBtn} activeOpacity={0.8} onPress={handleLogin}>
              <Text style={styles.loginText}>Masuk Sekarang</Text>
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>

            {/* NEW: Register Section (Centered Bottom) */}
            <View style={styles.registerContainer}>
              <Text style={styles.registerLabel}>Belum punya akun? </Text>
              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerLink}>Daftar Disini</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },

  headerBackground: {
    position: 'absolute', top: 0, left: 0, right: 0, height: height * 0.45,
    backgroundColor: COLORS.primary, borderBottomRightRadius: 80, overflow: 'hidden',
  },
  circle1: {
    position: 'absolute', top: -50, left: -50, width: 200, height: 200,
    borderRadius: 100, backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle2: {
    position: 'absolute', top: 50, right: -20, width: 300, height: 300,
    borderRadius: 150, backgroundColor: 'rgba(255,255,255,0.08)',
  },

  logoContainer: { alignItems: 'center', marginTop: height * 0.12, marginBottom: 30 },
  logoBox: {
    width: 120, height: 120, backgroundColor: 'white', borderRadius: 30,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12
  },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },

  card: {
    backgroundColor: 'white', marginHorizontal: 24, borderRadius: 24, padding: 24,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8,
    marginBottom: 40
  },
  label: { fontSize: 14, fontWeight: 'bold', color: '#1F2937', marginBottom: 8, marginTop: 4 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB',
    borderRadius: 12, paddingHorizontal: 16, height: 50, marginBottom: 16, borderWidth: 1, borderColor: '#F3F4F6'
  },
  input: { flex: 1, color: '#1F2937', fontSize: 14 },

  forgotPassBtn: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPassText: { color: COLORS.primary, fontWeight: '600', fontSize: 13 },

  loginBtn: {
    backgroundColor: COLORS.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    height: 54, borderRadius: 14, marginBottom: 24,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4
  },
  loginText: { color: 'white', fontWeight: 'bold', fontSize: 16, marginRight: 8 },

  registerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  registerLabel: { color: '#6B7280', fontSize: 14 },
  registerLink: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 },
});

