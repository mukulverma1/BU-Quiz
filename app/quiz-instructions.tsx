import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebase/config";

export default function QuizInstructions() {
  const { quizCode } = useLocalSearchParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const q = query(
          collection(db, "quizzes"),
          where("quizCode", "==", quizCode),
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          Alert.alert("Error", "Quiz not found");
          router.back();
          return;
        }

        setQuiz(snapshot.docs[0].data());
      } catch (err) {
        console.log(err);
        Alert.alert("Error", "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading quiz...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quiz.title}</Text>

      <Text style={styles.info}>⏱ Time: {quiz.time} minutes</Text>
      <Text style={styles.info}>❓ Questions: {quiz.questions.length}</Text>

      <View style={styles.rulesBox}>
        <Text style={styles.rulesTitle}>Instructions</Text>
        <Text style={styles.rule}>• Do not minimize the app</Text>
        <Text style={styles.rule}>• Quiz auto-submits when time ends</Text>
        <Text style={styles.rule}>• No back navigation</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          router.replace({
            pathname: "/quiz-start",
            params: { quizCode },
          })
        }
      >
        <Text style={styles.btnText}>Start Quiz</Text>
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
    marginBottom: 15,
  },
  info: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  rulesBox: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  rulesTitle: {
    color: "#FFD700",
    marginBottom: 10,
    fontSize: 16,
  },
  rule: {
    color: "#ccc",
    marginBottom: 5,
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
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
