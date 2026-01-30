import { Tabs } from "expo-router";
import { useAuth } from "../../context/auth";

export default function TabsLayout() {
  const { userType } = useAuth();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      {userType === "student" ? (
        <>
          <Tabs.Screen name="index" options={{ title: "Home" }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </>
      ) : (
        <>
          <Tabs.Screen name="index" options={{ title: "Dashboard" }} />
          <Tabs.Screen name="profile" options={{ title: "Profile" }} />
        </>
      )}
    </Tabs>
  );
}
