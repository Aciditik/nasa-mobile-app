import { ArticleCard } from '@/components/ArticleCard';
import { NewsCard } from '@/components/NewsCard';
import { StatCard } from '@/components/StatCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { APOD, nasaApiService } from '@/services/api.service';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function HomeScreen() {
  const [apods, setApods] = useState<APOD[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    loadAPODs();
  }, []);

  const loadAPODs = async () => {
    try {
      setIsLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 5);

      const data = await nasaApiService.getAPODRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      setApods(data.reverse());
    } catch (error) {
      console.error('Error loading APODs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAPODs();
    setRefreshing(false);
  };

  const handleCardPress = (apod: APOD) => {
    router.push(`/apod/detail/${apod.date}` as any);
  };

  const renderItem = ({ item, index }: { item: APOD; index: number }) => {
    const cardType = index % 3;

    if (cardType === 0) {
      return (
        <NewsCard
          title={item.title}
          date={item.date.toUpperCase()}
          description={item.explanation}
          imageUrl={item.url}
          onPress={() => handleCardPress(item)}
          variant="large"
        />
      );
    } else if (cardType === 1) {
      return (
        <ArticleCard
          title={item.title}
          category="MORE ABOUT INGENUITY"
          content={item.explanation}
          imageUrl={item.url}
          onPress={() => handleCardPress(item)}
        />
      );
    } else {
      return (
        <StatCard
          title={item.title}
          description={item.explanation}
          imageUrl={item.url}
          onPress={() => handleCardPress(item)}
        />
      );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading NASA Stories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>NASA</Text>
        <Text style={styles.headerSubtitle}>Explore the Universe</Text>
      </View>

      <FlatList
        data={apods}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={350}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      />

      <View style={styles.footer}>
        <View style={styles.indicator} />
        <View style={[styles.indicator, styles.indicatorInactive]} />
        <View style={[styles.indicator, styles.indicatorInactive]} />
      </View>
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
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
    fontWeight: '300',
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 30,
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  indicatorInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});
