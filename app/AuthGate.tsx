import { Redirect, Slot } from "expo-router";
import { useAuth } from "../context/auth";

export default function AuthGate() {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Redirect href="/" />;
  }

  return <Slot />;
}
