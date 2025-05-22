import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const contactMethods = [
    {
      icon: 'call',
      title: 'Phone Support',
      subtitle: '24/7 Customer Service',
      value: '+1 (555) 123-4567',
      action: () => Linking.openURL('tel:+15551234567'),
    },
    {
      icon: 'mail',
      title: 'Email Support',
      subtitle: 'Response within 24 hours',
      value: 'support@docbook.com',
      action: () => Linking.openURL('mailto:support@docbook.com'),
    },
    {
      icon: 'chatbubbles',
      title: 'Live Chat',
      subtitle: 'Available 9 AM - 6 PM',
      value: 'Start Chat',
      action: () => Alert.alert('Coming Soon', 'Live chat feature will be available soon!'),
    },
    {
      icon: 'location',
      title: 'Visit Us',
      subtitle: 'Main Office',
      value: '123 Health St, Medical City',
      action: () => Linking.openURL('https://maps.google.com/?q=123+Health+St+Medical+City'),
    },
  ];

  const faqItems = [
    {
      question: 'How do I book an appointment?',
      answer: 'Simply browse our list of doctors, select your preferred doctor, choose a date and time, and confirm your booking.',
    },
    {
      question: 'Can I cancel my appointment?',
      answer: 'Yes, you can cancel your appointment up to 2 hours before the scheduled time through the app.',
    },
    {
      question: 'Are the doctors verified?',
      answer: 'All doctors on our platform are verified healthcare professionals with proper licenses and credentials.',
    },
    {
      question: 'How much does it cost?',
      answer: 'Consultation fees vary by doctor and specialty. You can see the fee before booking an appointment.',
    },
  ];

  const handleSubmitForm = async () => {
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Thank You!',
        'Your message has been sent successfully. Our team will get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setName('');
              setEmail('');
              setSubject('');
              setMessage('');
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Contact Us',
          headerStyle: {
            backgroundColor: '#2563eb',
          },
          headerTitleStyle: {
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 'bold',
          },
          headerTintColor: '#ffffff',
          headerSafeAreaInsets: { top: insets.top },
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Get in Touch</Text>
          <Text style={styles.headerSubtitle}>
            We're here to help you with any questions or concerns
          </Text>
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Methods</Text>
          <View style={styles.contactMethodsContainer}>
            {contactMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactMethod}
                onPress={method.action}
                activeOpacity={0.7}
              >
                <View style={styles.contactIconContainer}>
                  <Ionicons name={method.icon as any} size={24} color="#2563eb" />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactTitle}>{method.title}</Text>
                  <Text style={styles.contactSubtitle}>{method.subtitle}</Text>
                  <Text style={styles.contactValue}>{method.value}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Contact Form */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Send us a Message</Text>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Subject *</Text>
              <TextInput
                style={styles.input}
                placeholder="What is this regarding?"
                value={subject}
                onChangeText={setSubject}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Message *</Text>
              <TextInput
                style={[styles.input, styles.messageInput]}
                placeholder="Describe your question or concern in detail..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={5}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmitForm}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? 'Sending...' : 'Send Message'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <View key={index} style={styles.faqItem}>
                <Text style={styles.faqQuestion}>{item.question}</Text>
                <Text style={styles.faqAnswer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Emergency Contact */}
        <View style={styles.section}>
          <View style={styles.emergencyContainer}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color="#dc2626" />
              <Text style={styles.emergencyTitle}>Medical Emergency?</Text>
            </View>
            <Text style={styles.emergencyDescription}>
              If you're experiencing a medical emergency, please call emergency services immediately.
            </Text>
            <TouchableOpacity
              style={styles.emergencyButton}
              onPress={() => Linking.openURL('tel:911')}
            >
              <Text style={styles.emergencyButtonText}>Call Emergency: 911</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Office Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Office Hours</Text>
          <View style={styles.hoursContainer}>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Monday - Friday</Text>
              <Text style={styles.timeText}>9:00 AM - 6:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Saturday</Text>
              <Text style={styles.timeText}>10:00 AM - 4:00 PM</Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Text style={styles.timeText}>Closed</Text>
            </View>
            <View style={styles.supportNote}>
              <Ionicons name="information-circle" size={16} color="#6b7280" />
              <Text style={styles.supportNoteText}>
                Phone support is available 24/7 for urgent matters
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSection: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    lineHeight: 22,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  contactMethodsContainer: {
    gap: 12,
  },
  contactMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
  },
  contactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  contactSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  formContainer: {
    gap: 15,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  messageInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  faqContainer: {
    gap: 15,
  },
  faqItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  emergencyContainer: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
    marginLeft: 10,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#7f1d1d',
    marginBottom: 15,
    lineHeight: 20,
  },
  emergencyButton: {
    backgroundColor: '#dc2626',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hoursContainer: {
    gap: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  supportNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  supportNoteText: {
    fontSize: 14,
    color: '#1e40af',
    marginLeft: 8,
    flex: 1,
  },
});