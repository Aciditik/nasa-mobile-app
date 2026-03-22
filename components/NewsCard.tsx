import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface NewsCardProps {
  title: string;
  date?: string;
  description?: string;
  imageUrl: string;
  onPress?: () => void;
  variant?: 'large' | 'medium' | 'small';
}

export const NewsCard: React.FC<NewsCardProps> = ({
  title,
  date,
  description,
  imageUrl,
  onPress,
  variant = 'large',
}) => {
  const cardHeight = variant === 'large' ? 500 : variant === 'medium' ? 450 : 400;

  return (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH, height: cardHeight }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: imageUrl }} style={styles.backgroundImage} contentFit="cover" />
      
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {date && (
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{date}</Text>
            </View>
          )}
          
          <Text style={styles.title}>{title}</Text>
          
          {description && (
            <Text style={styles.description} numberOfLines={3}>
              {description}
            </Text>
          )}
          
          <TouchableOpacity style={styles.readMoreButton}>
            <Text style={styles.readMoreText}>READ MORE</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <TouchableOpacity style={styles.menuButton}>
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    padding: 24,
    paddingBottom: 30,
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
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 34,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 20,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  readMoreText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
  menuDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
});
