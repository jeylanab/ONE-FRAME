import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages & Main Components
import Quote from "./components/Quote";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./admin/AdminLayout";

// Helper to handle window positioning
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Logic: If not logged in, force to Login page
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

// Logic: Restrict Admin area
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#0D004C] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user || user.role !== "admin") return <Navigate to="/quote" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#0D004C] selection:text-white bg-white">
        <ScrollToTop />
        
        {/* Navbar and Footer removed as per Jacq's request for a backend-only feel */}
        
        <main className="flex-1">
          <Routes>
            {/* 1. Redirect Root to Quote: Ensures users go straight to the tool */}
            <Route path="/" element={<Navigate to="/quote" replace />} />
            
            {/* 2. Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 3. The Calculator: Protected so login is mandatory first */}
            <Route
              path="/quote"
              element={
                <ProtectedRoute>
                  <Quote />
                </ProtectedRoute>
              }
            />

            {/* 4. Admin Management */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            />

            {/* 5. Fallback: Catch-all redirects back to the tool */}
            <Route path="*" element={<Navigate to="/quote" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}