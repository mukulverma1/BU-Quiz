import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import XLSX from "xlsx";
import { db } from "../../firebase/config";

export default function TeacherResults({ quizCode }: { quizCode: string }) {
  const downloadExcel = async () => {
    try {
      const q = query(
        collection(db, "results"),
        where("quizCode", "==", quizCode),
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        Alert.alert("No Results", "No student has submitted yet");
        return;
      }

      const data = snap.docs.map((d) => d.data());

      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Results");

      const wbout = XLSX.write(wb, {
        type: "base64",
        bookType: "xlsx",
      });

      const uri = FileSystem.documentDirectory + `results_${quizCode}.xlsx`;

      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64,
      });

      await Sharing.shareAsync(uri);
    } catch (err) {
      Alert.alert("Error", "Failed to export results");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={downloadExcel}>
        <Text style={styles.text}>📊 Download Results</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  btn: {
    borderWidth: 1,
    borderColor: "#FFD700",
    padding: 10,
    borderRadius: 8,
  },
  text: {
    color: "#FFD700",
    textAlign: "center",
    fontSize: 14,
  },
});
