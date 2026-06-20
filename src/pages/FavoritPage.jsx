import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const FavoritPage = () => {
  const navigate = useNavigate();
  
  // 1. Inisialisasi langsung dari sessionStorage agar element tidak kosong saat tombol back ditekan
  const [favoritDestinasi, setFavoritDestinasi] = useState(() => {
    const savedFavorites = sessionStorage.getItem("favorit_preserved_list");
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });
  
  const user = JSON.parse(localStorage.getItem('user'));

  // ================= KONTROL SCROLL INSTAN =================
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollY = sessionStorage.getItem("favorit_scroll_pos");
    if (favoritDestinasi.length > 0 && savedScrollY) {
      // Paksa matikan animasi smooth global CSS browser sebelum scroll melompat
      document.documentElement.style.scrollBehavior = "auto";
      
      window.scrollTo(0, parseInt(savedScrollY, 10));
      sessionStorage.removeItem("favorit_scroll_pos");
      
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 50);
    }
  }, [favoritDestinasi]);

  // ================= DATA FAVORIT API =================
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    API.get(`/favorit/${user.id}`)
      .then((res) => {
        const data = res.data;

        const listData = data
          .map((fav) => fav.destinasiId)
          .filter((item) => item !== null && item !== undefined);

        setFavoritDestinasi(listData);
        
        // Simpan data terbaru ke cache session untuk keperluan tombol back berikutnya
        sessionStorage.setItem("favorit_preserved_list", JSON.stringify(listData));
      })
      .catch((err) => console.error("Gagal memuat data favorit:", err));
  }, [navigate, user?.id]);

  // ================= NAVIGASI DENGAN REKAM SCROLL =================
  const handleCardClick = (item) => {
    sessionStorage.setItem("favorit_scroll_pos", window.scrollY);
    navigate('/detail', { state: item });
  };

  // PERBAIKAN: Lebar diubah ke 100% agar mengikuti ukuran kolom grid secara dinamis
  const cardStyle = {
    width: '100%',
    height: '360px', // Sedikit dinaikkan agar proporsi tinggi kartu proporsional
    borderRadius: '24px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    border: '5px solid #fff',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      paddingTop: '120px', // Sedikit ditambah ruang atas agar tidak menumpuk dengan tombol back
      paddingLeft: '6%', 
      paddingRight: '6%',
      paddingBottom: '40px', // Padding bawah agar baris terakhir tidak mentok batas layar
      boxSizing: 'border-box'
    }}>
      
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        style={{
          position: 'absolute',
          top: '95px',
          left: '6%',
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

      {/* JUDUL */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '800',
          margin: 0
        }}>
          Favorit
        </h1>
      </div>

      {/* GRID DAFTAR FAVORIT - PERBAIKAN TOTAL MENGGUNAKAN CSS GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: window.innerWidth <= 768 ? "1fr 1fr" : "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px", // Jarak konstan antar kartu horizontal & vertikal
          justifyContent: "start",
          width: "100%"
        }}
      >
        {favoritDestinasi.length > 0 ? (
          favoritDestinasi.map((item, index) => (
            <div 
              key={item?._id || index}
              style={cardStyle}
              onClick={() => handleCardClick(item)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              {/* GAMBAR */}
              <img 
                src={item?.gambar} 
                alt={item?.nama} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              
              {/* ICON LOVE (DIPILIH) */}
              <div style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                backgroundColor: 'rgba(255,255,255,0.9)',
                width: '35px',
                height: '35px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#d93025" stroke="#d93025" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>

              {/* OVERLAY TEKS */}
              <div style={{
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                color: '#fff', 
                textAlign: 'left',
                padding: '20px',
                pointerEvents: 'none'
              }}>
                <div style={{ fontWeight: '800', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.6)', marginBottom: '4px' }}>
                  {item?.nama}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>
                  {item?.kabupaten}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#666', gridColumn: '1 / -1' }}>Belum ada destinasi favorit yang ditambahkan.</p>
        )}
      </div>

    </div>
  );
};

export default FavoritPage;