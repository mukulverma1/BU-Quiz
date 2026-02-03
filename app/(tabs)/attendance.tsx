// ATTENDANCE FEATURE - UNCOMMENT TO ENABLE
/*
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../../context/auth';
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function Attendance() {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.type === 'student') {
      loadStudentAttendance();
    }
  }, []);

  const loadStudentAttendance = async () => {
    try {
      const subjectsQuery = query(
        collection(db, 'class_students'),
        where('studentEmail', '==', user?.email)
      );
      const subjectsSnapshot = await getDocs(subjectsQuery);
      
      const subjectAttendance = [];

      for (const subDoc of subjectsSnapshot.docs) {
        const subjectData = subDoc.data();
        
        const attendanceQuery = query(
          collection(db, 'attendance'),
          where('subjectId', '==', subjectData.subjectId)
        );
        const attendanceSnapshot = await getDocs(attendanceQuery);
        
        let totalClasses = 0;
        let presentClasses = 0;

        attendanceSnapshot.forEach(attDoc => {
          const attData = attDoc.data();
          totalClasses++;
          
          const studentRecord = attData.attendanceRecords.find(
            (r: any) => r.studentEmail === user?.email
          );
          
          if (studentRecord && studentRecord.status === 'present') {
            presentClasses++;
          }
        });

        const subjectDetailsQuery = query(
          collection(db, 'subjects'),
          where('__name__', '==', subjectData.subjectId)
        );
        const subjectDetailsSnapshot = await getDocs(subjectDetailsQuery);
        const subjectDetails = subjectDetailsSnapshot.docs[0]?.data();

        subjectAttendance.push({
          subjectName: subjectDetails?.name || 'Unknown',
          className: subjectDetails?.className || '',
          totalClasses,
          presentClasses,
          percentage: totalClasses > 0 ? (presentClasses / totalClasses) * 100 : 0,
        });
      }

      setSubjects(subjectAttendance);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading attendance...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Attendance</Text>

      {subjects.length === 0 ? (
        <Text style={styles.emptyText}>No attendance records found</Text>
      ) : (
        subjects.map((subject, index) => (
          <View key={index} style={styles.subjectCard}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{subject.subjectName}</Text>
              <Text style={styles.className}>{subject.className}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Present</Text>
                <Text style={styles.statValue}>{subject.presentClasses}</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statLabel}>Total</Text>
                <Text style={styles.statValue}>{subject.totalClasses}</Text>
              </View>

              <View style={styles.stat}>
                <Text style={styles.statLabel}>Percentage</Text>
                <Text
                  style={[
                    styles.statValue,
                    { color: subject.percentage >= 75 ? '#00ff00' : '#ff4444' },
                  ]}
                >
                  {subject.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>

            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${subject.percentage}%`,
                    backgroundColor: subject.percentage >= 75 ? '#00ff00' : '#ff4444',
                  },
                ]}
              />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 40,
    marginBottom: 24,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
  },
  subjectCard: {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  subjectHeader: {
    marginBottom: 16,
  },
  subjectName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    color: '#888',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
*/
