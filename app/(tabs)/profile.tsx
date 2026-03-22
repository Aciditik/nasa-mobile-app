import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/services/notification.service";
import { storageService } from "@/services/storage.service";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    const token = await notificationService.registerForPushNotifications();
    setPushToken(token);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/auth/login" as any);
        },
      },
    ]);
  };

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data",
      "This will remove all favorites and notes. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clearAll();
              Alert.alert("Success", "All data cleared");
            } catch (error) {
              Alert.alert("Error", "Failed to clear data");
            }
          },
        },
      ],
    );
  };

  const handleToggleNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);
    if (value) {
      try {
        await notificationService.scheduleDailyAPODNotification();
        Alert.alert(
          "Enabled",
          "You will receive daily notifications at 9:00 AM",
        );
      } catch (error) {
        Alert.alert("Error", "Failed to schedule notifications");
      }
    } else {
      await notificationService.cancelAllNotifications();
      Alert.alert("Disabled", "Daily notifications have been disabled");
    }
  };

  const handleTestNotification = async () => {
    try {
      await notificationService.sendImmediateNotification(
        "🌌 Test Notification",
        "This is a test notification from NASA Explorer!",
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send test notification");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Ionicons name="notifications-outline" size={24} color="#0B3D91" />
            <Text style={styles.settingText}>Daily APOD Notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleToggleNotifications}
            trackColor={{ false: "#ccc", true: "#0B3D91" }}
          />
        </View>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={handleTestNotification}
        >
          <Ionicons name="send-outline" size={24} color="#0B3D91" />
          <Text style={styles.menuText}>Send Test Notification</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Info</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Notifications:</Text>
          <Text style={styles.infoValue}>
            {pushToken ? "Enabled" : "Disabled"}
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Version:</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>

        <TouchableOpacity style={styles.dangerButton} onPress={handleClearData}>
          <Ionicons name="trash-outline" size={24} color="#FC3D21" />
          <Text style={styles.dangerButtonText}>Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>NASA Explorer v1.0.0</Text>
        <Text style={styles.footerText}>Powered by NASA API</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 30,
    paddingTop: 60,
    alignItems: "center",
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#E6F4FE",
  },
  section: {
    backgroundColor: "#1a1a1a",
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    marginHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    gap: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
  },
  infoBox: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FC3D21",
    gap: 10,
  },
  dangerButtonText: {
    fontSize: 16,
    color: "#FC3D21",
    fontWeight: "600",
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#FC3D21",
    margin: 20,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 5,
  },
});
