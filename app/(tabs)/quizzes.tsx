import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";

interface Question {
  question: string;
  options: string[];
  correct: number;
}

export default function CreateQuiz() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correct: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  // Reset form when component mounts or comes into focus
  useEffect(() => {
    resetForm();
  }, []);

  const resetForm = () => {
    setTitle("");
    setTime("");
    setQuestions([{ question: "", options: ["", "", "", ""], correct: 0 }]);
  };

  const generateQuizCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: "", options: ["", "", "", ""], correct: 0 },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      Alert.alert("Error", "Quiz must have at least one question");
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions];
    if (field === "question") {
      updated[index].question = value;
    } else if (field === "correct") {
      updated[index].correct = value;
    }
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const validateQuiz = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter quiz title");
      return false;
    }

    const timeNum = parseInt(time);
    if (!time || isNaN(timeNum) || timeNum <= 0) {
      Alert.alert("Error", "Please enter valid time in minutes");
      return false;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        Alert.alert("Error", `Question ${i + 1} is empty`);
        return false;
      }
      for (let j = 0; j < 4; j++) {
        if (!q.options[j].trim()) {
          Alert.alert("Error", `Question ${i + 1}, Option ${j + 1} is empty`);
          return false;
        }
      }
    }

    return true;
  };

  const handleCreateQuiz = async () => {
    if (!validateQuiz()) return;

    setLoading(true);
    try {
      const quizCode = generateQuizCode();

      await addDoc(collection(db, "quizzes"), {
        title: title.trim(),
        quizCode,
        time: parseInt(time),
        questions,
        teacherEmail: user?.email,
        createdAt: new Date(),
      });

      Alert.alert("Success", `Quiz created with code: ${quizCode}`, [
        {
          text: "OK",
          onPress: () => {
            resetForm(); // Reset form after successful creation
            router.back();
          },
        },
      ]);
    } catch (error) {
      console.error("Error creating quiz:", error);
      Alert.alert("Error", "Failed to create quiz");
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Quiz</Text>

      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Quiz Title"
          placeholderTextColor="#888"
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.input}
          placeholder="Time (minutes)"
          placeholderTextColor="#888"
          value={time}
          onChangeText={setTime}
          keyboardType="numeric"
        />
      </View>

      <Text style={styles.sectionTitle}>Questions</Text>

      {questions.map((q, qIndex) => (
        <View key={qIndex} style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>Question {qIndex + 1}</Text>
            {questions.length > 1 && (
              <TouchableOpacity
                onPress={() => removeQuestion(qIndex)}
                style={styles.removeButton}
              >
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Enter question"
            placeholderTextColor="#888"
            value={q.question}
            onChangeText={(value) => updateQuestion(qIndex, "question", value)}
            multiline
          />

          {q.options.map((option, oIndex) => (
            <View key={oIndex} style={styles.optionRow}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  q.correct === oIndex && styles.radioButtonSelected,
                ]}
                onPress={() => updateQuestion(qIndex, "correct", oIndex)}
              >
                <View
                  style={q.correct === oIndex ? styles.radioButtonInner : null}
                />
              </TouchableOpacity>
              <TextInput
                style={[styles.input, styles.optionInput]}
                placeholder={`Option ${oIndex + 1}`}
                placeholderTextColor="#888"
                value={option}
                onChangeText={(value) => updateOption(qIndex, oIndex, value)}
              />
            </View>
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addQuestion}>
        <Text style={styles.addButtonText}>+ Add Question</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.createButton, loading && styles.buttonDisabled]}
        onPress={handleCreateQuiz}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Create Quiz"}
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFD700",
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    color: "#ff4444",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#222",
    color: "#FFF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  optionInput: {
    flex: 1,
    marginBottom: 0,
  },
  addButton: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  addButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  createButton: {
    backgroundColor: "#FFD700",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
});
