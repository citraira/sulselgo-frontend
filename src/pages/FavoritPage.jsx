import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const FavoritPage = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan data dari database
  const [favoritDestinasi, setFavoritDestinasi] = useState([]);
  
  // Mengambil data user yang sedang login dari localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Proteksi: Jika user belum login, arahkan ke halaman login
    if (!user) {
      navigate('/login');
      return;
    }

    // Mengambil data favorit dari API backend
    API.get(`/favorit/${user.id}`)
      .then((res) => {
        const data = res.data;

        // 🛠️ PERBAIKAN 1: Filter data untuk membuang item destinasi yang bernilai null atau undefined
        const listData = data
          .map((fav) => fav.destinasiId)
          .filter((item) => item !== null && item !== undefined);

        setFavoritDestinasi(listData);
      })
      .catch((err) => console.error("Gagal memuat data favorit:", err));
  }, [navigate, user?.id]);

  const cardStyle = {
    width: '300px',
    height: '350px',
    borderRadius: '25px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    border: '5px solid #fff',
    backgroundColor: '#fff'
  };

  return (
    <div style={{ 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      paddingTop: '100px', 
      paddingLeft: '6%', 
      paddingRight: '6%' 
    }}>
      
      {/* BACK BUTTON BARU */}
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

      {/* GRID DAFTAR FAVORIT */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "flex-start"
        }}
      >
        {favoritDestinasi.length > 0 ? (
          favoritDestinasi.map((item) => (
            <div 
              key={item?._id} // 🛠️ PERBAIKAN 2: Optional chaining untuk mencegah pembacaan properti dari data null
              style={cardStyle}
              onClick={() => navigate('/detail', { state: item })} // Navigasi ke detail wisata
            >
              {/* GAMBAR */}
              <img src={item?.gambar} alt={item?.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
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
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
                color: '#fff', 
                textAlign: 'left',
                padding: '20px',
                pointerEvents: 'none'
              }}>
                <div style={{ fontWeight: '800', fontSize: '20px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  {item?.nama}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>
                  {item?.kabupaten}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#666' }}>Belum ada destinasi favorit yang ditambahkan.</p>
        )}
      </div>

    </div>
  );
};

export default FavoritPage;