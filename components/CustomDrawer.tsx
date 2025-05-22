import React from 'react';
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
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface DrawerProps {
  visible: boolean;
  onClose: () => void;
}

interface DrawerItem {
  id: string;
  title: string;
  icon: string;
  route?: string;
  action?: () => void;
  isPlaceholder?: boolean;
}

export default function CustomDrawer({ visible, onClose }: DrawerProps) {
  const insets = useSafeAreaInsets();
  const [userName, setUserName] = React.useState('User');
  const slideAnim = React.useRef(new Animated.Value(300)).current; // Start from right (positive value)

  React.useEffect(() => {
    loadUserName();
  }, [visible]);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0, // Slide to center
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300, // Slide back to right
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const loadUserName = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || 'User');
      }
    } catch (error) {
      console.log('Error loading user name:', error);
    }
  };

  const handleLogout = () => {
    onClose();
    router.push('/logout');
  };

  const drawerItems: DrawerItem[] = [
    {
      id: '1',
      title: 'Home',
      icon: 'home-outline',
      route: '/(tabs)',
    },
    {
      id: '2',
      title: 'My Appointments',
      icon: 'calendar-outline',
      route: '/(tabs)/appointments',
    },
    {
      id: '3',
      title: 'Profile',
      icon: 'person-outline',
      route: '/(tabs)/profile',
    },
    {
      id: '4',
      title: 'About Us',
      icon: 'information-circle-outline',
      route: '/about',
    },
    {
      id: '5',
      title: 'Contact Us',
      icon: 'mail-outline',
      route: '/contact',
    },
    {
      id: '6',
      title: 'Settings',
      icon: 'settings-outline',
      isPlaceholder: true,
    },
    {
      id: '7',
      title: 'Help & Support',
      icon: 'help-circle-outline',
      isPlaceholder: true,
    },
  ];

  const handleItemPress = (item: DrawerItem) => {
    if (item.isPlaceholder) {
      console.log(`${item.title} - Coming soon!`);
      return;
    }

    if (item.route) {
      onClose();
      router.push(item.route);
    } else if (item.action) {
      item.action();
    }
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
                <View style={styles.userAvatar}>
                  <Text style={styles.avatarText}>
                    {userName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{userName}</Text>
                  <Text style={styles.appName}>DocBook</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={onClose}
              >
                <Ionicons name="close" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>

            {/* Navigation Items */}
            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Navigation</Text>
                {drawerItems.slice(0, 3).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={22} 
                        color="#2563eb" 
                      />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                    <Ionicons 
                      name="chevron-forward" 
                      size={18} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Information</Text>
                {drawerItems.slice(3, 5).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.menuItem}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={22} 
                        color="#2563eb" 
                      />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                    <Ionicons 
                      name="chevron-forward" 
                      size={18} 
                      color="#9ca3af" 
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.menuSection}>
                <Text style={styles.sectionTitle}>Support</Text>
                {drawerItems.slice(5).map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.menuItem,
                      item.isPlaceholder && styles.placeholderItem
                    ]}
                    onPress={() => handleItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.menuIconContainer}>
                      <Ionicons 
                        name={item.icon as any} 
                        size={22} 
                        color={item.isPlaceholder ? "#9ca3af" : "#2563eb"} 
                      />
                    </View>
                    <Text style={[
                      styles.menuText,
                      item.isPlaceholder && styles.placeholderText
                    ]}>
                      {item.title}
                    </Text>
                    {item.isPlaceholder && (
                      <Text style={styles.comingSoonText}>Soon</Text>
                    )}
                    {!item.isPlaceholder && (
                      <Ionicons 
                        name="chevron-forward" 
                        size={18} 
                        color="#9ca3af" 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.drawerFooter}>
              <TouchableOpacity 
                style={styles.logoutButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={22} color="#dc2626" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
              
              <View style={styles.appInfo}>
                <Text style={styles.appVersion}>DocBook v1.0.0</Text>
                <Text style={styles.appTagline}>Your Health, Our Priority</Text>
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
    width: 280,
    backgroundColor: '#ffffff',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 }, // Shadow to the left
    shadowOpacity: 0.25,
    shadowRadius: 10,
    position: 'absolute',
    right: 0, // Position on the right side
    top: 0,
    bottom: 0,
  },
  drawerContent: {
    flex: 1,
  },
  drawerHeader: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  appName: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 10,
  },
  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
    marginBottom: 10,
    marginLeft: 5,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderRadius: 8,
    marginBottom: 2,
  },
  placeholderItem: {
    opacity: 0.6,
  },
  menuIconContainer: {
    width: 30,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  placeholderText: {
    color: '#9ca3af',
  },
  comingSoonText: {
    fontSize: 12,
    color: '#9ca3af',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 10,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc2626',
    marginLeft: 15,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
  },
  appVersion: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  appTagline: {
    fontSize: 11,
    color: '#d1d5db',
  },
});