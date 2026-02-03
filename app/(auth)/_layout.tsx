import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="student-login" />
      <Stack.Screen name="student-signup" />
      <Stack.Screen name="teacher-login" />
      <Stack.Screen name="teacher-signup" />
    </Stack>
  );
}
