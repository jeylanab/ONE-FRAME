// src/contexts/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", firebaseUser.uid));
        if (!snap.exists()) {
          console.warn(`User doc not found for UID: ${firebaseUser.uid}`);
        }

        const data = snap.data() || {};
        const role = data.role || "user";

        console.log("AuthContext: user fetched:", {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
        });

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role,
        });
      } catch (err) {
        console.error("Error fetching user role:", err);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          role: "user",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      let role = "user";
      try {
        const snap = await getDoc(doc(db, "users", userCredential.user.uid));
        const data = snap.data() || {};
        role = data.role || "user";
        console.log("Login: fetched role:", role);
      } catch (err) {
        console.warn("Firestore read failed on login:", err);
      }

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role,
      });

      return userCredential.user;
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      try {
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role: "user",
          createdAt: new Date(),
        });
      } catch (err) {
        console.warn("Firestore user doc creation failed:", err);
      }

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: "user",
      });

      return userCredential.user;
    } catch (err) {
      console.error("Signup failed:", err);
      throw new Error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
