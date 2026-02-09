import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { db } from "../../firebase/config";
import { showAlert } from "../../utils/alert";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<any>(null);

  const handleSearch = async () => {
    if (!email || !phone) {
      showAlert("Error", "Please enter both email and phone number");
      return;
    }

    setLoading(true);
    setFoundUser(null);

    try {
      const emailLower = email.toLowerCase().trim();
      const phoneTrimmed = phone.trim();
      
      // Search in students collection
      const studentQuery = query(
        collection(db, "students"),
        where("email", "==", emailLower)
      );
      const studentSnapshot = await getDocs(studentQuery);
      
      if (!studentSnapshot.empty) {
        const userData = studentSnapshot.docs[0].data();
        // Verify phone number matches
        if (userData.phone === phoneTrimmed) {
          setFoundUser({
            type: "Student",
            name: userData.name,
            email: userData.email,
            password: userData.password,
            rollNumber: userData.rollNumber,
            class: userData.class,
          });
          setLoading(false);
          return;
        } else {
          showAlert("Error", "Phone number does not match with this email");
          setLoading(false);
          return;
        }
      }

      // Search in teachers collection
      const teacherQuery = query(
        collection(db, "teachers"),
        where("email", "==", emailLower)
      );
      const teacherSnapshot = await getDocs(teacherQuery);
      
      if (!teacherSnapshot.empty) {
        const userData = teacherSnapshot.docs[0].data();
        // Verify phone number matches
        if (userData.phone === phoneTrimmed) {
          setFoundUser({
            type: "Teacher",
            name: userData.name,
            email: userData.email,
            password: userData.password,
            department: userData.department,
          });
          setLoading(false);
          return;
        } else {
          showAlert("Error", "Phone number does not match with this email");
          setLoading(false);
          return;
        }
      }

      // User not found
      showAlert("Error", "No account found with this email address");
      setLoading(false);
    } catch (error) {
      console.error("Error searching user:", error);
      showAlert("Error", "Failed to search. Please try again.");
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        {!foundUser ? (
          <>
            <Text style={styles.description}>
              Enter your email and phone number to recover your password
            </Text>

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
              placeholder="Phone Number"
              placeholderTextColor="#888"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Find Account"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.successTitle}>Account Found!</Text>
            
            <View style={styles.userInfo}>
              <Text style={styles.infoLabel}>Type:</Text>
              <Text style={styles.infoValue}>{foundUser.type}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{foundUser.name}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{foundUser.email}</Text>
            </View>

            {foundUser.rollNumber && (
              <View style={styles.userInfo}>
                <Text style={styles.infoLabel}>Roll Number:</Text>
                <Text style={styles.infoValue}>{foundUser.rollNumber}</Text>
              </View>
            )}

            {foundUser.class && (
              <View style={styles.userInfo}>
                <Text style={styles.infoLabel}>Class:</Text>
                <Text style={styles.infoValue}>{foundUser.class}</Text>
              </View>
            )}

            {foundUser.department && (
              <View style={styles.userInfo}>
                <Text style={styles.infoLabel}>Department:</Text>
                <Text style={styles.infoValue}>{foundUser.department}</Text>
              </View>
            )}

            <View style={styles.passwordContainer}>
              <Text style={styles.passwordLabel}>Your Password:</Text>
              <Text style={styles.passwordValue}>{foundUser.password}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.replace("/")}
            >
              <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.linkButton}
        >
          <Text style={styles.linkText}>Back to Welcome</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  description: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
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
  successTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#00ff00",
    marginBottom: 20,
    textAlign: "center",
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  infoLabel: {
    fontSize: 14,
    color: "#888",
  },
  infoValue: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "600",
  },
  passwordContainer: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  passwordLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  passwordValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFD700",
  },
});
