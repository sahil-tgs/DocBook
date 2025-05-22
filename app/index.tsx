import { useEffect } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function IndexScreen() {
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedData = JSON.parse(userData);
          if (parsedData?.isLoggedIn) {
            router.replace('/(tabs)');
            return;
          }
        }
        router.replace('/auth');
      } catch (error) {
        router.replace('/auth');
      }
    };
    
    checkAuth();
  }, []);

  return null;
}