import { Stack } from "expo-router";

export default function QuizLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#000" },
        animation: "fade",
      }}
    >
      <Stack.Screen name="quiz-instructions" />
      <Stack.Screen name="quiz-start" />
      <Stack.Screen name="quiz-result" />
    </Stack>
  );
}
