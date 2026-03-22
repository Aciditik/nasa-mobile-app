import { backendService, Note } from "@/services/backend.service";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NotesScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const allNotes = await backendService.notes.getAll(date);
      setNotes(allNotes);
    } catch (error) {
      console.error("Error loading notes:", error);
      setNotes([]);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      Alert.alert("Error", "Please enter a note");
      return;
    }

    try {
      await backendService.notes.add(date || "", newNote.trim());
      setNewNote("");
      await loadNotes();
      Alert.alert("Success", "Note added");
    } catch (error) {
      Alert.alert("Error", "Failed to add note");
    }
  };

  const handleUpdateNote = async (id: string) => {
    if (!editText.trim()) {
      Alert.alert("Error", "Note cannot be empty");
      return;
    }

    try {
      await backendService.notes.update(id, editText.trim());
      setEditingId(null);
      setEditText("");
      await loadNotes();
      Alert.alert("Success", "Note updated");
    } catch (error) {
      Alert.alert("Error", "Failed to update note");
    }
  };

  const handleDeleteNote = (id: string) => {
    Alert.alert("Delete Note", "Are you sure you want to delete this note?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await backendService.notes.delete(id);
            await loadNotes();
            Alert.alert("Success", "Note deleted");
          } catch (error) {
            Alert.alert("Error", "Failed to delete note");
          }
        },
      },
    ]);
  };

  const startEditing = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const renderNote = ({ item }: { item: Note }) => {
    const isEditing = editingId === item.id;

    return (
      <View style={styles.noteCard}>
        {isEditing ? (
          <View>
            <TextInput
              style={styles.editInput}
              value={editText}
              onChangeText={setEditText}
              multiline
              autoFocus
            />
            <View style={styles.editActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => handleUpdateNote(item.id)}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelEditing}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.noteContent}>{item.content}</Text>
            <Text style={styles.noteDate}>
              {new Date(item.createdAt).toLocaleDateString()} at{" "}
              {new Date(item.createdAt).toLocaleTimeString()}
            </Text>
            <View style={styles.noteActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => startEditing(item)}
              >
                <Ionicons name="create-outline" size={20} color="#0B3D91" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteNote(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FC3D21" />
                <Text style={[styles.actionText, { color: "#FC3D21" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>📝 Notes</Text>
          <Text style={styles.headerSubtitle}>APOD: {date}</Text>
        </View>
      </View>

      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="document-text-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No notes yet</Text>
            <Text style={styles.emptySubtext}>Add your first note below</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a note..."
          value={newNote}
          onChangeText={setNewNote}
          multiline
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddNote}>
          <Ionicons name="add-circle" size={40} color="#0B3D91" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    paddingTop: 60,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 15,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 5,
    fontWeight: "300",
  },
  list: {
    padding: 15,
    flexGrow: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: "#fff",
    marginTop: 15,
    fontWeight: "300",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
    marginTop: 5,
  },
  noteCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  noteContent: {
    fontSize: 16,
    color: "#fff",
    lineHeight: 24,
    marginBottom: 10,
  },
  noteDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 10,
  },
  noteActions: {
    flexDirection: "row",
    gap: 15,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionText: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
  },
  editInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  editActions: {
    flexDirection: "row",
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#000",
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    alignItems: "flex-end",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.05)",
    color: "#fff",
  },
  addButton: {
    justifyContent: "center",
    alignItems: "center",
  },
});
