import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/auth";
import { db } from "../firebase/config";

export default function StudentSignup() {
  const router = useRouter();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [className, setClassName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !rollNumber) {
      Alert.alert("Error", "Fill all required fields");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "students"), {
        name,
        email: email.toLowerCase(),
        password,
        rollNumber,
        class: className,
        phone,
        createdAt: Timestamp.now(),
      });

      await login(
        {
          id: docRef.id,
          name,
          email,
          rollNumber,
          class: className,
          phone,
        },
        "student",
      );

      router.replace("/(tabs)");
    } catch {
      Alert.alert("Error", "Signup failed");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Signup</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#777"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#777"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#777"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Roll Number"
        placeholderTextColor="#777"
        value={rollNumber}
        onChangeText={setRollNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Class"
        placeholderTextColor="#777"
        value={className}
        onChangeText={setClassName}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#777"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.btnText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    color: "#FFD700",
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
  },
  btnText: { color: "#FFD700", textAlign: "center", fontSize: 16 },
});
