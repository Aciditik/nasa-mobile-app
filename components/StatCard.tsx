import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;

interface StatCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onPress?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  description,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" />
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.menuButton}>
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
          <View style={styles.menuDot} />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageContainer: {
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 24,
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
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: '#fff',
    marginBottom: 12,
    lineHeight: 30,
    letterSpacing: 0.5,
    marginTop: 30,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
});
