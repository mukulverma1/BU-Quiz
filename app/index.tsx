import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#000",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          color: "#FFD700",
          fontSize: 24,
          textAlign: "center",
          marginBottom: 30,
        }}
      >
        Welcome
      </Text>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "#FFD700",
          padding: 15,
          borderRadius: 10,
          marginBottom: 15,
        }}
        onPress={() => router.push("/student-login")}
      >
        <Text style={{ color: "#FFD700", textAlign: "center" }}>
          Student Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "#FFD700",
          padding: 15,
          borderRadius: 10,
        }}
        onPress={() => router.push("/teacher-login")}
      >
        <Text style={{ color: "#FFD700", textAlign: "center" }}>
          Teacher Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
