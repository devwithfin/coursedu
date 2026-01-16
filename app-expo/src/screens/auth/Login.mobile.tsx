import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/images/logo-blue.png')} style={styles.logo} />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Sign In</Text>
        <Text style={styles.description}>Please enter your details to sign in</Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <View style={styles.switchContainer}>
          <TouchableOpacity style={[styles.switchButton, styles.activeSwitchButton]}>
            <Text style={[styles.switchButtonText, styles.activeSwitchButtonText]}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.switchButton}>
            <Text style={styles.switchButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>

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
      <TextInput
        placeholder="*******"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]} />
          <Text style={styles.checkboxLabel}>Remember me</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => alert(`Email: ${email}\nPassword: ${password}`)}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupTextContainer}>
        <Text style={styles.signupText}>Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text></Text>
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
});

