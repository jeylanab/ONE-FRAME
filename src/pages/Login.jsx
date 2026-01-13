// src/components/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      await login(email, password);
      navigate("/"); // redirect to home
    } catch (err) {
      // Friendly error messages based on Firebase code
      let msg = "Something went wrong. Please try again.";

      if (err.code === "auth/user-not-found") {
        msg = "No account found with this email.";
      } else if (err.code === "auth/wrong-password") {
        msg = "Incorrect password. Try again.";
      } else if (err.code === "auth/too-many-requests") {
        msg = "Too many login attempts. Please wait a few minutes and try again.";
      } else if (err.code === "auth/invalid-email") {
        msg = "Invalid email address.";
      }

      setError(msg);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="p-4 max-w-sm mx-auto mt-10 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full border p-2 mb-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Login
      </button>
    </form>
  );
}
