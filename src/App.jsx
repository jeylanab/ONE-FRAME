import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Components
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Quote from "./components/Quote";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Contact from "./components/Contact"; // New Import

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLayout from "./admin/AdminLayout";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* Primary Landing Page Flow */}
            <Route path="/" element={
              <>
                <Home />
                <Features />
                <Contact /> {/* Contact added here for a seamless scroll experience */}
              </>
            } />
            
            {/* Direct Access Routes */}
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/quote"
              element={
                <ProtectedRoute>
                  <Quote />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <FooterWrapper />
      </div>
    </AuthProvider>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  
  if (isAdminPath) return null;
  return <Footer />;
}