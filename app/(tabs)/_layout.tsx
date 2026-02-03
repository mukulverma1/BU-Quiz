import { Tabs } from "expo-router";
import { Text } from "react-native";
import { useAuth } from "../../context/auth";

export default function TabsLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) return null;

  const isStudent = user.type === "student";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111",
          borderTopColor: "#FFD700",
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "#888",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: isStudent ? "Home" : "Dashboard",
          tabBarLabel: isStudent ? "Home" : "Dashboard",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>🏠</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>👤</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="quizzes"
        options={{
          href: isStudent ? null : "/(tabs)/quizzes",
          title: "Quizzes",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📝</Text>
          ),
        }}
      />

      <Tabs.Screen
        name="results"
        options={{
          href: isStudent ? null : "/(tabs)/results",
          title: "Results",
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📊</Text>
          ),
        }}
      />
    </Tabs>
  );
}
