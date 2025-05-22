import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function MoreScreen() {
  const quickActions = [
    {
      id: '1',
      title: 'Book Appointment',
      subtitle: 'Find and book with doctors',
      icon: 'calendar-outline',
      color: '#059669',
      action: () => router.push('/(tabs)'),
    },
    {
      id: '2',
      title: 'Emergency Contact',
      subtitle: 'Call emergency services',
      icon: 'call-outline',
      color: '#dc2626',
      action: () => {
        console.log('Emergency contact');
      },
    },
    {
      id: '3',
      title: 'Settings',
      subtitle: 'App preferences',
      icon: 'settings-outline',
      color: '#6b7280',
      action: () => {
        console.log('Settings - Coming soon');
      },
    },
  ];

  const recentActions = [
    {
      id: '1',
      title: 'View Appointments',
      subtitle: 'Check your upcoming visits',
      icon: 'time-outline',
      route: '/(tabs)/appointments',
    },
    {
      id: '2',
      title: 'Update Profile',
      subtitle: 'Manage your information',
      icon: 'person-outline',
      route: '/(tabs)/profile',
    },
    {
      id: '3',
      title: 'About DocBook',
      subtitle: 'Learn more about us',
      icon: 'information-circle-outline',
      route: '/about',
    },
    {
      id: '4',
      title: 'Contact Support',
      subtitle: 'Get help and support',
      icon: 'help-circle-outline',
      route: '/contact',
    },
  ];

  const handleQuickAction = (action: any) => {
    if (action.action) {
      action.action();
    } else if (action.route) {
      router.push(action.route);
    }
  };

  const handleRecentAction = (item: any) => {
    if (item.route) {
      router.push(item.route);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>More Options</Text>
          <Text style={styles.headerSubtitle}>
            Quick access to all features
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => handleQuickAction(action)}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                  <Ionicons
                    name={action.icon as any}
                    size={28}
                    color={action.color}
                  />
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Used</Text>
          <View style={styles.recentActionsContainer}>
            {recentActions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.recentActionItem}
                onPress={() => handleRecentAction(item)}
                activeOpacity={0.7}
              >
                <View style={styles.recentActionIconContainer}>
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color="#2563eb"
                  />
                </View>
                <View style={styles.recentActionContent}>
                  <Text style={styles.recentActionTitle}>{item.title}</Text>
                  <Text style={styles.recentActionSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.recentActionArrow}>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color="#9ca3af"
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View style={styles.appInfoContainer}>
            <View style={styles.appLogoContainer}>
              <View style={styles.appLogo}>
                <Ionicons name="medical" size={30} color="#2563eb" />
              </View>
            </View>
            <Text style={styles.appInfoName}>DocBook</Text>
            <Text style={styles.appInfoTagline}>Your Health, Our Priority</Text>
            <Text style={styles.appInfoVersion}>Version 1.0.0</Text>
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
    paddingBottom: 25,
    paddingTop: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
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
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  recentActionsContainer: {
    gap: 12,
  },
  recentActionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  recentActionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recentActionContent: {
    flex: 1,
  },
  recentActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  recentActionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  recentActionArrow: {
    marginLeft: 10,
  },
  appInfoContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  appLogoContainer: {
    marginBottom: 15,
  },
  appLogo: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appInfoName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  appInfoTagline: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 5,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 20,
  },
});