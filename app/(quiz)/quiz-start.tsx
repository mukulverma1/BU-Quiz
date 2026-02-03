import { useLocalSearchParams, useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AppState,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";

export default function QuizStart() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  // Parse quizData once to prevent re-renders
  const quizData = useMemo(() => JSON.parse(params.quizData as string), [params.quizData]);
  const quizDataString = useRef(params.quizData as string);

  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quizData.time * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const appState = useRef(AppState.currentState);
  const hasSubmitted = useRef(false);
  const isAntiCheatEnabled = useRef(false);

  useEffect(() => {
    const shuffled = [...quizData.questions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    setAnswers(new Array(shuffled.length).fill(-1));
    
    // Delay anti-cheat detection by 2 seconds to prevent false triggers during page load
    const enableTimer = setTimeout(() => {
      isAntiCheatEnabled.current = true;
    }, 2000);
    
    return () => clearTimeout(enableTimer);
  }, [quizData.questions]);

  useEffect(() => {
    if (isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasSubmitted.current) {
            handleSubmit(true);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitting]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      // Only trigger if anti-cheat is enabled and user actually left the app
      if (
        isAntiCheatEnabled.current &&
        appState.current.match(/active/) &&
        nextAppState.match(/inactive|background/) &&
        !hasSubmitted.current &&
        !isSubmitting
      ) {
        Alert.alert(
          "Quiz Auto-Submitted",
          "You left the quiz. It has been automatically submitted.",
          [{ text: "OK" }],
        );
        handleSubmit(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [isSubmitting]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Only trigger if anti-cheat is enabled and page is actually hidden
      if (isAntiCheatEnabled.current && document.hidden && !hasSubmitted.current && !isSubmitting) {
        Alert.alert(
          "Quiz Auto-Submitted",
          "You switched tabs. Quiz has been automatically submitted.",
          [{ text: "OK" }],
        );
        handleSubmit(true);
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [isSubmitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      if (selectedAnswer !== null) {
        newAnswers[currentQuestion] = selectedAnswer;
        setAnswers(newAnswers);
      }
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(
        newAnswers[currentQuestion - 1] !== -1
          ? newAnswers[currentQuestion - 1]
          : null,
      );
    }
  };

  const handleNext = () => {
    if (selectedAnswer === null) {
      Alert.alert("Error", "Please select an answer");
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedAnswer;
    setAnswers(newAnswers);

    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(
        newAnswers[currentQuestion + 1] !== -1
          ? newAnswers[currentQuestion + 1]
          : null,
      );
    } else {
      showSubmitConfirmation(newAnswers);
    }
  };

  const showSubmitConfirmation = (finalAnswers: number[]) => {
    if (shuffledQuestions.length === 0) return;
    
    const answeredCount = finalAnswers.filter(a => a !== -1).length;
    const totalQuestions = shuffledQuestions.length;
    const unansweredCount = totalQuestions - answeredCount;
    
    let message = `You have answered ${answeredCount} out of ${totalQuestions} questions.`;
    if (unansweredCount > 0) {
      message += `\n\n${unansweredCount} question(s) are unanswered!`;
    }
    message += "\n\nDo you want to submit your quiz or recheck your answers?";

    Alert.alert(
      "Submit Quiz?",
      message,
      [
        {
          text: "Recheck",
          style: "cancel",
        },
        {
          text: "Submit",
          style: "default",
          onPress: () => handleSubmit(false, finalAnswers),
        },
      ],
      { cancelable: false }
    );
  };

  const handleSubmit = async (autoSubmit: boolean, finalAnswers?: number[]) => {
    if (hasSubmitted.current || isSubmitting) return;

    hasSubmitted.current = true;
    setIsSubmitting(true);

    const submittedAnswers = finalAnswers || answers;
    let score = 0;

    shuffledQuestions.forEach((q, index) => {
      if (submittedAnswers[index] === q.correct) {
        score++;
      }
    });

    try {
      await addDoc(collection(db, "results"), {
        studentName: user?.name,
        rollNumber: user?.rollNumber,
        quizCode: quizData.quizCode,
        score,
        total: shuffledQuestions.length,
        submittedAt: new Date(),
      });

      router.replace({
        pathname: "/(quiz)/quiz-result",
        params: {
          score: score.toString(),
          total: shuffledQuestions.length.toString(),
          autoSubmit: autoSubmit.toString(),
        },
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      Alert.alert("Error", "Failed to submit quiz");
      setIsSubmitting(false);
      hasSubmitted.current = false;
    }
  };

  if (shuffledQuestions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading quiz...</Text>
      </View>
    );
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        <Text style={styles.progress}>
          {currentQuestion + 1} / {shuffledQuestions.length}
        </Text>
      </View>

      <View style={styles.warningBanner}>
        <Text style={styles.warningText}>
          ⚠️ Don't minimize or switch tabs - Quiz will auto-submit!
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.question}>{question.question}</Text>

        <View style={styles.options}>
          {question.options.map((option: string, index: number) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                selectedAnswer === index && styles.optionSelected,
              ]}
              onPress={() => setSelectedAnswer(index)}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedAnswer === index && styles.radioButtonSelected,
                ]}
              >
                {selectedAnswer === index && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
              <Text
                style={[
                  styles.optionText,
                  selectedAnswer === index && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.previousButton,
              currentQuestion === 0 && styles.navButtonDisabled,
            ]}
            onPress={handlePrevious}
            disabled={currentQuestion === 0 || isSubmitting}
          >
            <Text
              style={[
                styles.navButtonText,
                currentQuestion === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
            disabled={isSubmitting}
          >
            <Text style={styles.navButtonText}>
              {currentQuestion === shuffledQuestions.length - 1
                ? "Submit"
                : "Next"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#FFF",
    textAlign: "center",
    marginTop: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 16,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
  },
  progress: {
    fontSize: 18,
    color: "#FFF",
  },
  warningBanner: {
    backgroundColor: "#ff4444",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
  },
  question: {
    fontSize: 20,
    color: "#FFF",
    marginBottom: 24,
    lineHeight: 28,
  },
  options: {
    marginBottom: 24,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#222",
  },
  optionSelected: {
    borderColor: "#FFD700",
    backgroundColor: "#2a2a00",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#888",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#FFD700",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFD700",
  },
  optionText: {
    fontSize: 16,
    color: "#FFF",
    flex: 1,
  },
  optionTextSelected: {
    color: "#FFD700",
    fontWeight: "600",
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  navButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  previousButton: {
    backgroundColor: "#333",
    borderWidth: 2,
    borderColor: "#555",
  },
  nextButton: {
    backgroundColor: "#FFD700",
  },
  navButtonDisabled: {
    backgroundColor: "#222",
    borderColor: "#333",
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  navButtonTextDisabled: {
    color: "#666",
  },
});
