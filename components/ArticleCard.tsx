import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface ArticleCardProps {
  title: string;
  category?: string;
  content: string;
  imageUrl?: string;
  onPress?: () => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  title,
  category,
  content,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <TouchableOpacity style={styles.menuButton}>
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
        <View style={styles.menuDot} />
      </TouchableOpacity>

      {category && (
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      )}

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.content} numberOfLines={6}>
        {content}
      </Text>

      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  menuButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    zIndex: 10,
  },
  menuDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
    marginTop: 30,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 26,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 16,
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  content: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },
});
