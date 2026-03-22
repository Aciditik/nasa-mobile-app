import {
    JWSTImage,
    nasaApiService,
    NearEarthObject,
} from "@/services/api.service";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type TabType = "neo" | "jwst";

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("neo");
  const [neos, setNeos] = useState<NearEarthObject[]>([]);
  const [jwstImages, setJwstImages] = useState<JWSTImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === "neo") {
        const today = new Date();
        const endDate = today.toISOString().split("T")[0];
        const startDate = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0];
        const data = await nasaApiService.getNearEarthObjects(
          startDate,
          endDate,
        );
        setNeos(data.slice(0, 20));
      } else {
        const images = await nasaApiService.getJWSTImages(1);
        setJwstImages(images);
      }
    } catch (err) {
      setError("Failed to load data. Pull to retry.");
      console.error("Explore load error:", err);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const renderNeoItem = ({ item }: { item: NearEarthObject }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons
          name={item.is_potentially_hazardous_asteroid ? "warning" : "planet"}
          size={24}
          color={item.is_potentially_hazardous_asteroid ? "#FF4444" : "#4CAF50"}
        />
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Diameter</Text>
          <Text style={styles.statValue}>
            {item.estimated_diameter.kilometers.estimated_diameter_min.toFixed(
              2,
            )}{" "}
            -{" "}
            {item.estimated_diameter.kilometers.estimated_diameter_max.toFixed(
              2,
            )}{" "}
            km
          </Text>
        </View>
        {item.close_approach_data.length > 0 && (
          <>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Velocity</Text>
              <Text style={styles.statValue}>
                {parseFloat(
                  item.close_approach_data[0].relative_velocity
                    .kilometers_per_hour,
                ).toFixed(0)}{" "}
                km/h
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Miss Distance</Text>
              <Text style={styles.statValue}>
                {parseFloat(
                  item.close_approach_data[0].miss_distance.kilometers,
                ).toFixed(0)}{" "}
                km
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Approach Date</Text>
              <Text style={styles.statValue}>
                {item.close_approach_data[0].close_approach_date}
              </Text>
            </View>
          </>
        )}
        {item.is_potentially_hazardous_asteroid && (
          <View style={styles.hazardBadge}>
            <Ionicons name="warning" size={14} color="#FF4444" />
            <Text style={styles.hazardText}>Potentially Hazardous</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderJWSTItem = ({ item }: { item: JWSTImage }) => (
    <View style={styles.card}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.jwstImage} />
      ) : null}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.observation_id || "JWST Observation"}
        </Text>
        {item.details ? (
          <Text style={styles.detailsText} numberOfLines={3}>
            {item.details}
          </Text>
        ) : null}
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Program</Text>
          <Text style={styles.statValue}>{item.program}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔭 Explore</Text>
        <Text style={styles.headerSubtitle}>Discover NASA Data</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "neo" && styles.activeTab]}
          onPress={() => setActiveTab("neo")}
        >
          <Ionicons
            name="planet"
            size={18}
            color={activeTab === "neo" ? "#fff" : "#999"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "neo" && styles.activeTabText,
            ]}
          >
            Near Earth Objects
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "jwst" && styles.activeTab]}
          onPress={() => setActiveTab("jwst")}
        >
          <Ionicons
            name="telescope"
            size={18}
            color={activeTab === "jwst" ? "#fff" : "#999"}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "jwst" && styles.activeTabText,
            ]}
          >
            James Webb
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#0B3D91" />
          <Text style={styles.loadingText}>Loading NASA data...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Ionicons name="cloud-offline" size={48} color="#666" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : activeTab === "neo" ? (
        <FlatList
          data={neos}
          renderItem={renderNeoItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={jwstImages}
          renderItem={renderJWSTItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No data available</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 10,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    gap: 6,
  },
  activeTab: {
    backgroundColor: "#0B3D91",
  },
  tabText: {
    color: "#999",
    fontSize: 13,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    color: "#999",
    marginTop: 10,
    fontSize: 14,
  },
  errorText: {
    color: "#999",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
  },
  retryButton: {
    marginTop: 15,
    backgroundColor: "#0B3D91",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    flex: 1,
  },
  cardBody: {
    padding: 15,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  statLabel: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  statValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "right",
    flex: 1,
    marginLeft: 10,
  },
  hazardBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    backgroundColor: "rgba(255,68,68,0.15)",
    padding: 8,
    borderRadius: 8,
  },
  hazardText: {
    color: "#FF4444",
    fontSize: 12,
    fontWeight: "600",
  },
  jwstImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#111",
  },
  detailsText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
});
