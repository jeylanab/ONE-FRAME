import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Quote from "./components/Quote";
import Footer from "./components/Footer";
import Features from "./components/Features"; // Newly created

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./admin/AdminLayout";

// Scroll to Top Utility
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Protected Route Logic
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

// Admin Route Logic
function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-[#0D004C] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user || user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#0D004C] selection:text-white">
        <ScrollToTop />
        
        {/* Conditional Navbar: We hide it or use a specific one for Admin if needed */}
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <>
                <Home />
                <Features />
              </>
            } />
            
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* User Protected Routes */}
            <Route
              path="/quote"
              element={
                <ProtectedRoute>
                  <Quote />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer visibility: Hide on Admin pages to keep the dashboard clean */}
        <FooterWrapper />
      </div>
    </AuthProvider>
  );
}

// Helper to hide footer on admin routes
function FooterWrapper() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  if (isAdminPath) return null;
  return <Footer />;
}