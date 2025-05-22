import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const features = [
    {
      icon: 'calendar-outline',
      title: 'Easy Booking',
      description: 'Book appointments with top-rated doctors in just a few taps'
    },
    {
      icon: 'shield-checkmark-outline',
      title: 'Secure & Private',
      description: 'Your health data is protected with industry-standard security'
    },
    {
      icon: 'time-outline',
      title: '24/7 Access',
      description: 'Book appointments anytime, anywhere with our mobile app'
    },
    {
      icon: 'people-outline',
      title: 'Expert Doctors',
      description: 'Connect with verified and experienced healthcare professionals'
    },
  ];

  const teamMembers = [
    {
      name: 'Dr. Amit Gupta',
      role: 'Chief Medical Officer',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Priyanka Sharma',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b9507cee?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Sahil Mandi',
      role: 'Tech Lead',
      image: require('../assets/images/1687444501219.jpeg')
    },
  ];

  const openLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.log('Error opening link:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'About Us',
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
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Ionicons name="medical" size={40} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.appName}>DocBook</Text>
          <Text style={styles.tagline}>Your Health, Our Priority</Text>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Mission</Text>
          <Text style={styles.missionText}>
            At DocBook, we believe that quality healthcare should be accessible to every Indian. 
            Our mission is to bridge the gap between patients and healthcare providers across India by 
            providing a seamless, user-friendly platform that makes booking medical appointments 
            as easy as ordering your favorite meal. From metros to tier-2 cities, we're democratizing healthcare access.
          </Text>
        </View>

        {/* Features Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Why Choose DocBook?</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <Ionicons name={feature.icon as any} size={24} color="#2563eb" />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.storyText}>
            Founded in 2024, DocBook was born from the simple observation that booking 
            a doctor's appointment shouldn't be complicated in modern India. Our team of healthcare 
            professionals and technology experts came together to create a solution 
            that puts patients first.
          </Text>
          <Text style={styles.storyText}>
            Today, we're proud to serve thousands of patients across major Indian cities, 
            connecting them with the best healthcare providers in their area. We're 
            not just a booking platform – we're your partner in health, understanding 
            the unique healthcare needs of Indian families.
          </Text>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet Our Team</Text>
          <View style={styles.teamContainer}>
            {teamMembers.map((member, index) => (
              <View key={index} style={styles.teamMember}>
                <Image
                  source={typeof member.image === 'string' ? { uri: member.image } : member.image}
                  style={styles.teamImage}
                  defaultSource={require('../assets/icon.png')}
                />
                <Text style={styles.teamName}>{member.name}</Text>
                <Text style={styles.teamRole}>{member.role}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valuesList}>
            <View style={styles.valueItem}>
              <Ionicons name="heart" size={20} color="#dc2626" />
              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>Compassion</Text>
                <Text style={styles.valueDescription}>
                  We care deeply about every patient's wellbeing and health journey
                </Text>
              </View>
            </View>
            <View style={styles.valueItem}>
              <Ionicons name="checkmark-circle" size={20} color="#059669" />
              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>Trust</Text>
                <Text style={styles.valueDescription}>
                  Building lasting relationships through transparency and reliability
                </Text>
              </View>
            </View>
            <View style={styles.valueItem}>
              <Ionicons name="flash" size={20} color="#d97706" />
              <View style={styles.valueContent}>
                <Text style={styles.valueTitle}>Innovation</Text>
                <Text style={styles.valueDescription}>
                  Continuously improving healthcare access through technology
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact CTA */}
        <View style={styles.section}>
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaTitle}>Have Questions?</Text>
            <Text style={styles.ctaDescription}>
              Our support team is here to help you 24/7
            </Text>
            <TouchableOpacity 
              style={styles.ctaButton}
              onPress={() => openLink('mailto:support@docbook.in')}
            >
              <Text style={styles.ctaButtonText}>Contact Support</Text>
            </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 18,
    color: '#bfdbfe',
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  missionText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  featuresGrid: {
    gap: 15,
  },
  featureCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    textAlign: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  storyText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 15,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 20,
  },
  teamMember: {
    alignItems: 'center',
    width: '30%',
    minWidth: 100,
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: '#e5e7eb',
  },
  teamName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamRole: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  valuesList: {
    gap: 15,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  valueContent: {
    flex: 1,
    marginLeft: 15,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  valueDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  ctaContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});