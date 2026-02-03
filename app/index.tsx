import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../context/auth";

export default function Welcome() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz App</Text>
      <Text style={styles.subtitle}>Welcome to the Quiz Platform</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/student-login")}
        >
          <Text style={styles.buttonText}>Student Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonOutline]}
          onPress={() => router.push("/(auth)/teacher-login")}
        >
          <Text style={[styles.buttonText, styles.buttonOutlineText]}>
            Teacher Login
          </Text>
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
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 60,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFF",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonOutline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  buttonOutlineText: {
    color: "#FFD700",
  },
});
