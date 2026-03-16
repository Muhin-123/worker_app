import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Technician } from "@/types";
import { db } from "@/firebase";
import { collection, query, where, getDocs, doc, updateDoc } from "firebase/firestore";

interface AuthContextType {
  user: Technician | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateAvailability: (status: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("tn_water_auth");
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email: string, _password: string) => {
    const q = query(collection(db, "technicians"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const docData = snapshot.docs[0];
      const technician = { ...docData.data(), id: docData.id } as Technician;
      setUser(technician);
      localStorage.setItem("tn_water_auth", JSON.stringify(technician));
    } else {
      throw new Error("Technician not found");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tn_water_auth");
  };

  const updateAvailability = async (status: string) => {
    if (user) {
      const techRef = doc(db, "technicians", user.id);
      await updateDoc(techRef, { availabilityStatus: status });
      const updated = { ...user, availabilityStatus: status };
      setUser(updated);
      localStorage.setItem("tn_water_auth", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout, updateAvailability }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};
