import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = ({ scrolled, isLogin, setIsLogin }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); 
  const menuRef = useRef(null); 

  const isLandingPage = location.pathname === "/";
  const showWhiteNavbar = scrolled || !isLandingPage;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    setIsMenuOpen(false);
    setIsLogin(false);
    localStorage.removeItem('isLoginSULSELGO');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const goProtected = (path) => {
    if (!isLogin) {
      navigate("/login");
      return;
    }
    navigate(path);
  };

  const dropdownItemStyle = {
    padding: '14px 25px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    cursor: 'pointer',
    transition: '0.2s',
  };

  const navLinkStyle = ({ isActive }) => ({
    textDecoration: 'none',
    color: isActive ? '#fff' : 'inherit',
    backgroundColor: isActive ? '#8B0000' : 'transparent',
    padding: '8px 20px',
    borderRadius: '20px',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    cursor: 'pointer'
  });

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', display: 'flex',
      justifyContent: 'space-between', alignItems: 'center',
      padding: '8px 6%', boxSizing: 'border-box', zIndex: 1000,
      backgroundColor: showWhiteNavbar ? '#fff' : 'transparent',
      background: showWhiteNavbar 
        ? '#fff' 
        : 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
      boxShadow: showWhiteNavbar ? '0 2px 15px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.4s ease'
    }}>
      
      <Link to="/" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <img 
          src="https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781033400/sulselgo/logo_sulselgoo.png" 
          alt="Logo" 
          style={{ 
            height: '55px', width: 'auto',
            filter: showWhiteNavbar ? 'none' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transition: '0.3s'
          }} 
        />
      </Link>

      <ul style={{
        display: isMobile ? 'none' : 'flex', listStyle: 'none', gap: '15px', margin: 0, padding: 0, 
        alignItems: 'center', color: showWhiteNavbar ? '#1a1a1a' : '#fff', 
        fontWeight: '600', fontSize: '15px',
        textShadow: showWhiteNavbar ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
        transition: 'color 0.4s ease'
      }}>
        <li>
          <span onClick={() => goProtected("/destinasi")}
            style={navLinkStyle({ isActive: location.pathname === "/destinasi" })}>
            Destinasi
          </span>
        </li>

        <li>
          <span onClick={() => goProtected("/kategori")}
            style={navLinkStyle({ isActive: location.pathname === "/kategori" })}>
            Kategori
          </span>
        </li>

        <li>
          <span onClick={() => goProtected("/wilayah")}
            style={navLinkStyle({ isActive: location.pathname === "/wilayah" })}>
            Kota/Kabupaten
          </span>
        </li>

        <li>
          <NavLink to="/about" style={navLinkStyle}>About</NavLink>
        </li>
      </ul>
      
      <div 
        ref={menuRef} 
        style={{ 
          display: 'flex', alignItems: 'center', gap: isMobile ? '15px' : '25px', 
          color: showWhiteNavbar ? '#1a1a1a' : '#fff',
          position: 'relative' 
        }}
      >

        {/* ✅ INI YANG DITAMBAHKAN */}
        <svg 
          onClick={() => navigate("/search")}
          width="22" 
          height="22" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ cursor: 'pointer' }}
        >
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>

        <div 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>

        {isMenuOpen && (
          isMobile ? (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "#fff",
                zIndex: 9999,
                padding: "24px",
                overflowY: "auto",
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "40px",
                }}
              >
                <img
                  src="https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781033400/sulselgo/logo_sulselgoo.png"
                  alt="Logo"
                  style={{ height: "55px" }}
                />

                <div
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    fontSize: "40px",
                    cursor: "pointer",
                    color: "#777",
                  }}
                >
                  ✕
                </div>
              </div>

              <div
                style={dropdownItemStyle}
                onClick={() => {
                  setIsMenuOpen(false);
                  goProtected("/destinasi");
                }}
              >
                Destinasi
              </div>

              <div
                style={dropdownItemStyle}
                onClick={() => {
                  setIsMenuOpen(false);
                  goProtected("/kategori");
                }}
              >
                Kategori
              </div>

              <div
                style={dropdownItemStyle}
                onClick={() => {
                  setIsMenuOpen(false);
                  goProtected("/wilayah");
                }}
              >
                Kota / Kabupaten
              </div>

              <div
                style={dropdownItemStyle}
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate("/about");
                }}
              >
                About
              </div>

              <hr />

              {isLogin ? (
                <>
                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/favorit");
                    }}
                  >
                    Favorit
                  </div>

                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profil");
                    }}
                  >
                    Profil
                  </div>

                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/panduan");
                    }}
                  >
                    Panduan Pengguna
                  </div>

                  <div
                    style={{
                      ...dropdownItemStyle,
                      color: "#d93025",
                    }}
                    onClick={handleLogout}
                  >
                    Keluar
                  </div>
                </>
              ) : (
                <div
                  style={dropdownItemStyle}
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                >
                  Masuk atau Mendaftar
                </div>
              )}
            </div>
          ) : (
            <div
              style={{
                position: "absolute",
                top: "50px",
                right: 0,
                backgroundColor: "#fff",
                borderRadius: "12px",
                boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                padding: isLogin ? "10px 0" : "0",
                minWidth: "220px",
                overflow: "hidden",
              }}
            >
              {!isLogin ? (
                <div
                  onClick={() => {
                    setIsMenuOpen(false);
                    navigate("/login");
                  }}
                  style={{
                    padding: "15px 25px",
                    cursor: "pointer",
                    fontWeight: "700",
                    color: "#000",          // <-- tambahkan ini
                    backgroundColor: "#fff",
                    textAlign: "center",
                  }}
                >
                  Masuk atau mendaftar
                </div>
              ) : (
                <>
                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/favorit");
                    }}
                  >
                    Favorit
                  </div>

                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/profil");
                    }}
                  >
                    Profil
                  </div>

                  <div
                    style={dropdownItemStyle}
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/panduan");
                    }}
                  >
                    Panduan Pengguna
                  </div>

                  <hr />

                  <div
                    style={{
                      ...dropdownItemStyle,
                      color: "#d93025",
                    }}
                    onClick={handleLogout}
                  >
                    Keluar
                  </div>
                </>
              )}
            </div>
          )
        )}

      </div>
    </nav>
  );
};

export default Navbar;