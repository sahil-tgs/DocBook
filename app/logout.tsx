import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LogoutScreen() {
  useEffect(() => {
    const performLogout = async () => {
      try {
        console.log('Performing logout...');
        await AsyncStorage.clear();
        console.log('Storage cleared, navigating to auth...');
        
        // Small delay then navigate
        setTimeout(() => {
          router.replace('/auth');
        }, 100);
      } catch (error) {
        console.log('Logout error:', error);
        router.replace('/auth');
      }
    };
    
    performLogout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Logging out...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 16,
    color: '#6b7280',
  },
});