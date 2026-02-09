import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";
import { showAlert } from "../../utils/alert";

export default function Profile() {
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSave = async () => {
    if (!name.trim()) {
      showAlert("Error", "Name cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const collectionName = user?.type === "student" ? "students" : "teachers";
      await updateDoc(doc(db, collectionName, user!.id), {
        name: name.trim(),
        phone: phone.trim(),
      });

      await updateUser({ name: name.trim(), phone: phone.trim() });

      setEditing(false);
      showAlert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("Error", "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
    }
    setEditing(false);
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    setLogoutModalVisible(false);
    // Navigate first before logout to avoid component unmounting
    router.replace("/");
    // Small delay to ensure navigation starts before user state changes
    setTimeout(async () => {
      await logout();
    }, 100);
  };

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.value}>{user.name}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        {user.type === "student" && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Class</Text>
              <Text style={styles.value}>{user.class}</Text>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Roll Number</Text>
              <Text style={styles.value}>{user.rollNumber}</Text>
            </View>
          </>
        )}

        {user.type === "teacher" && (
          <View style={styles.field}>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{user.department}</Text>
          </View>
        )}

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="Phone"
              placeholderTextColor="#888"
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={styles.value}>{user.phone || "Not set"}</Text>
          )}
        </View>

        {editing ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={styles.developerButton}
        onPress={() => router.navigate("/about-developer")}
      >
        <Text style={styles.developerButtonText}>👨‍💻 About Developer</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={confirmLogout}
              >
                <Text style={styles.modalButtonConfirmText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 24,
    marginTop: 40,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#FFF",
  },
  input: {
    backgroundColor: "#222",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  cancelButton: {
    backgroundColor: "#333",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  developerButton: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  developerButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
  },
  logoutButton: {
    backgroundColor: "#ff4444",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
    width: "100%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: "#888",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#333",
  },
  modalButtonCancelText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalButtonConfirm: {
    backgroundColor: "#ff4444",
  },
  modalButtonConfirmText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
