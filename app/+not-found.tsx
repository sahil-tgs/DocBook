import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <Ionicons name="warning-outline" size={80} color="#dc2626" />
        <Text style={styles.title}>This screen doesn't exist.</Text>
        <Text style={styles.subtitle}>
          The page you're looking for could not be found.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#2563eb',
    borderRadius: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
});