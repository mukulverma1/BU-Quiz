import { useRouter } from "expo-router";
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    query,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    RefreshControl,
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

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const [quizCode, setQuizCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.type === "teacher") {
      loadQuizzes();
    }
  }, [user]);

  const loadQuizzes = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, "quizzes"),
        where("teacherEmail", "==", user.email),
      );
      const querySnapshot = await getDocs(q);
      const quizzesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuizzes(quizzesData);
    } catch (error) {
      console.error("Error loading quizzes:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuizzes();
    setRefreshing(false);
  };

  const handleJoinQuiz = async () => {
    const code = quizCode.trim().toUpperCase();

    if (!code) {
      showAlert("Error", "Please enter a quiz code");
      return;
    }

    setLoading(true);

    try {
      const q = query(collection(db, "quizzes"), where("quizCode", "==", code));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        showAlert("Error", "Invalid quiz code. Please check and try again.");
        setLoading(false);
        return;
      }

      const quizDoc = querySnapshot.docs[0];
      const quizData = {
        id: quizDoc.id,
        ...quizDoc.data(),
      };

      // Navigate to quiz instructions
      router.push({
        pathname: "/(quiz)/quiz-instructions",
        params: { quizData: JSON.stringify(quizData) },
      });
    } catch (error) {
      console.error("Error joining quiz:", error);
      showAlert("Error", "Failed to join quiz. Please try again.");
      setLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string, quizTitle: string) => {
    showAlert(
      "Delete Quiz",
      `Are you sure you want to delete "${quizTitle}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "quizzes", quizId));
              await loadQuizzes();
              showAlert("Success", "Quiz deleted successfully");
            } catch (error) {
              console.error("Error deleting quiz:", error);
              showAlert("Error", "Failed to delete quiz");
            }
          },
        },
      ],
    );
  };

  if (user?.type === "student") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {user.name}!</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Enter Quiz Code</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter 6-character code"
            placeholderTextColor="#888"
            value={quizCode}
            onChangeText={setQuizCode}
            autoCapitalize="characters"
            maxLength={6}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleJoinQuiz}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Validating..." : "Join Quiz"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor="#FFD700"
        />
      }
    >
      <Text style={styles.title}>Teacher Dashboard</Text>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(tabs)/quizzes")}
      >
        <Text style={styles.buttonText}>+ Create New Quiz</Text>
      </TouchableOpacity>

      <View style={styles.quizList}>
        <Text style={styles.sectionTitle}>My Quizzes</Text>

        {quizzes.length === 0 ? (
          <Text style={styles.emptyText}>No quizzes created yet</Text>
        ) : (
          quizzes.map((quiz) => (
            <View key={quiz.id} style={styles.quizCard}>
              <View style={styles.quizInfo}>
                <Text style={styles.quizTitle}>{quiz.title}</Text>
                <Text style={styles.quizCode}>Code: {quiz.quizCode}</Text>
                <Text style={styles.quizTime}>Time: {quiz.time} minutes</Text>
                <Text style={styles.quizQuestions}>
                  Questions: {quiz.questions?.length || 0}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteQuiz(quiz.id, quiz.title)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
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
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  createButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  quizList: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  quizCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  quizInfo: {
    marginBottom: 12,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  quizCode: {
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 4,
  },
  quizTime: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
  },
  quizQuestions: {
    fontSize: 14,
    color: "#888",
  },
  deleteButton: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
