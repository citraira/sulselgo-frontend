import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      paddingTop: isMobile ? '80px' : '100px',
      paddingBottom: isMobile ? '40px' : '60px',
      paddingLeft: isMobile ? '20px' : '8%',
      paddingRight: isMobile ? '20px' : '8%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* BACK BUTTON BARU */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: isMobile ? '85px' : '100px',
          left: isMobile ? '20px' : '8%',
          width: isMobile ? '38px' : '42px',
          height: isMobile ? '38px' : '42px',
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(255,255,255,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 20,
          transition: '0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#111"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
      </button>

      {/* LOGO UTAMA DI TENGAH */}
      <div style={{ marginBottom: isMobile ? '30px' : '50px', textAlign: 'center' }}> 
        <img 
          src="https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781033400/sulselgo/logo_sulselgoo.png" 
          alt="Sulsel Go Logo" 
          style={{ width: isMobile ? '240px' : '320px', height: 'auto', display: 'block' }} 
        />
      </div>

      {/* KOTAK DESKRIPSI (ABOUT CONTENT) */}
      <div style={{
        backgroundColor: '#fbfbfb', // Abu-abu sangat tipis sesuai gambar
        padding: isMobile ? '30px 20px' : '45px 40px',
        borderRadius: isMobile ? '10px' : '15px',
        maxWidth: '900px',
        width: '100%',
        border: '1px solid #eeeeee',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          fontSize: isMobile ? '14px' : '16px',
          lineHeight: isMobile ? '1.8' : '2',
          textIndent: isMobile ? '20px' : '30px',
          color: '#4a4a4a',
          textAlign: 'justify',
          margin: 0,
          fontWeight: '500'
        }}>
                  <strong style={{ color: '#000' }}>Sulsel Go</strong> adalah website sistem rekomendasi wisata berbasis web yang menyediakan informasi lengkap mengenai berbagai destinasi wisata di Sulawesi Selatan. Website ini dirancang untuk membantu masyarakat dan wisatawan dalam menemukan tempat wisata dengan lebih mudah melalui informasi yang terpusat, jelas, dan mudah diakses.
          <br /><br />
          Melalui <strong style={{ color: '#000' }}>Sulsel Go</strong>, pengguna dapat melihat berbagai daftar tempat wisata yang dilengkapi dengan deskripsi, foto, dan lokasi. Selain itu, website ini juga menyediakan fitur pencarian dan filter kategori wisata, sehingga pengguna dapat menemukan destinasi sesuai dengan minat mereka. Pengguna yang telah melakukan login juga dapat memberikan rating dan ulasan terhadap tempat wisata, sehingga dapat membantu pengguna lain dalam menentukan pilihan destinasi.
          <br /><br />
          Dengan tampilan yang sederhana dan informatif, <strong style={{ color: '#000' }}>Sulsel Go</strong> diharapkan dapat menjadi solusi bagi keterbatasan informasi wisata yang terpusat serta menjadi panduan terpercaya dalam merencanakan perjalanan di Sulawesi Selatan.
        </p>
      </div>

    </div>
  );
};

export default AboutPage;