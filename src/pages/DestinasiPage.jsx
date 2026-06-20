import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from "../api/axios";

const DestinasiPage = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  
  // Inisialisasi langsung dari sessionStorage agar elemen kartu langsung eksis tanpa kedipan loading saat ditekan back
  const [topDestinasi, setTopDestinasi] = useState(() => {
    const savedTop = sessionStorage.getItem("destinasi_preserved_top");
    return savedTop ? JSON.parse(savedTop) : [];
  });

  const gambarDefault = 'https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781027521/sulselgo/dpdmbu1yrbmiqyxmcpho.png';
  const user = JSON.parse(localStorage.getItem('user'));
  const isMobile = window.innerWidth <= 768;

  // ================= KONTROL SCROLL INSTAN =================
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollY = sessionStorage.getItem("destinasi_scroll_pos");
    const savedScrollX = sessionStorage.getItem("destinasi_horizontal_scroll_pos");

    if (topDestinasi.length > 0) {
      // Paksa matikan animasi smooth global CSS browser sebelum scroll melompat
      document.documentElement.style.scrollBehavior = "auto";
      
      // 1. Pulihkan posisi scroll halaman vertikal (Y)
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        sessionStorage.removeItem("destinasi_scroll_pos");
      }

      // 2. Pulihkan posisi scroll ke samping (X) pada container list destinasi teratas
      const horizontalContainer = document.getElementById("horizontal-destinasi-list");
      if (horizontalContainer && savedScrollX) {
        horizontalContainer.scrollLeft = parseInt(savedScrollX, 10);
        sessionStorage.removeItem("destinasi_horizontal_scroll_pos");
      }
      
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 50);
    }
  }, [topDestinasi]);

  // ================= FAVORIT =================
  useEffect(() => {
    if (user) {
      API.get(`/favorit/${user.id}`)
        .then((res) => {
          const data = res.data;
          const listId = data.map((fav) => fav.destinasiId?._id);
          setFavorites(listId);
        })
        .catch(err => console.error("Gagal sinkron favorit", err));
    }
  }, []);

  const toggleFavorite = async (e, destinasi) => {
    e.stopPropagation();

    if (!user) {
      alert("Silakan login terlebih dahulu!");
      return navigate('/login');
    }

    try {
      const response = await API.post('/favorit', {
        userId: user.id,
        destinasiId: destinasi._id
      });

      const data = response.data;

      if (favorites.includes(destinasi._id)) {
        setFavorites(favorites.filter(id => id !== destinasi._id));
      } else {
        setFavorites([...favorites, destinasi._id]);
      }

      alert(data.message);
    } catch (err) {
      console.error("Gagal memproses favorit", err);
    }
  };

  // ================= NAVIGASI DESTINASI DENGAN REKAM SCROLL VERTIKAL & HORIZONTAL =================
  const handleClickDestinasi = (item) => {
    sessionStorage.setItem("destinasi_scroll_pos", window.scrollY);
    
    // Rekam seberapa jauh list horizontal sudah digeser ke samping sebelum pindah halaman
    const horizontalContainer = document.getElementById("horizontal-destinasi-list");
    if (horizontalContainer) {
      sessionStorage.setItem("destinasi_horizontal_scroll_pos", horizontalContainer.scrollLeft);
    }

    navigate("/detail", {
      state: item
    });
  };

  // ================= DATA KOTA DENGAN REKAM SCROLL =================
  const kota = [
    { n: 'Makassar', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781028133/sulselgo/llxm4hcxql4rqa5rsw2k.png'},
    { n: 'Bulukumba', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781028111/sulselgo/qnvgsseqwavko6aqyt95.png'},
    { n: 'Tana Toraja', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781027265/sulselgo/wlznvpncdkixaiacltnq.png' },
    { n: 'Maros', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781028969/sulselgo/mbefuaxndbctltgfuppp.png' },
    { n: 'Gowa', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781026830/sulselgo/sz4tivwn5eej6b3nyp00.png' },
    { n: 'Barru', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781028795/sulselgo/ls0cbxja8vo1b9clvbg2.png' }
  ];

  const handleKotaClick = (cityName) => {
    sessionStorage.setItem("destinasi_scroll_pos", window.scrollY);
    navigate(`/kabpage/${cityName}`);
  };

  // ================= TOP DESTINASI =================
  useEffect(() => {
    API.get("/top-destinasi")
      .then((res) => {
        const data = res.data;
        setTopDestinasi(data);
        sessionStorage.setItem("destinasi_preserved_top", JSON.stringify(data));
      })
      .catch(err => console.error("Gagal ambil top destinasi", err));
  }, []);

  // ================= STYLE =================
  const baseCardStyle = {
    aspectRatio: '1 / 1',
    borderRadius: '15px',
    overflow: 'hidden',
    position: 'relative',
    border: '3px solid #fff',
    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
    flexShrink: 0,
    cursor: 'pointer',
    minHeight: isMobile ? '120px' : '170px'
  };
  const overlayStyle = {
    position: 'absolute', bottom: 0, left: 0, width: '100%',
    padding: '15px 12px',
    background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
    color: '#fff', fontWeight: '700', fontSize: '15px',
    textShadow: '0 1px 3px rgba(0,0,0,0.5)'
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>

      {/* HERO */}
      <div style={{
        height: isMobile ? '280px' : '380px',
        backgroundImage: `url('${gambarDefault}')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        position: 'relative'
      }}>

        {/* BACK BUTTON BARU */}
        <button
          onClick={() => navigate('/')}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
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

      </div>

      {/* TITLE */}
      <div
        style={{
          textAlign: 'center',
          padding: isMobile ? '35px 6% 30px' : '50px 8% 40px'
        }}
      >
        <p style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '2px' }}>
          PESONA SULAWESI SELATAN
        </p>
        <h1
          style={{
            fontSize: isMobile ? '18px' : '26px',
            fontWeight: '700',
            marginTop: '10px',
            lineHeight: '1.6'
          }}
        >
          Menelusuri Jejak Budaya dan Keajaiban Alam yang Tak Terlupakan.
        </h1>
      </div>

      {/* KOTA */}
      <div style={{
        backgroundColor: '#800000',
        margin: '0 auto',
        width: '95%',
        maxWidth: '1100px',
        padding: isMobile ? '15px' : '25px',
        borderRadius: '25px',
        border: '3px solid #fff'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '20px' }}>
          {kota.map((k, idx) => (
            <div 
              key={idx} 
              onClick={() => handleKotaClick(k.n)}
              style={baseCardStyle}
            >
              <img src={k.i} alt={k.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={overlayStyle}>{k.n}</div>
            </div>
          ))}
        </div>
      </div>

      {/* TOP DESTINASI */}
      <div style={{ padding: '60px 5% 100px' }}>
        <h2 style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: '800', marginBottom: '20px' }}>
          5 Destinasi Teratas
        </h2>

        <div 
          id="horizontal-destinasi-list" 
          style={{ display: 'flex', gap: '30px', overflowX: 'auto' }}
        >
          {topDestinasi.map((item, idx) => {
            const data = item.destinasi || item;

            // 🚀 HITUNG ULANG ULASAN BERSIH DI FRONTEND
            const rawReviews = item.reviews || data.reviews || [];
            
            const cleanReviews = rawReviews.filter(rev => {
              const username = (rev.userId?.username || rev.nama || "").toLowerCase();
              const isiUlasan = (rev.ulasan || "").toLowerCase();
              
              return !username.includes("usera") && 
                     !username.includes("reviewuser") && 
                     !username.includes("dislikeuser") && 
                     !username.includes("likeuser") &&
                     !isiUlasan.includes("test") &&
                     !isiUlasan.includes("update kedua");
            });

            const totalReviewClean = cleanReviews.length;
            
            const avgRatingClean = totalReviewClean > 0 
              ? (cleanReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / totalReviewClean).toFixed(1)
              : "0";

            return (
              <div
                key={idx}
                onClick={() => handleClickDestinasi(item)}
                style={{
                  width: isMobile ? '260px' : '350px',
                  minWidth: isMobile ? '260px' : '350px',
                  height: isMobile ? '260px' : '350px',
                  borderRadius: '25px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '5px solid #fff',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  cursor: 'pointer'
                }}
              >
                {/* LOVE */}
                <div
                  onClick={(e) => toggleFavorite(e, data)}
                  style={{
                    position: 'absolute', 
                    top: '15px', 
                    right: '15px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    width: '40px', 
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    cursor: 'pointer',
                    zIndex: 10,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    margin: '5px' 
                  }}
                >
                  <svg 
                    width="22" height="22" viewBox="0 0 24 24"
                    fill={favorites.includes(data._id) ? "#d93025" : "none"}
                    stroke={favorites.includes(data._id) ? "#d93025" : "#333"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </div>

                <img src={data.gambar || gambarDefault} alt={data.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

                {/* OVERLAY TEKS DENGAN JUMLAH ULASAN BERSIH */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  color: '#fff',
                  padding: '20px',
                  width: '100%',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.85))',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ fontSize: isMobile ? '18px' : '22px', fontWeight: '800' }}>
                    {data.nama}
                  </div>
                  <div style={{ opacity: 0.85, fontSize: '14px', marginTop: '2px' }}>
                    📍 {data.kabupaten}
                  </div>
                  
                  {/* TAMPILAN RESMI: Sinkron dengan ulasan asli saja */}
                  <div style={{
                    fontSize: '14px',
                    marginTop: '6px',
                    color: '#ffd700',
                    fontWeight: '600'
                  }}>
                    ⭐ {avgRatingClean} • {totalReviewClean} ulasan
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DestinasiPage;