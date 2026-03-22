import { useFavorites } from "@/contexts/FavoritesContext";
import { APOD } from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function FavoritesScreen() {
  const { favorites, isLoading, removeFavorite, refreshFavorites } =
    useFavorites();

  useFocusEffect(
    useCallback(() => {
      refreshFavorites();
    }, []),
  );

  const handleRemoveFavorite = (date: string, title: string) => {
    Alert.alert("Remove Favorite", `Remove "${title}" from favorites?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          try {
            await removeFavorite(date);
          } catch (error) {
            Alert.alert("Error", "Failed to remove favorite");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: APOD }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <Image
        source={{ uri: item.url }}
        style={styles.backgroundImage}
        contentFit="cover"
      />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.95)"]}
        style={styles.gradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>{item.date.toUpperCase()}</Text>
          </View>

          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>

          <Text style={styles.cardExplanation} numberOfLines={3}>
            {item.explanation}
          </Text>
        </View>
      </LinearGradient>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleRemoveFavorite(item.date, item.title)}
      >
        <Ionicons name="heart" size={24} color="#FC3D21" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <StatusBar barStyle="light-content" />
        <Ionicons
          name="heart-outline"
          size={80}
          color="rgba(255,255,255,0.3)"
        />
        <Text style={styles.emptyText}>No favorites yet</Text>
        <Text style={styles.emptySubtext}>
          Add your favorite astronomy pictures from the home screen
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favorites</Text>
        <Text style={styles.headerSubtitle}>
          {favorites.length} saved items
        </Text>
      </View>

      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.list}
        numColumns={2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
    fontWeight: "300",
  },
  emptyText: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
    fontWeight: "300",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginTop: 10,
    textAlign: "center",
  },
  list: {
    padding: 10,
  },
  card: {
    width: (width - 30) / 2,
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    margin: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  cardContent: {
    padding: 16,
  },
  dateContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 8,
  },
  dateText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "300",
    color: "#fff",
    marginBottom: 6,
    lineHeight: 18,
  },
  cardExplanation: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 15,
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
});
