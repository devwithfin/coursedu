import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth
// Removed direct import for login from '../../api/auth'

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const { login: authLogin, logout } = useAuth(); // Get login and logout functions

  const handleLogin = async () => {
    setError(''); // Clear previous errors

    if (!email || !password) {
      setError('Email and password are required.');
      Alert.alert('Login Failed', 'Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const loggedInUser = await authLogin(email, password);

      if (loggedInUser && loggedInUser.role === 'admin') {
        setError('Admins cannot log in on the mobile app. Please use the web panel.');
        Alert.alert('Login Failed', 'Admins cannot log in on the mobile app. Please use the web panel.');
        // Also log the user out again so they don't get stuck
        await logout();
      }
      // For students, no navigation is needed here. The RootNavigator will handle it.

    } catch (err) {
      setError(err.message || 'An unexpected error occurred during login.');
      Alert.alert("Login Error", err.message || 'An unexpected error occurred during login.');
    } finally {
      setLoading(false);
    }
  };
  
  // Removed handleRegister function

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/logo-blue.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.description}>Please enter your details to sign in</Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <View style={styles.switchContainer}>
          <TouchableOpacity
            style={[styles.switchButton, styles.activeSwitchButton]} // Always active for Sign In
            onPress={() => {}} // No action as this is always Sign In
          >
            <Text style={[styles.switchButtonText, styles.activeSwitchButtonText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.switchButton} // Inactive for Sign Up
            onPress={() => navigation.navigate('RegisterMobile')} // Navigate to Register screen
          >
            <Text style={styles.switchButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <>
        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Enter your email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            placeholder="*******"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
            <Text>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Remember me</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#F9FAFB" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.signupTextContainer}>
          <Text style={styles.signupText}>Don’t have an account? <Text style={styles.signupLink} onPress={() => navigation.navigate('RegisterMobile')}>Sign Up</Text></Text>
        </TouchableOpacity>
      </>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 24,
    backgroundColor: '#F9FAFB',
  },
  logo: {
    marginTop: 16,
    width: 80,
    height: 75,
    alignSelf: 'center',
  },
  titleContainer: {
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  switchContainer: {
    flexDirection: 'row',
    backgroundColor: '#D1D5DB80',
    borderRadius: 9999,
    padding: 4,
    marginBottom: 32,
    width: '70%',
  },
  switchButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  activeSwitchButton: {
    backgroundColor: '#083d7f',
  },
  switchButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#4B5563',
  },
  activeSwitchButtonText: {
    color: '#F9FAFB',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 9999,
    padding: 16,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: '#083d7f',
    borderColor: '#083d7f',
  },
  checkboxLabel: {
    fontSize: 14,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#083d7f',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#083D7F',
    padding: 18,
    borderRadius: 9999,
    marginTop: 8,
  },
  buttonText: {
    color: '#F9FAFB',
    textAlign: 'center',
    fontWeight: '600',
  },
  signupTextContainer: {
    marginTop: 16,
  },
  signupText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  signupLink: {
    color: '#083D7F',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 9999,
    marginBottom: 16,
    paddingRight: 16,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
  },
  passwordToggle: {
    padding: 5,
  },
});