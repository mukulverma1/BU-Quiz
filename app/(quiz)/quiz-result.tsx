import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuizResult() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const score = parseInt(params.score as string);
  const total = parseInt(params.total as string);
  const autoSubmit = params.autoSubmit === "true";
  const percentage = ((score / total) * 100).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Quiz Completed!</Text>

        {autoSubmit && (
          <Text style={styles.autoSubmitText}>
            Time's up! Quiz auto-submitted
          </Text>
        )}

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>Your Score</Text>
          <Text style={styles.score}>
            {score} / {total}
          </Text>
          <Text style={styles.percentage}>{percentage}%</Text>
        </View>

        <View style={styles.resultMessage}>
          {parseFloat(percentage) >= 80 ? (
            <>
              <Text style={styles.resultEmoji}>🎉</Text>
              <Text style={styles.resultText}>Excellent Work!</Text>
            </>
          ) : parseFloat(percentage) >= 60 ? (
            <>
              <Text style={styles.resultEmoji}>👍</Text>
              <Text style={styles.resultText}>Good Job!</Text>
            </>
          ) : (
            <>
              <Text style={styles.resultEmoji}>📚</Text>
              <Text style={styles.resultText}>Keep Learning!</Text>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
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
    maxWidth: 400,
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  autoSubmitText: {
    fontSize: 14,
    color: "#ff8800",
    marginBottom: 24,
    textAlign: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginVertical: 32,
  },
  scoreLabel: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  score: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  percentage: {
    fontSize: 32,
    fontWeight: "600",
    color: "#FFD700",
  },
  resultMessage: {
    alignItems: "center",
    marginBottom: 32,
  },
  resultEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  resultText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#FFF",
  },
  button: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
