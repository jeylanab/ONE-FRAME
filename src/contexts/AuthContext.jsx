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
  const [loading, setLoading] = useState(true); // Loading during auth check

  // Track auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          let role = "user";
          try {
            const snap = await getDoc(doc(db, "users", firebaseUser.uid));
            if (snap.exists()) role = snap.data().role;
          } catch (err) {
            console.warn("Firestore user doc not found or permission issue", err);
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role,
          });
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Auth state error:", err);
        setUser(null);
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

      // Try to get Firestore role, fallback to 'user'
      let role = "user";
      try {
        const snap = await getDoc(doc(db, "users", userCredential.user.uid));
        if (snap.exists()) role = snap.data().role;
      } catch (err) {
        console.warn("Firestore read failed on login:", err);
      }

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role,
      });

      return userCredential.user; // ✅ return user for success
    } catch (err) {
      console.error("Login failed:", err);
      throw new Error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Create user doc in Firestore
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

      return userCredential.user; // ✅ return user for success
    } catch (err) {
      console.error("Signup failed:", err);
      throw new Error(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
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
