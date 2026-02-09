import { useRouter } from "expo-router";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AboutDeveloper() {
  const router = useRouter();

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.navigate("/(tabs)/profile")} style={styles.backButton}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>👨‍💻</Text>
        </View>
        <Text style={styles.title}>Meet the Developer</Text>
        <Text style={styles.subtitle}>Built with passion & code</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About This App</Text>
        <Text style={styles.description}>
          This Quiz Management App is designed to simplify
          educational assessments. Built with modern
          technologies to provide a seamless experience for both teachers and
          students.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🚀 Features</Text>
        <View style={styles.featureList}>
          <FeatureItem text="Quiz creation and management" />
          <FeatureItem text="Real-time quiz taking with timer" />
          <FeatureItem text="Automatic grading and results" />
          <FeatureItem text="Excel export functionality" />
          <FeatureItem text="Attendance tracking system" />
          <FeatureItem text="Student performance analytics" />
          <FeatureItem text="Dark theme UI throughout" />
          <FeatureItem text="Cross-platform support" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>💻 Tech Stack</Text>
        <View style={styles.techStack}>
          <TechBadge name="React Native" />
          <TechBadge name="Expo" />
          <TechBadge name="TypeScript" />
          <TechBadge name="Firebase" />
          <TechBadge name="Firestore" />
          <TechBadge name="Expo Router" />
          <TechBadge name="AsyncStorage" />
          <TechBadge name="XLSX" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>👨‍💻 Developer Info</Text>
        <InfoRow label="Name" value="Your Name Here" />
        <InfoRow label="Role" value="Full Stack Developer" />
        <InfoRow label="Specialization" value="Mobile & Web Development" />
        <InfoRow label="Location" value="Your Location" />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>🔗 Connect With Me</Text>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openLink("https://github.com/yourusername")}
        >
          <Text style={styles.socialIcon}>🐙</Text>
          <View style={styles.socialInfo}>
            <Text style={styles.socialLabel}>GitHub</Text>
            <Text style={styles.socialLink}>github.com/yourusername</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openLink("https://linkedin.com/in/yourusername")}
        >
          <Text style={styles.socialIcon}>💼</Text>
          <View style={styles.socialInfo}>
            <Text style={styles.socialLabel}>LinkedIn</Text>
            <Text style={styles.socialLink}>linkedin.com/in/yourusername</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openLink("mailto:your.email@example.com")}
        >
          <Text style={styles.socialIcon}>📧</Text>
          <View style={styles.socialInfo}>
            <Text style={styles.socialLabel}>Email</Text>
            <Text style={styles.socialLink}>your.email@example.com</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => openLink("https://yourportfolio.com")}
        >
          <Text style={styles.socialIcon}>🌐</Text>
          <View style={styles.socialInfo}>
            <Text style={styles.socialLabel}>Portfolio</Text>
            <Text style={styles.socialLink}>yourportfolio.com</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>📱 App Information</Text>
        <InfoRow label="Version" value="1.0.0" />
        <InfoRow label="Release Date" value="February 2026" />
        <InfoRow label="Platform" value="iOS, Android, Web" />
        <InfoRow label="License" value="MIT License" />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with ❤️ by Your Name</Text>
        <Text style={styles.copyright}>© 2026 All Rights Reserved</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function FeatureItem({ text }: { text: string }) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureBullet}>✓</Text>
      <Text style={styles.featureText}>{text}</Text>
    </View>
  );
}

function TechBadge({ name }: { name: string }) {
  return (
    <View style={styles.techBadge}>
      <Text style={styles.techBadgeText}>{name}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backButton: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  backButtonText: {
    color: "#FFD700",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFD700",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#111",
  },
  avatarText: {
    fontSize: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#111",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#CCC",
    lineHeight: 24,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureBullet: {
    fontSize: 18,
    color: "#00ff00",
    marginRight: 12,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 16,
    color: "#CCC",
    flex: 1,
  },
  techStack: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  techBadge: {
    backgroundColor: "#222",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  techBadgeText: {
    color: "#FFD700",
    fontSize: 14,
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
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
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  socialIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  socialInfo: {
    flex: 1,
  },
  socialLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  socialLink: {
    fontSize: 14,
    color: "#FFD700",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  copyright: {
    fontSize: 14,
    color: "#666",
  },
});
