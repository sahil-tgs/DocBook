import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock doctor data
const doctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '12 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    rating: 4.9,
    experience: '8 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '15 years',
    availability: 'Busy',
    photo: 'https://images.unsplash.com/photo-1594824388853-2c5bb9c71e06?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '4',
    name: 'Dr. David Kim',
    specialty: 'Orthopedic',
    rating: 4.6,
    experience: '10 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '18 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face',
  },
];

export default function HomeScreen() {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={14} color="#fbbf24" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={14} color="#fbbf24" />
      );
    }

    return stars;
  };

  const handleDoctorPress = (doctorId: string) => {
    router.push(`/booking/${doctorId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <Text style={styles.subtitle}>Book an appointment with</Text>
        <Text style={styles.title}>Top Rated Doctors</Text>
      </View>

      {/* Doctor List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.doctorCard}
            onPress={() => handleDoctorPress(doctor.id)}
            activeOpacity={0.8}
          >
            <View style={styles.cardContent}>
              {/* Doctor Photo */}
              <View style={styles.photoContainer}>
                <Image
                  source={{ uri: doctor.photo }}
                  style={styles.doctorPhoto}
                  defaultSource={require('../../assets/adaptive-icon.png')}
                />
                <View style={[
                  styles.availabilityBadge,
                  doctor.availability === 'Available' 
                    ? styles.availableBadge 
                    : styles.busyBadge
                ]}>
                  <Text style={[
                    styles.availabilityText,
                    doctor.availability === 'Available' 
                      ? styles.availableText 
                      : styles.busyText
                  ]}>
                    {doctor.availability}
                  </Text>
                </View>
              </View>

              {/* Doctor Info */}
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{doctor.name}</Text>
                <Text style={styles.specialty}>{doctor.specialty}</Text>
                
                <View style={styles.ratingContainer}>
                  <View style={styles.starsContainer}>
                    {renderStars(doctor.rating)}
                  </View>
                  <Text style={styles.ratingText}>{doctor.rating}</Text>
                </View>

                <Text style={styles.experience}>{doctor.experience} experience</Text>
              </View>

              {/* Arrow Icon */}
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={24} color="#6b7280" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerSection: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  doctorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoContainer: {
    position: 'relative',
    marginRight: 15,
  },
  doctorPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e5e7eb',
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  availableBadge: {
    backgroundColor: '#dcfce7',
  },
  busyBadge: {
    backgroundColor: '#fee2e2',
  },
  availabilityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  availableText: {
    color: '#059669',
  },
  busyText: {
    color: '#dc2626',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  experience: {
    fontSize: 12,
    color: '#6b7280',
  },
  arrowContainer: {
    marginLeft: 10,
  },
}); 