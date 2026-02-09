import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function QuizInstructions() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [quizData, setQuizData] = useState<any>(null);
  const hasNavigated = useRef(false);

  useEffect(() => {
    try {
      if (params.quizData) {
        const parsed = JSON.parse(params.quizData as string);
        setQuizData(parsed);
      }
    } catch (e) {
      console.error("Failed to parse quiz data:", e);
    }
  }, [params.quizData]);

  useEffect(() => {
    if (countdown > 0 && quizData) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && quizData && !hasNavigated.current) {
      hasNavigated.current = true;
      router.push({
        pathname: "/(quiz)/quiz-start",
        params: { quizData: JSON.stringify(quizData) },
      });
    }
  }, [countdown, quizData, router]);

  if (!quizData) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Error</Text>
          <Text style={styles.errorText}>Failed to load quiz data.</Text>
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>
              Redirecting in {countdown} seconds...
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{quizData.title || "Quiz"}</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Quiz Code:</Text>
          <Text style={styles.infoValue}>{quizData.quizCode}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Time Limit:</Text>
          <Text style={styles.infoValue}>{quizData.time} minutes</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Total Questions:</Text>
          <Text style={styles.infoValue}>
            {quizData.questions?.length || 0}
          </Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            • Answer all questions before time runs out
          </Text>
          <Text style={styles.instructionText}>
            • Each question has 4 options
          </Text>
          <Text style={styles.instructionText}>
            • Select one correct answer per question
          </Text>
          <Text style={styles.instructionText}>
            • Quiz will auto-submit when time ends
          </Text>
          <Text style={styles.instructionText}>
            • You cannot go back once started
          </Text>
          <Text style={styles.instructionText}>
            • Don't minimize or switch tabs - Quiz will auto-submit!
          </Text>
        </View>

        <View style={styles.countdownContainer}>
          <Text style={styles.countdownText}>
            Quiz starting in {countdown} seconds...
          </Text>
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>⚠️ Anti-Cheat Warning</Text>
          <Text style={styles.warningDetail}>
            Once started, you cannot go back or cancel. Minimizing the app, switching tabs, or leaving the quiz screen will auto-submit your answers.
          </Text>
        </View>
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
  card: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 24,
    textAlign: "center",
  },
  infoBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  infoLabel: {
    fontSize: 16,
    color: "#888",
  },
  infoValue: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  instructions: {
    marginTop: 24,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    color: "#CCC",
    marginBottom: 8,
    lineHeight: 20,
  },
  countdownContainer: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  warningBox: {
    backgroundColor: "#ff4444",
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
    textAlign: "center",
  },
  warningDetail: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
});
