import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import * as XLSX from "xlsx";
import { useAuth } from "../../context/auth";
import { db } from "../../firebase/config";
import { showAlert } from "../../utils/alert";

export default function TeacherResults() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

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

  const loadResults = async (quizCode: string) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "results"),
        where("quizCode", "==", quizCode),
      );
      const querySnapshot = await getDocs(q);
      const resultsData = querySnapshot.docs.map((doc) => doc.data());
      setResults(resultsData);
      setSelectedQuiz(quizCode);
    } catch (error) {
      console.error("Error loading results:", error);
      showAlert("Error", "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = async () => {
    if (results.length === 0) {
      showAlert("Error", "No results to download");
      return;
    }

    try {
      // Prepare data with specific fields
      const data = results.map((r) => ({
        Name: r.studentName || "",
        RollNumber: r.rollNumber || "",
        Class: r.class || "",
        "Total Marks": r.total || 0,
        "Obtain Marks": r.score || 0,
      }));

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Results");

      const filename = `Quiz_Results_${selectedQuiz}.xlsx`;
      
      if (Platform.OS === "web") {
        // For web: direct browser download
        XLSX.writeFile(wb, filename);
        showAlert("Success", "Excel file downloaded to your computer");
      } else {
        // For mobile: Save to cache and share
        const wbout = XLSX.write(wb, { type: "base64", bookType: "xlsx" });
        const fileUri = FileSystem.cacheDirectory + filename;
        
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
          encoding: "base64",
        });
        
        // Share the file - user can choose to save to Downloads
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          dialogTitle: "Save Quiz Results",
          UTI: "org.openxmlformats.spreadsheetml.sheet",
        });
      }
    } catch (error) {
      console.error("Error downloading Excel:", error);
      showAlert("Error", "Failed to download Excel file");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Quiz Results</Text>

      <Text style={styles.sectionTitle}>Select Quiz</Text>

      {quizzes.length === 0 ? (
        <Text style={styles.emptyText}>No quizzes available</Text>
      ) : (
        quizzes.map((quiz) => (
          <TouchableOpacity
            key={quiz.id}
            style={[
              styles.quizCard,
              selectedQuiz === quiz.quizCode && styles.quizCardSelected,
            ]}
            onPress={() => loadResults(quiz.quizCode)}
          >
            <Text style={styles.quizTitle}>{quiz.title}</Text>
            <Text style={styles.quizCode}>Code: {quiz.quizCode}</Text>
          </TouchableOpacity>
        ))
      )}

      {selectedQuiz && (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.sectionTitle}>Results</Text>
            {results.length > 0 && (
              <TouchableOpacity
                style={styles.exportButton}
                onPress={downloadExcel}
              >
                <Text style={styles.exportButtonText}>Download Excel</Text>
              </TouchableOpacity>
            )}
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Loading results...</Text>
          ) : results.length === 0 ? (
            <Text style={styles.emptyText}>No submissions yet</Text>
          ) : (
            results.map((result, index) => (
              <View key={index} style={styles.resultCard}>
                <Text style={styles.studentName}>{result.studentName}</Text>
                <Text style={styles.rollNumber}>Roll: {result.rollNumber}</Text>
                <Text style={styles.score}>
                  Score: {result.score}/{result.total} (
                  {((result.score / result.total) * 100).toFixed(2)}%)
                </Text>
                <Text style={styles.submittedAt}>
                  Submitted:{" "}
                  {new Date(result.submittedAt.seconds * 1000).toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </>
      )}

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
    marginBottom: 16,
  },
  emptyText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
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
  quizCardSelected: {
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  quizCode: {
    fontSize: 14,
    color: "#FFD700",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
  },
  exportButton: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
  resultCard: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  rollNumber: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  score: {
    fontSize: 16,
    color: "#FFD700",
    marginBottom: 4,
  },
  submittedAt: {
    fontSize: 12,
    color: "#888",
  },
});
