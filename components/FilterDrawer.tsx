import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FilterDrawerProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  specialty: string[];
  availability: string[];
  rating: number | null;
  experience: string | null;
  location: string[];
}

const specialties = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist', 
  'Pediatrician',
  'Orthopedic',
  'Neurologist',
  'General Medicine',
  'Gynaecology',
  'ENT',
  'Ophthalmology',
];

const availabilityOptions = [
  'All',
  'Available',
  'Busy',
];

const experienceOptions = [
  'All Experience',
  '0-5 years',
  '5-10 years',
  '10-15 years',
  '15+ years',
];

const locations = [
  'All Locations',
  'Apollo Hospitals',
  'Fortis Healthcare',
  'Max Healthcare',
  'AIIMS Delhi',
  'Manipal Hospitals',
  'City Care Clinic',
];

const ratingOptions = [
  { label: 'All Ratings', value: null },
  { label: '4.5+ Stars', value: 4.5 },
  { label: '4.0+ Stars', value: 4.0 },
  { label: '3.5+ Stars', value: 3.5 },
];

export default function FilterDrawer({ visible, onClose, onApplyFilters, currentFilters }: FilterDrawerProps) {
  const insets = useSafeAreaInsets();
  const slideAnim = React.useRef(new Animated.Value(300)).current;
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleSpecialtyToggle = (specialty: string) => {
    if (specialty === 'All Specialties') {
      setFilters(prev => ({ ...prev, specialty: [] }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      specialty: prev.specialty.includes(specialty)
        ? prev.specialty.filter(s => s !== specialty)
        : [...prev.specialty, specialty]
    }));
  };

  const handleAvailabilityToggle = (availability: string) => {
    if (availability === 'All') {
      setFilters(prev => ({ ...prev, availability: [] }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }));
  };

  const handleLocationToggle = (location: string) => {
    if (location === 'All Locations') {
      setFilters(prev => ({ ...prev, location: [] }));
      return;
    }

    setFilters(prev => ({
      ...prev,
      location: prev.location.includes(location)
        ? prev.location.filter(l => l !== location)
        : [...prev.location, location]
    }));
  };

  const handleRatingSelect = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };

  const handleExperienceSelect = (experience: string) => {
    setFilters(prev => ({ 
      ...prev, 
      experience: experience === 'All Experience' ? null : experience 
    }));
  };

  const handleClearAll = () => {
    setFilters({
      specialty: [],
      availability: [],
      rating: null,
      experience: null,
      location: [],
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.specialty.length > 0) count++;
    if (filters.availability.length > 0) count++;
    if (filters.rating !== null) count++;
    if (filters.experience !== null) count++;
    if (filters.location.length > 0) count++;
    return count;
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="none"
      presentationStyle="overFullScreen"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.drawerContainer, 
            { 
              paddingTop: insets.top,
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          <SafeAreaView style={styles.drawerContent}>
            {/* Header */}
            <View style={styles.drawerHeader}>
              <View style={styles.headerContent}>
                <Ionicons name="options-outline" size={24} color="#ffffff" />
                <Text style={styles.headerTitle}>Filter Doctors</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Filter Content */}
            <ScrollView style={styles.filterContainer} showsVerticalScrollIndicator={false}>
              
              {/* Specialty Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Specialty</Text>
                <View style={styles.filterOptions}>
                  {specialties.map((specialty) => (
                    <TouchableOpacity
                      key={specialty}
                      style={[
                        styles.filterOption,
                        (specialty === 'All Specialties' && filters.specialty.length === 0) ||
                        filters.specialty.includes(specialty) ? styles.selectedOption : null
                      ]}
                      onPress={() => handleSpecialtyToggle(specialty)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        (specialty === 'All Specialties' && filters.specialty.length === 0) ||
                        filters.specialty.includes(specialty) ? styles.selectedOptionText : null
                      ]}>
                        {specialty}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Availability Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Availability</Text>
                <View style={styles.filterOptions}>
                  {availabilityOptions.map((availability) => (
                    <TouchableOpacity
                      key={availability}
                      style={[
                        styles.filterOption,
                        (availability === 'All' && filters.availability.length === 0) ||
                        filters.availability.includes(availability) ? styles.selectedOption : null
                      ]}
                      onPress={() => handleAvailabilityToggle(availability)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        (availability === 'All' && filters.availability.length === 0) ||
                        filters.availability.includes(availability) ? styles.selectedOptionText : null
                      ]}>
                        {availability}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Rating Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Rating</Text>
                <View style={styles.filterOptions}>
                  {ratingOptions.map((option) => (
                    <TouchableOpacity
                      key={option.label}
                      style={[
                        styles.filterOption,
                        filters.rating === option.value ? styles.selectedOption : null
                      ]}
                      onPress={() => handleRatingSelect(option.value)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters.rating === option.value ? styles.selectedOptionText : null
                      ]}>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Experience Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Experience</Text>
                <View style={styles.filterOptions}>
                  {experienceOptions.map((experience) => (
                    <TouchableOpacity
                      key={experience}
                      style={[
                        styles.filterOption,
                        (experience === 'All Experience' && filters.experience === null) ||
                        filters.experience === experience ? styles.selectedOption : null
                      ]}
                      onPress={() => handleExperienceSelect(experience)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        (experience === 'All Experience' && filters.experience === null) ||
                        filters.experience === experience ? styles.selectedOptionText : null
                      ]}>
                        {experience}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Location Filter */}
              <View style={styles.filterSection}>
                <Text style={styles.filterTitle}>Location</Text>
                <View style={styles.filterOptions}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.filterOption,
                        (location === 'All Locations' && filters.location.length === 0) ||
                        filters.location.includes(location) ? styles.selectedOption : null
                      ]}
                      onPress={() => handleLocationToggle(location)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        (location === 'All Locations' && filters.location.length === 0) ||
                        filters.location.includes(location) ? styles.selectedOptionText : null
                      ]}>
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

            </ScrollView>

            {/* Footer */}
            <View style={styles.drawerFooter}>
              <View style={styles.footerButtons}>
                <TouchableOpacity 
                  style={styles.clearButton}
                  onPress={handleClearAll}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={handleApply}
                >
                  <Text style={styles.applyButtonText}>
                    Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
  },
  overlayTouchable: {
    flex: 1,
  },
  drawerContainer: {
    width: 320,
    backgroundColor: '#ffffff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
  },
  filterContainer: {
    flex: 1,
    paddingTop: 10,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  filterOptions: {
    gap: 8,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  selectedOption: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#2563eb',
    fontWeight: '600',
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#2563eb',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
});