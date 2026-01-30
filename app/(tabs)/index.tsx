import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";

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
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    color: "#ccc",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "#FFD700",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  quizTitle: {
    color: "#fff",
    fontSize: 16,
  },
  code: {
    color: "#FFD700",
  },
  createBtn: {
    borderWidth: 1,
    borderColor: "#00FF88",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  createText: {
    color: "#00FF88",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default function HomeOrDashboard() {
  const { userType, user } = useAuth();
  const router = useRouter();

  /* ================= STUDENT STATE ================= */
  const [code, setCode] = useState("");

  /* ================= TEACHER STATE ================= */
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* ================= TEACHER FETCH ================= */
  useEffect(() => {
    if (userType !== "teacher") {
      setLoading(false);
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("teacherEmail", "==", user.email),
        );

        const snap = await getDocs(q);
        setQuizzes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        Alert.alert("Error", "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [userType, user?.email]);

  /* ================= STUDENT JOIN QUIZ ================= */
  const joinQuiz = async () => {
    if (!code) {
      Alert.alert("Error", "Enter quiz code");
      return;
    }

    const q = query(
      collection(db, "quizzes"),
      where("quizCode", "==", code.toUpperCase()),
    );

    const snap = await getDocs(q);

    if (snap.empty) {
      Alert.alert("Invalid Code", "Quiz not found");
      return;
    }

    router.replace(`/quiz-instructions?quizCode=${code.toUpperCase()}`);
  };

  /* ================= STUDENT UI ================= */
  if (userType === "student") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Enter Quiz Code</Text>

        <TextInput
          style={styles.input}
          placeholder="Quiz Code"
          placeholderTextColor="#777"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />

        <TouchableOpacity style={styles.button} onPress={joinQuiz}>
          <Text style={styles.btnText}>Join Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ================= TEACHER UI ================= */
  const deleteQuiz = async (quizId: string, quizCode: string) => {
  Alert.alert("Delete Quiz", "Are you sure?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      style: "destructive",
      onPress: async () => {
        try {
          await deleteDoc(doc(db, "quizzes", quizId));

          // remove from UI instantly
          setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        } catch {
          Alert.alert("Error", "Failed to delete quiz");
        }
      },
    },
  ]);
};
/* ================= TEACHER UI ================= */
return (
  <View style={styles.container}>
    <Text style={styles.title}>Teacher Dashboard</Text>

    {/* CREATE QUIZ BUTTON */}
    <TouchableOpacity
      style={styles.createBtn}
      onPress={() => router.push("/(tabs)/teacher-create-quiz")}
    >
      <Text style={styles.createText}>+ Create Quiz</Text>
    </TouchableOpacity>

    {loading ? (
      <Text style={styles.text}>Loading quizzes...</Text>
    ) : quizzes.length === 0 ? (
      <Text style={styles.text}>No quizzes created</Text>
    ) : (
      <FlatList
        data={quizzes}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
  <Text style={styles.quizTitle}>{item.title}</Text>
  <Text style={styles.code}>Code: {item.quizCode}</Text>

  <TeacherResults quizCode={item.quizCode} />


            {/* DOWNLOAD RESULTS */}
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() =>
                router.push(
                  `/teacher-results?quizCode=${item.quizCode}`
                )
              }
            >
              <Text style={{ color: "#00FF88", textAlign: "center" }}>
                Download Results
              </Text>
            </TouchableOpacity>

            {/* DELETE QUIZ */}
            <TouchableOpacity
              style={{ marginTop: 10 }}
              onPress={() => deleteQuiz(item.id, item.quizCode)}
            >
              <Text style={{ color: "red", textAlign: "center" }}>
                Delete Quiz
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    )}
  </View>
);


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
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  text: {
    color: "#ccc",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
  },
  btnText: {
    color: "#FFD700",
    textAlign: "center",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  quizTitle: {
    color: "#fff",
    fontSize: 16,
  },
  code: {
    color: "#FFD700",
  },
  createBtn: {
    borderWidth: 1,
    borderColor: "#00FF88",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  createText: {
    color: "#00FF88",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
