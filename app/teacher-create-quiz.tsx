import { useRouter } from "expo-router";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity
} from "react-native";
import { useAuth } from "../context/auth";
import { db } from "../firebase/config";

export default function TeacherCreateQuiz() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correct, setCorrect] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);

  const generateCode = () =>
    Math.random().toString(36).substring(2, 8).toUpperCase();

  const addQuestion = () => {
    if (!question || options.some((o) => !o) || correct === null) {
      Alert.alert("Error", "Fill question, all options & correct answer");
      return;
    }

    setQuestions([...questions, { question, options, correct }]);

    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrect(null);
  };

  const saveQuiz = async () => {
    if (!title || !time || questions.length === 0) {
      Alert.alert("Error", "Quiz title, time & questions required");
      return;
    }

    try {
      const quizCode = generateCode();

      await addDoc(collection(db, "quizzes"), {
        title,
        quizCode,
        time: Number(time),
        questions,
        teacherEmail: user.email,
        createdAt: Timestamp.now(),
      });

      Alert.alert("Success", `Quiz Created\nCode: ${quizCode}`, [
        {
          text: "OK",
          onPress: () => router.replace("/(tabs)"),
        },
      ]);
    } catch (e) {
      Alert.alert("Error", "Failed to create quiz");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Quiz</Text>

      <TextInput
        style={styles.input}
        placeholder="Quiz Title"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Time (minutes)"
        placeholderTextColor="#777"
        keyboardType="numeric"
        value={time}
        onChangeText={setTime}
      />

      <Text style={styles.section}>Add Question</Text>

      <TextInput
        style={styles.input}
        placeholder="Question"
        placeholderTextColor="#777"
        value={question}
        onChangeText={setQuestion}
      />

      {options.map((opt, i) => (
        <TextInput
          key={i}
          style={styles.input}
          placeholder={`Option ${i + 1}`}
          placeholderTextColor="#777"
          value={opt}
          onChangeText={(t) => {
            const arr = [...options];
            arr[i] = t;
            setOptions(arr);
          }}
        />
      ))}

      <Text style={styles.label}>Correct Option (0–3)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        placeholder="Example: 0"
        placeholderTextColor="#777"
        value={correct === null ? "" : String(correct)}
        onChangeText={(v) => setCorrect(Number(v))}
      />

      <TouchableOpacity style={styles.button} onPress={addQuestion}>
        <Text style={styles.btnText}>+ Add Question</Text>
      </TouchableOpacity>

      <Text style={styles.count}>Questions Added: {questions.length}</Text>

      <TouchableOpacity style={styles.saveBtn} onPress={saveQuiz}>
        <Text style={styles.saveText}>Save Quiz</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    color: "#FFD700",
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    color: "#FFD700",
    marginVertical: 10,
    fontSize: 16,
  },
  label: {
    color: "#777",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  btnText: {
    color: "#FFD700",
    textAlign: "center",
  },
  count: {
    color: "#ccc",
    textAlign: "center",
    marginVertical: 10,
  },
  saveBtn: {
    borderWidth: 1,
    borderColor: "#00FF88",
    padding: 15,
    borderRadius: 10,
    marginBottom: 40,
  },
  saveText: {
    color: "#00FF88",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
