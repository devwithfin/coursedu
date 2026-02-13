import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
// Note: register API call is removed, so no need to import 'register' from '../../api/auth';
// Import login and logout if needed for shared functions, but register should be self-contained

export default function RegisterMobileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // Still use loading for simulated API delay if desired
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required for registration.');
      Alert.alert('Registration Failed', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      Alert.alert('Registration Failed', 'Passwords do not match.');
      return;
    }

    setLoading(true); // Simulate loading

    // Simulate registration success after a short delay
    setTimeout(() => {
        Alert.alert('Registration Successful', 'You have been successfully registered. Please log in.');
        navigation.goBack(); // Go back to the Login screen
        // Optionally, pre-fill email field on Login screen, if needed (requires route params)
        setLoading(false);
    }, 1000); // 1 second delay
  };

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/logo-blue.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.description}>Create your account to get started</Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <View style={styles.switchContainer}>
          <TouchableOpacity style={styles.switchButton} onPress={() => navigation.goBack()}>
            <Text style={styles.switchButtonText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.switchButton, styles.activeSwitchButton]}>
            <Text style={[styles.switchButtonText, styles.activeSwitchButtonText]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
        style={styles.input}
      />
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

      <Text style={styles.label}>Confirm Password</Text>
      <View style={styles.passwordInputContainer}>
        <TextInput
          placeholder="*******"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showPassword} // Use same show/hide for both password fields
          style={styles.passwordInput}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.passwordToggle}>
          <Text>{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#F9FAFB" />
        ) : (
          <Text style={styles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupTextContainer}>
        <Text style={styles.signupText}>Already have an account? <Text style={styles.signupLink} onPress={() => navigation.goBack()}>Sign In</Text></Text>
      </TouchableOpacity>
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