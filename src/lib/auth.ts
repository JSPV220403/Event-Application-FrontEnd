import { jwtDecode } from "jwt-decode";
import { AuthUser } from "@/types/auth";

export const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("token");
};

export const getCurrentUser =
  (): AuthUser | null => {
    const token = getToken();

    if (!token) return null;

    try {
      return jwtDecode<AuthUser>(token);
    } catch {
      return null;
    }
  };

export const logout = () => {
  localStorage.removeItem("token");
};