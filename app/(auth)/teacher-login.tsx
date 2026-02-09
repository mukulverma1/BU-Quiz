import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";
import { showAlert } from "../../utils/alert";

export default function TeacherLogin() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "teachers"),
        where("email", "==", email.toLowerCase().trim()),
        where("password", "==", password),
      );

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showAlert("Error", "Invalid email or password");
        setLoading(false);
        return;
      }

      const doc = querySnapshot.docs[0];
      const userData = doc.data();

      await login({
        id: doc.id,
        email: userData.email,
        name: userData.name,
        type: "teacher",
        department: userData.department,
        phone: userData.phone,
      });
    } catch (error) {
      console.error("Login error:", error);
      showAlert("Error", "Failed to login. Please try again.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Teacher Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Logging in..." : "Login"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/forgot-password")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/teacher-signup")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#222",
    color: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  linkButton: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#FFD700",
    fontSize: 14,
  },
});
