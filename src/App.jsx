import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import DestinasiPage from './pages/DestinasiPage';
import KategoriPage from './pages/KategoriPage';
import FavoritPage from './pages/FavoritPage'; 
import AboutPage from './pages/AboutPage';
import KabPage from './pages/KabPage'; 
import Login from './pages/Login';
import Register from './pages/Register';
import LupaSandi from './pages/LupaSandi';
import ProfilePage from './pages/ProfilePage';
import DetailPage from './pages/DetailPage'; 
import SearchPage from "./pages/SearchPage";
import ResetSandi from './pages/ResetSandi';
import PanduanPage from "./pages/PanduanPage";

const ProtectedRoute = ({ isLogin, children }) => {
  if (!isLogin) return <Navigate to="/login" replace />;
  return children;
};

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(() => {
    return localStorage.getItem('isLoginSULSELGO') === 'true';
  });

  const hideNavbar = 
    location.pathname === '/login' || 
    location.pathname === '/register' || 
    location.pathname === '/lupa-sandi';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetLogin = (status) => {
    setIsLogin(status);
    localStorage.setItem('isLoginSULSELGO', status);

    if (!status) {
      localStorage.removeItem('user');
    }
  };

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Poppins', sans-serif; margin: 0; }
      `}</style>
      
      {!hideNavbar && (
        <Navbar 
          scrolled={scrolled} 
          isLogin={isLogin} 
          setIsLogin={handleSetLogin} 
        />
      )}
      
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<Login setIsLogin={handleSetLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/lupa-sandi" element={<LupaSandi />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/reset-sandi" element={<ResetSandi />} />

        <Route 
          path="/profil" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <ProfilePage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/detail" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <DetailPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/destinasi" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <DestinasiPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/kategori" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <KategoriPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/favorit" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <FavoritPage />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/wilayah" 
          element={
            <ProtectedRoute isLogin={isLogin}>
              <KabPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/kabupaten/:kabupaten/:id"
          element={<DetailPage />}
        />
        <Route
          path="/kabpage/:kabupaten"
          element={<KabPage />}
        />
        <Route
          path="/panduan"
          element={<PanduanPage />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;