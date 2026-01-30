import { useLocalSearchParams, useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { db } from "../firebase/config";

export default function QuizStart() {
  const { quizCode } = useLocalSearchParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const timerRef = useRef<any>(null);
  const submittedRef = useRef(false);

  // ✅ FETCH QUIZ
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
          router.replace("/(tabs)");
          return;
        }

        const quizData = snapshot.docs[0].data();

        const shuffledQuestions = quizData.questions.sort(
          () => Math.random() - 0.5,
        );

        setQuiz({ ...quizData, questions: shuffledQuestions });
        setAnswers(new Array(shuffledQuestions.length).fill(null));
        setTimeLeft(quizData.time * 60); // ⏱ start timer AFTER load
      } catch (err) {
        Alert.alert("Error", "Failed to load quiz");
      }
    };

    fetchQuiz();
  }, []);

  // ✅ TIMER (FIXED)
  useEffect(() => {
    if (!quiz) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timeLeft, quiz]);

  const handleSelect = (optionIndex: number) => {
    const updated = [...answers];
    updated[currentIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSubmit = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;

    clearInterval(timerRef.current);

    router.replace({
      pathname: "/quiz-result",
      params: {
        quizCode,
        answers: JSON.stringify(answers),
      },
    });
  };

  if (!quiz) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Loading quiz...</Text>
      </View>
    );
  }

  const question = quiz.questions[currentIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>
        ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
      </Text>

      <Text style={styles.question}>
        {currentIndex + 1}. {question.question}
      </Text>

      {question.options.map((opt: string, index: number) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.option,
            answers[currentIndex] === index && styles.selected,
          ]}
          onPress={() => handleSelect(index)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      {currentIndex < quiz.questions.length - 1 ? (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.btnText}>Submit Quiz</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  timer: {
    color: "#FFD700",
    textAlign: "right",
    marginBottom: 10,
  },
  question: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 15,
  },
  option: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  selected: {
    borderColor: "#FFD700",
  },
  optionText: {
    color: "#fff",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
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
