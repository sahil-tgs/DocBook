import React, { useState } from 'react';
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
import FilterDrawer, { FilterOptions } from '../../components/FilterDrawer';

// Enhanced mock doctor data with more details for filtering
const allDoctors = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    rating: 4.8,
    experience: '12 years',
    experienceYears: 12,
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    location: 'Apollo Hospitals',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatologist',
    rating: 4.9,
    experience: '8 years',
    experienceYears: 8,
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
    location: 'Fortis Healthcare',
  },
  {
    id: '3',
    name: 'Dr. Anitha Menon',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: '15 years',
    experienceYears: 15,
    availability: 'Busy',
    photo: 'https://images.unsplash.com/photo-1594824388853-2c5bb9c71e06?w=150&h=150&fit=crop&crop=face',
    location: 'Max Healthcare',
  },
  {
    id: '4',
    name: 'Dr. Vikash Singh',
    specialty: 'Orthopedic',
    rating: 4.6,
    experience: '10 years',
    experienceYears: 10,
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    location: 'AIIMS Delhi',
  },
  {
    id: '5',
    name: 'Dr. Sunita Reddy',
    specialty: 'Neurologist',
    rating: 4.9,
    experience: '18 years',
    experienceYears: 18,
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=150&h=150&fit=crop&crop=face',
    location: 'Manipal Hospitals',
  },
  {
    id: '6',
    name: 'Dr. Arjun Patel',
    specialty: 'General Medicine',
    rating: 4.5,
    experience: '6 years',
    experienceYears: 6,
    availability: 'Available',
    photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
    location: 'City Care Clinic',
  },
];

export default function HomeScreen() {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    specialty: [],
    availability: [],
    rating: null,
    experience: null,
    location: [],
  });
  const [filteredDoctors, setFilteredDoctors] = useState(allDoctors);

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

  const getExperienceRange = (years: number) => {
    if (years <= 5) return '0-5 years';
    if (years <= 10) return '5-10 years';
    if (years <= 15) return '10-15 years';
    return '15+ years';
  };

  const applyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    
    let filtered = allDoctors;

    // Filter by specialty
    if (newFilters.specialty.length > 0) {
      filtered = filtered.filter(doctor => 
        newFilters.specialty.includes(doctor.specialty)
      );
    }

    // Filter by availability
    if (newFilters.availability.length > 0) {
      filtered = filtered.filter(doctor => 
        newFilters.availability.includes(doctor.availability)
      );
    }

    // Filter by rating
    if (newFilters.rating !== null) {
      filtered = filtered.filter(doctor => 
        doctor.rating >= newFilters.rating!
      );
    }

    // Filter by experience
    if (newFilters.experience !== null) {
      filtered = filtered.filter(doctor => 
        getExperienceRange(doctor.experienceYears) === newFilters.experience
      );
    }

    // Filter by location
    if (newFilters.location.length > 0) {
      filtered = filtered.filter(doctor => 
        newFilters.location.includes(doctor.location)
      );
    }

    setFilteredDoctors(filtered);
  };

  const clearFilters = () => {
    const defaultFilters: FilterOptions = {
      specialty: [],
      availability: [],
      rating: null,
      experience: null,
      location: [],
    };
    setFilters(defaultFilters);
    setFilteredDoctors(allDoctors);
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

  const handleDoctorPress = (doctorId: string) => {
    router.push(`/booking/${doctorId}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Section with Filter Icon */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.headerText}>
            <Text style={styles.subtitle}>Book an appointment with</Text>
            <Text style={styles.title}>Top Rated Doctors</Text>
          </View>
          
          {/* Filter Icon - aligned with subtitle/title */}
          <TouchableOpacity
            onPress={() => setFilterDrawerVisible(true)}
            style={styles.filterButton}
          >
            <Ionicons name="options-outline" size={22} color="#ffffff" />
            {getActiveFiltersCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getActiveFiltersCount()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        {/* Active Filters Display */}
        {getActiveFiltersCount() > 0 && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              {getActiveFiltersCount()} filter{getActiveFiltersCount() > 1 ? 's' : ''} active
            </Text>
            <TouchableOpacity onPress={clearFilters} style={styles.clearFiltersButton}>
              <Text style={styles.clearFiltersText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      {/* Doctor List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filteredDoctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#9ca3af" />
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your filters to see more results
            </Text>
            <TouchableOpacity onPress={clearFilters} style={styles.resetButton}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredDoctors.map((doctor) => (
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
                    defaultSource={require('../../assets/images/icon.png')}
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
                  <Text style={styles.location}>{doctor.location}</Text>
                </View>

                {/* Arrow Icon */}
                <View style={styles.arrowContainer}>
                  <Ionicons name="chevron-forward" size={24} color="#6b7280" />
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Filter Drawer */}
      <FilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApplyFilters={applyFilters}
        currentFilters={filters}
      />
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
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
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
  filterButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  filterBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeFiltersText: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  clearFiltersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  clearFiltersText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  resultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resultsText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
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
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  resetButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#2563eb',
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
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
    marginBottom: 2,
  },
  location: {
    fontSize: 12,
    color: '#6b7280',
  },
  arrowContainer: {
    marginLeft: 10,
  },
}); 