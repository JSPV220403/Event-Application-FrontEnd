"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { AuthUser } from "@/types/auth";
import { getCurrentUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  refreshUser: () => void;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    refreshUser: () => {},
    logout: () => {},
  });

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const refreshUser = () => {
    const decoded =
      getCurrentUser();

    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);