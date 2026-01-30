import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../context/auth";
import { db } from "../firebase/config";

export default function TeacherCreateQuiz() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("10");
  const [questions, setQuestions] = useState<any[]>([]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: ["", "", "", ""],
        correct: 0,
      },
    ]);
  };

  const updateQuestion = (qIndex: number, field: string, value: any) => {
    const updated = [...questions];
    updated[qIndex][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const createQuiz = async () => {
    if (!title || questions.length === 0) {
      Alert.alert("Error", "Add title and questions");
      return;
    }

    const quizCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    await addDoc(collection(db, "quizzes"), {
      title,
      time: Number(time),
      quizCode,
      teacherEmail: user.email,
      questions,
      createdAt: new Date(),
    });

    Alert.alert("Success", `Quiz Code: ${quizCode}`, [
      { text: "OK", onPress: () => router.back() },
    ]);
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
        keyboardType="number-pad"
        value={time}
        onChangeText={setTime}
      />

      {questions.map((q, qi) => (
        <View key={qi} style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder={`Question ${qi + 1}`}
            placeholderTextColor="#777"
            value={q.question}
            onChangeText={(v) => updateQuestion(qi, "question", v)}
          />

          {q.options.map((opt: string, oi: number) => (
            <TextInput
              key={oi}
              style={styles.input}
              placeholder={`Option ${oi + 1}`}
              placeholderTextColor="#777"
              value={opt}
              onChangeText={(v) => updateOption(qi, oi, v)}
            />
          ))}

          <TextInput
            style={styles.input}
            placeholder="Correct option (0-3)"
            placeholderTextColor="#777"
            keyboardType="number-pad"
            value={String(q.correct)}
            onChangeText={(v) => updateQuestion(qi, "correct", Number(v))}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.button} onPress={addQuestion}>
        <Text style={styles.btnText}>+ Add Question</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.createBtn} onPress={createQuiz}>
        <Text style={styles.createText}>Create Quiz</Text>
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
    fontSize: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#111",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#222",
  },
  card: {
    backgroundColor: "#111",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  btnText: {
    color: "#FFD700",
    textAlign: "center",
  },
  createBtn: {
    borderWidth: 1,
    borderColor: "#00FF88",
    padding: 15,
    borderRadius: 10,
    marginBottom: 40,
  },
  createText: {
    color: "#00FF88",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});
