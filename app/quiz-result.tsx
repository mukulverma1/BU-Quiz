import { useLocalSearchParams } from "expo-router";
import {
    addDoc,
    collection,
    getDocs,
    query,
    Timestamp,
    where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../context/auth";
import { db } from "../firebase/config";

export default function QuizResult() {
  const params = useLocalSearchParams();
  const { user } = useAuth();

  const [score, setScore] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const quizCode = params.quizCode as string;
  const rawAnswers = params.answers as string;

  useEffect(() => {
    // disable back
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    const calculateResult = async () => {
      try {
        if (!quizCode || !rawAnswers) return;

        const userAnswers: number[] = JSON.parse(
          decodeURIComponent(rawAnswers),
        );

        const q = query(
          collection(db, "quizzes"),
          where("quizCode", "==", quizCode),
        );

        const snapshot = await getDocs(q);
        if (snapshot.empty) return;

        const quiz = snapshot.docs[0].data();

        let correct = 0;

        quiz.questions.forEach((question: any, index: number) => {
          if (userAnswers[index] === question.correct) {
            correct++;
          }
        });

        setScore(correct);
        setTotal(quiz.questions.length);

        // save result
        await addDoc(collection(db, "results"), {
          studentName: user?.name || "",
          rollNumber: user?.rollNumber || "",
          quizCode,
          score: correct,
          total: quiz.questions.length,
          submittedAt: Timestamp.now(),
        });
      } catch (err) {
        console.log("Result error:", err);
      }
    };

    calculateResult();
  }, []);

  if (score === null || total === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Calculating result...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz Result</Text>

      <Text style={styles.score}>
        {score} / {total}
      </Text>

      <Text style={styles.text}>Thank you for attending the quiz</Text>
      <Text style={styles.note}>You cannot go back once submitted</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    marginBottom: 20,
  },
  score: {
    color: "#fff",
    fontSize: 40,
    marginBottom: 15,
  },
  text: {
    color: "#ccc",
    fontSize: 16,
  },
  note: {
    color: "#777",
    fontSize: 12,
    marginTop: 10,
  },
});
