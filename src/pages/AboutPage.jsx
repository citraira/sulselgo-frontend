import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      paddingTop: '100px', // Agar tidak tertutup Navbar
      paddingBottom: '60px',
      paddingLeft: '8%', 
      paddingRight: '8%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* BACK BUTTON BARU */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '100px',
          left: '8%',
          width: '42px',
          height: '42px',
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
      <div style={{ marginBottom: '50px', textAlign: 'center' }}> 
        <img 
          src="https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781033400/sulselgo/logo_sulselgoo.png" 
          alt="Sulsel Go Logo" 
          style={{ width: '320px', height: 'auto', display: 'block' }} 
        />
      </div>

      {/* KOTAK DESKRIPSI (ABOUT CONTENT) */}
      <div style={{
        backgroundColor: '#fbfbfb', // Abu-abu sangat tipis sesuai gambar
        padding: '45px 40px',
        borderRadius: '15px',
        maxWidth: '900px',
        width: '100%',
        border: '1px solid #eeeeee',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
        boxSizing: 'border-box'
      }}>
        <p style={{ 
          fontSize: '16px',
          lineHeight: '2',
          color: '#4a4a4a',
          textAlign: 'justify',
          textIndent: '30px',
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