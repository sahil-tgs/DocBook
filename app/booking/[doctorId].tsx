import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  Modal,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock doctor data (same as home screen)
const doctors = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '12 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    education: 'MBBS, MD - AIIMS Delhi',
    location: 'Apollo Hospitals, Delhi',
    fee: '₹800',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatologist',
    rating: 4.9,
    experience: '8 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    education: 'MBBS, MD - KEM Mumbai',
    location: 'Fortis Healthcare, Mumbai',
    fee: '₹600',
  },
  {
    id: '3',
    name: 'Dr. Anitha Menon',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '15 years',
    availability: 'Busy',
    photo: 'https://images.unsplash.com/photo-1594824388853-2c5bb9c71e06?w=150&h=150&fit=crop&crop=face',
    education: 'MBBS, MD - CMC Vellore',
    location: 'Max Healthcare, Bangalore',
    fee: '₹700',
  },
  {
    id: '4',
    name: 'Dr. Vikash Singh',
    specialty: 'Orthopedic',
    rating: 4.6,
    experience: '10 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    education: 'MBBS, MS - PGIMER Chandigarh',
    location: 'AIIMS Delhi',
    fee: '₹900',
  },
  {
    id: '5',
    name: 'Dr. Sunita Reddy',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '18 years',
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face',
    education: 'MBBS, DM - NIMHANS Bangalore',
    location: 'Manipal Hospitals, Bangalore',
    fee: '₹1200',
  },
];

// Time slots for appointments
const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
];

export default function BookingScreen() {
  const { doctorId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState<Array<{date: string, formatted: string, day: string}>>([]);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [existingAppointments, setExistingAppointments] = useState<any[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Find doctor by ID
    const foundDoctor = doctors.find(d => d.id === doctorId);
    setDoctor(foundDoctor);

    // Generate next 7 days
    generateAvailableDates();
    
    // Load existing appointments
    loadExistingAppointments();
  }, [doctorId]);

  useEffect(() => {
    // Update booked slots when date changes
    updateBookedSlots();
  }, [selectedDate, existingAppointments]);

  const loadExistingAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        const appointments = JSON.parse(storedAppointments);
        setExistingAppointments(appointments);
      }
    } catch (error) {
      console.log('Error loading appointments:', error);
    }
  };

  const updateBookedSlots = () => {
    if (!selectedDate || !doctor) return;

    const bookedTimes = existingAppointments
      .filter(apt => 
        apt.doctorName === doctor.name && 
        apt.date === selectedDate && 
        apt.status === 'scheduled'
      )
      .map(apt => apt.time);

    setBookedSlots(new Set(bookedTimes));
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const day = date.toLocaleDateString('en-US', {
        weekday: 'short',
      });

      dates.push({
        date: dateString,
        formatted,
        day,
      });
    }
    
    setAvailableDates(dates);
    // Auto-select first date
    if (dates.length > 0) {
      setSelectedDate(dates[0].date);
    }
  };

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

  const isTimeSlotBooked = (time: string) => {
    return bookedSlots.has(time);
  };

  const handleTimeSelection = (time: string) => {
    if (isTimeSlotBooked(time)) {
      Alert.alert(
        'Slot Unavailable',
        'This time slot is already booked. Please select a different time.',
        [{ text: 'OK' }]
      );
      return;
    }
    setSelectedTime(time);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time for your appointment');
      return;
    }

    if (isTimeSlotBooked(selectedTime)) {
      Alert.alert('Error', 'This time slot is no longer available. Please select a different time.');
      return;
    }

    setLoading(true);

    try {
      // Generate appointment ID
      const appointmentId = Date.now().toString();
      
      // Create appointment object
      const newAppointment = {
        id: appointmentId,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        date: selectedDate,
        time: selectedTime,
        reason: reason.trim() || 'General consultation',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
      };

      // Add new appointment
      const updatedAppointments = [...existingAppointments, newAppointment];
      
      // Save back to storage
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      
      // Update local state
      setExistingAppointments(updatedAppointments);
      
      // Show success modal
      setShowSuccessModal(true);

    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setSelectedTime('');
    setReason('');
  };

  if (!doctor) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Loading doctor information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Book Appointment',
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

      {/* Scroll Indicator */}
      <View style={styles.scrollIndicator}>
        <Ionicons name="chevron-down" size={16} color="#6b7280" />
        <Text style={styles.scrollText}>Scroll down for more options</Text>
        <Ionicons name="chevron-down" size={16} color="#6b7280" />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={true}
        indicatorStyle="default"
      >
        {/* Doctor Info Header */}
        <View style={styles.doctorHeader}>
          <View style={styles.doctorImageContainer}>
            <Image
              source={{ uri: doctor.photo }}
              style={styles.doctorImage}
              defaultSource={require('../../assets/images/icon.png')}
            />
          </View>
          
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{doctor.name}</Text>
            <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
            
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(doctor.rating)}
              </View>
              <Text style={styles.ratingText}>{doctor.rating}</Text>
              <Text style={styles.experienceText}>• {doctor.experience}</Text>
            </View>

            <View style={styles.doctorDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="school-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>{doctor.education}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>{doctor.location}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="card-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>Consultation Fee: {doctor.fee}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            <View style={styles.swipeIndicator}>
              <Ionicons name="chevron-back" size={16} color="#9ca3af" />
              <Text style={styles.swipeText}>Swipe</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScrollContainer}
          >
            {availableDates.map((dateObj) => (
              <TouchableOpacity
                key={dateObj.date}
                style={[
                  styles.dateCard,
                  selectedDate === dateObj.date && styles.selectedDateCard
                ]}
                onPress={() => setSelectedDate(dateObj.date)}
              >
                <Text style={[
                  styles.dayText,
                  selectedDate === dateObj.date && styles.selectedDateText
                ]}>
                  {dateObj.day}
                </Text>
                <Text style={[
                  styles.dateText,
                  selectedDate === dateObj.date && styles.selectedDateText
                ]}>
                  {dateObj.formatted}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Select Time</Text>
            <View style={styles.swipeIndicator}>
              <Ionicons name="chevron-back" size={16} color="#9ca3af" />
              <Text style={styles.swipeText}>Swipe</Text>
              <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
            </View>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.timeScrollContainer}
          >
            {timeSlots.map((time) => {
              const isBooked = isTimeSlotBooked(time);
              const isSelected = selectedTime === time;
              
              return (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeSlot,
                    isSelected && styles.selectedTimeSlot,
                    isBooked && styles.bookedTimeSlot
                  ]}
                  onPress={() => handleTimeSelection(time)}
                  disabled={isBooked}
                >
                  <Text style={[
                    styles.timeText,
                    isSelected && styles.selectedTimeText,
                    isBooked && styles.bookedTimeText
                  ]}>
                    {time}
                  </Text>
                  {isBooked && (
                    <Text style={styles.bookedLabel}>Booked</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Reason Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Visit (Optional)</Text>
          <TextInput
            style={styles.reasonInput}
            placeholder="Describe your symptoms or reason for consultation..."
            value={reason}
            onChangeText={setReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Bottom spacing for sticky button */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={[styles.stickyButtonContainer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookAppointment}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : 'Book Appointment'}
          </Text>
          {!loading && (
            <Ionicons name="calendar" size={20} color="#ffffff" style={styles.buttonIcon} />
          )}
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        animationType="fade"
        transparent={true}
        onRequestClose={handleSuccessModalClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={styles.successIcon}>
                <Ionicons name="checkmark-circle" size={50} color="#059669" />
              </View>
              <Text style={styles.modalTitle}>Booking Confirmed!</Text>
              <Text style={styles.modalMessage}>
                Your appointment with {doctor.name} has been successfully booked for{' '}
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })} at {selectedTime}.
              </Text>
            </View>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  handleSuccessModalClose();
                  router.push('/(tabs)/appointments');
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#2563eb" />
                <Text style={styles.modalButtonText}>View My Appointments</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleSuccessModalClose}
              >
                <Ionicons name="add-circle-outline" size={20} color="#6b7280" />
                <Text style={[styles.modalButtonText, styles.secondaryButtonText]}>Book Another Appointment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scrollText: {
    fontSize: 12,
    color: '#6b7280',
    marginHorizontal: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  doctorHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    flexDirection: 'row',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  doctorImageContainer: {
    marginRight: 15,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e5e7eb',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
  experienceText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  doctorDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 15,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  swipeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  swipeText: {
    fontSize: 12,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  dateScrollContainer: {
    paddingRight: 20,
  },
  dateCard: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  selectedDateCard: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  dayText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: 'bold',
  },
  selectedDateText: {
    color: '#ffffff',
  },
  timeScrollContainer: {
    paddingRight: 20,
  },
  timeSlot: {
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 90,
  },
  selectedTimeSlot: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  bookedTimeSlot: {
    backgroundColor: '#f3f4f6',
    borderColor: '#d1d5db',
    opacity: 0.6,
  },
  timeText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  selectedTimeText: {
    color: '#ffffff',
  },
  bookedTimeText: {
    color: '#9ca3af',
  },
  bookedLabel: {
    fontSize: 10,
    color: '#dc2626',
    marginTop: 2,
    fontWeight: '500',
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9fafb',
    height: 100,
  },
  bottomSpacing: {
    height: 20,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  bookButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonIcon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 25,
    maxWidth: 400,
    width: '100%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  successIcon: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  secondaryButton: {
    backgroundColor: '#f9fafb',
    borderColor: '#d1d5db',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#6b7280',
  },
});