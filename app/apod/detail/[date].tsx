import { useFavorites } from '@/contexts/FavoritesContext';
import { APOD, nasaApiService } from '@/services/api.service';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function APODDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [apod, setApod] = useState<APOD | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    loadAPOD();
  }, [date]);

  const loadAPOD = async () => {
    try {
      setIsLoading(true);
      const data = await nasaApiService.getAPOD(date);
      setApod(data);
    } catch (error) {
      console.error('Error loading APOD:', error);
      Alert.alert('Error', 'Failed to load APOD');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!apod) return;

    try {
      if (isFavorite(apod.date)) {
        await removeFavorite(apod.date);
        Alert.alert('Removed', 'Removed from favorites');
      } else {
        await addFavorite(apod);
        Alert.alert('Added', 'Added to favorites');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update favorites');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!apod) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {apod.media_type === 'image' && (
        <Image source={{ uri: apod.url }} style={styles.backgroundImage} contentFit="cover" />
      )}

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#000']}
        locations={[0, 0.3, 0.6, 0.85]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconButton}>
              <Ionicons
                name={isFavorite(apod.date) ? 'heart' : 'heart-outline'}
                size={24}
                color={isFavorite(apod.date) ? '#FC3D21' : '#fff'}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.spacer} />
          
          <View style={styles.detailsCard}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{apod.date.toUpperCase()}</Text>
            </View>

            <Text style={styles.title}>{apod.title}</Text>

            {apod.copyright && (
              <Text style={styles.copyright}>© {apod.copyright}</Text>
            )}

            <Text style={styles.explanation}>{apod.explanation}</Text>

            <TouchableOpacity style={styles.readMoreButton}>
              <Text style={styles.readMoreText}>VIEW FULL RESOLUTION</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
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
  errorText: {
    fontSize: 18,
    color: '#fff',
  },
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
  },
  gradient: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
  spacer: {
    flex: 1,
    minHeight: height * 0.35,
  },
  detailsCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  dateContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 38,
    letterSpacing: 0.5,
  },
  copyright: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  explanation: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 24,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    gap: 8,
    marginTop: 8,
  },
  readMoreText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
