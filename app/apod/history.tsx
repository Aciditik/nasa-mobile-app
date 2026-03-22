import { APOD, nasaApiService } from '@/services/api.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function APODHistoryScreen() {
  const [apods, setApods] = useState<APOD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadAPODHistory();
  }, []);

  const loadAPODHistory = async () => {
    try {
      setIsLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30);

      const data = await nasaApiService.getAPODRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setApods(data.reverse());
    } catch (error) {
      console.error('Error loading APOD history:', error);
      Alert.alert('Error', 'Failed to load APOD history');
    } finally {
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }: { item: APOD }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/apod/detail/${item.date}` as any)}
    >
      {item.media_type === 'image' && (
        <Image source={{ uri: item.url }} style={styles.thumbnail} contentFit="cover" />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardDate}>{item.date}</Text>
        <Text style={styles.cardExplanation} numberOfLines={3}>
          {item.explanation}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#ccc" style={styles.chevron} />
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0B3D91" />
        <Text style={styles.loadingText}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📅 APOD History</Text>
          <Text style={styles.headerSubtitle}>Last 30 days</Text>
        </View>
      </View>

      <FlatList
        data={apods}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 5,
    fontWeight: '300',
  },
  list: {
    padding: 15,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    flexDirection: 'row',
  },
  thumbnail: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
  },
  cardContent: {
    flex: 1,
    padding: 15,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  cardExplanation: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 18,
  },
  chevron: {
    alignSelf: 'center',
    marginRight: 10,
    opacity: 0.5,
  },
});
