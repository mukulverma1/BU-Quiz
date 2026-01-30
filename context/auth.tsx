import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserType = "student" | "teacher" | null;

type AuthContextType = {
  user: any;
  userType: UserType;
  login: (userData: any, type: UserType) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: any) => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);

  // Restore session
  useEffect(() => {
    const restore = async () => {
      try {
        const u = await AsyncStorage.getItem("user");
        const t = await AsyncStorage.getItem("userType");
        if (u && t) {
          setUser(JSON.parse(u));
          setUserType(t as UserType);
        }
      } finally {
        setLoading(false);
      }
    };
    restore();
  }, []);

  const login = async (userData: any, type: UserType) => {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
    await AsyncStorage.setItem("userType", type!);
    setUser(userData);
    setUserType(type);
  };

  const updateUser = async (userData: any) => {
    setUser(userData);
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setUser(null);
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userType, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
