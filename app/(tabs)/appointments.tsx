import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  reason?: string;
}

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Load appointments when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadAppointments();
    }, [])
  );

  const loadAppointments = async () => {
    try {
      const storedAppointments = await AsyncStorage.getItem('appointments');
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      }
    } catch (error) {
      console.log('Error loading appointments:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAppointments();
    setRefreshing(false);
  };

  const cancelAppointment = async (appointmentId: string) => {
    Alert.alert(
      'Cancel Appointment',
      'Are you sure you want to cancel this appointment?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAppointments = appointments.map(appointment =>
                appointment.id === appointmentId
                  ? { ...appointment, status: 'cancelled' as const }
                  : appointment
              );
              setAppointments(updatedAppointments);
              await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
            } catch (error) {
              Alert.alert('Error', 'Failed to cancel appointment');
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2563eb';
      case 'completed':
        return '#059669';
      case 'cancelled':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'time-outline';
      case 'completed':
        return 'checkmark-circle-outline';
      case 'cancelled':
        return 'close-circle-outline';
      default:
        return 'help-circle-outline';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (appointments.length === 0) {
    return (
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.emptyContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Ionicons name="calendar-outline" size={80} color="#9ca3af" />
          <Text style={styles.emptyTitle}>No Appointments</Text>
          <Text style={styles.emptySubtitle}>
            You don't have any appointments yet.{'\n'}
            Book your first appointment with a doctor!
          </Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {appointments.map((appointment) => (
          <View key={appointment.id} style={styles.appointmentCard}>
            <View style={styles.cardHeader}>
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                <Text style={styles.specialty}>{appointment.specialty}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
                <Ionicons
                  name={getStatusIcon(appointment.status) as any}
                  size={16}
                  color={getStatusColor(appointment.status)}
                />
                <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.appointmentDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>{formatDate(appointment.date)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="time-outline" size={16} color="#6b7280" />
                <Text style={styles.detailText}>{appointment.time}</Text>
              </View>
              {appointment.reason && (
                <View style={styles.detailRow}>
                  <Ionicons name="document-text-outline" size={16} color="#6b7280" />
                  <Text style={styles.detailText}>{appointment.reason}</Text>
                </View>
              )}
            </View>

            {appointment.status === 'scheduled' && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => cancelAppointment(appointment.id)}
              >
                <Text style={styles.cancelButtonText}>Cancel Appointment</Text>
              </TouchableOpacity>
            )}
          </View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  appointmentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
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
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  appointmentDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#1f2937',
    marginLeft: 8,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
});