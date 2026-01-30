import AsyncStorage from "@react-native-async-storage/async-storage";

export const hardLogout = async () => {
  await AsyncStorage.clear();

  // web-safe full reset
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};
