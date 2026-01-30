import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";

export default function Profile() {
  const { user, userType, logout, updateUser, loading } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // 🔥 sync local state when user loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  /* ================= SAVE PROFILE ================= */
  const saveProfile = async () => {
    try {
      const collectionName = userType === "student" ? "students" : "teachers";

      const updatedUser = {
        ...user,
        name,
        phone,
      };

      await updateDoc(doc(db, collectionName, user.id), {
        name,
        phone,
      });

      // 🔑 update context (single source of truth)
      await updateUser(updatedUser);

      // 🔥 HARD EXIT EDIT MODE
      setEditing(false);

      Alert.alert("Success", "Profile updated successfully");
    } catch (err) {
      Alert.alert("Error", "Profile update failed");
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout(); // 🔥 root handles navigation
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Name</Text>
        {editing ? (
          <TextInput style={styles.input} value={name} onChangeText={setName} />
        ) : (
          <Text style={styles.value}>{user.name}</Text>
        )}

        <Text style={styles.label}>Phone</Text>
        {editing ? (
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        ) : (
          <Text style={styles.value}>{user.phone}</Text>
        )}

        {userType === "student" && (
          <>
            <Text style={styles.label}>Roll Number</Text>
            <Text style={styles.value}>{user.rollNumber}</Text>
          </>
        )}

        {userType === "teacher" && (
          <>
            <Text style={styles.label}>Department</Text>
            <Text style={styles.value}>{user.department}</Text>
          </>
        )}
      </View>

      {/* EDIT / SAVE BUTTON */}
      <TouchableOpacity
        style={styles.button}
        onPress={editing ? saveProfile : () => setEditing(true)}
      >
        <Text style={styles.btnText}>
          {editing ? "Save Profile" : "Edit Profile"}
        </Text>
      </TouchableOpacity>

      {/* LOGOUT */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#111",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    color: "#777",
    marginTop: 10,
  },
  value: {
    color: "#fff",
    fontSize: 16,
  },
  input: {
    backgroundColor: "#000",
    color: "#fff",
    borderBottomWidth: 1,
    borderColor: "#FFD700",
    paddingVertical: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  btnText: {
    color: "#FFD700",
    textAlign: "center",
    fontSize: 16,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "red",
    padding: 15,
    borderRadius: 10,
  },
  logoutText: {
    color: "red",
    textAlign: "center",
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
