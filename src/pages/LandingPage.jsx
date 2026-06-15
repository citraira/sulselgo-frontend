import React, { useState, useEffect, useCallback } from 'react';
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Inisialisasi slides langsung dari sessionStorage jika ada
  const [slides, setSlides] = useState(() => {
    const savedSlides = sessionStorage.getItem("landing_preserved_slides");
    return savedSlides ? JSON.parse(savedSlides) : [];
  });
  
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navigate = useNavigate();

  // AUTO SLIDER
  const changeSlider = useCallback((direction) => {

    if (slides.length === 0) return;

    setCurrentIndex((prev) => {

      let next = prev + direction;

      if (next < 0) return slides.length - 1;

      if (next >= slides.length) return 0;

      return next;

    });

  }, [slides.length]);

  // TIMER SLIDER
  useEffect(() => {

    if (slides.length === 0) return;

    const timer = setInterval(() => {

      changeSlider(1);

    }, 5000);

    return () => clearInterval(timer);

  }, [changeSlider, slides.length]);

  // AMBIL DATA API + KONTROL SCROLL MANUAL TANPA ANIMASI GLOBAL CSS
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedScrollY = sessionStorage.getItem("landing_scroll_pos");
    
    if (slides.length > 0 && savedScrollY) {
      // PERBAIKAN UTAMA: Paksa matikan animasi smooth global CSS browser sebelum scroll melompat
      document.documentElement.style.scrollBehavior = "auto";
      
      window.scrollTo(0, parseInt(savedScrollY, 10));
      sessionStorage.removeItem("landing_scroll_pos");
      
      // Kembalikan ke setelan semula setelah melompat agar halaman lain tidak terganggu
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = "";
      }, 50);
    }

    API.get("/top-destinasi")
      .then((res) => {
        console.log("DATA API:", res.data);
        setSlides(res.data);
        
        sessionStorage.setItem("landing_preserved_slides", JSON.stringify(res.data));

        if (savedScrollY) {
          // Paksa matikan animasi smooth global CSS lagi di sini untuk memastikan keamanan
          document.documentElement.style.scrollBehavior = "auto";
          
          window.scrollTo(0, parseInt(savedScrollY, 10));
          sessionStorage.removeItem("landing_scroll_pos");
          
          setTimeout(() => {
            document.documentElement.style.scrollBehavior = "";
          }, 50);
        }
      })
      .catch((err) => {
        console.log("Gagal mengambil top destinasi:", err);
      });

  }, []);

  // FUNGSI NAVIGASI DENGAN MENYIMPAN KOORDINAT SCROLL
  const handleCardClick = (item) => {
    sessionStorage.setItem("landing_scroll_pos", window.scrollY);
    navigate("/detail", { state: item });
  };

  return (
    <div
      style={{
        width: '100%',
        margin: 0,
        padding: 0
      }}
    >

      <style>{`
        .slider-arrow {
          cursor: pointer;
          font-size: 20px;
          font-weight: 800;
          user-select: none;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justifyContent: center;
          width: 30px;
          height: 30px;
        }

        .slider-arrow:hover {
          transform: scale(1.2);
        }
      `}</style>

      {/* HERO SECTION */}
      <div
        style={{
          height: isMobile ? '60vh' : '85vh',
          width: '100%',
          margin: 0,

          backgroundImage:
            slides.length > 0
              ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.1)), url("${slides[currentIndex]?.gambar}")`
              : "none",

          backgroundSize: 'cover',
          backgroundPosition: 'center',

          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',

          paddingBottom: isMobile ? '20px' : '50px',

          transition: 'background-image 0.8s ease-in-out'
        }}
      >

        {/* SLIDER INDICATOR */}
        <div
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',

            padding: isMobile ? '10px 15px' : '12px 25px',

            borderRadius: '35px',

            backdropFilter: 'blur(10px)',

            border: '1px solid rgba(255,255,255,0.2)',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            minWidth: isMobile ? '90%' : '350px',
            maxWidth: isMobile ? '90%' : '500px',

            boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
          }}
        >
          <div
            className="slider-arrow"
            onClick={() => changeSlider(-1)}
          >
            ❮
          </div>

          <div
            style={{
              flex: 1,
              textAlign: 'center',
              padding: '0 15px'
            }}
          >
            <span
              style={{
                fontWeight: '600',
                fontSize: '15px',
                letterSpacing: '0.5px'
              }}
            >
              {slides[currentIndex]?.nama}
            </span>
          </div>

          <div
            className="slider-arrow"
            onClick={() => changeSlider(1)}
          >
            ❯
          </div>
        </div>
      </div>

      {/* TAGLINE */}
      <div
        style={{
          textAlign: 'center',
          padding: isMobile ? '50px 20px' : '100px 10%',
          backgroundColor: '#fff'
        }}
      >
        <h1
          style={{
            fontSize: isMobile ? '22px' : '30px',
            color: '#1a1a1a',
            fontWeight: '600',
            margin: 0,
            lineHeight: '1.4'
          }}
        >
          Menelusuri Jejak Budaya dan Keajaiban Alam yang Tak Terlupakan.
        </h1>
      </div>

      {/* DESTINASI TAK TERLUPAKAN */}
      <div
        style={{
          backgroundColor: '#800000',
          color: '#fff',
          padding: '90px 6%',
          textAlign: 'center'
        }}
      >
        <h2
          style={{
            fontSize: '34px',
            marginBottom: '15px',
            fontWeight: '700'
          }}
        >
          Destinasi Tak Terlupakan di Sulawesi Selatan
        </h2>

        <p
          style={{
            opacity: 0.8,
            maxWidth: '750px',
            margin: '0 auto 60px'
          }}
        >
          Nikmati harmoni alam, budaya, dan kuliner legendaris.
        </p>
        

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',

            gap: '30px'
          }}
        >

      {Array.isArray(slides) &&
        slides.slice(0, 4).map((item, i) => (
          <div
            key={i}
            onClick={() => handleCardClick(item)}
            style={{
              height: isMobile ? '320px' : '450px',

              borderRadius: '25px',

              overflow: 'hidden',

              position: 'relative',

              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',

              cursor: 'pointer'
            }}
          >

            <img
              src={item.gambar}
              alt={item.nama}

              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: 0,

                width: '100%',

                padding: '30px',

                background:
                  'linear-gradient(transparent, rgba(0,0,0,0.95))',

                textAlign: 'left'
              }}
            >

              <h3
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: '600'
                }}
              >
                {item.nama}
              </h3>

              <p
                style={{
                  fontSize: '14px',
                  margin: '8px 0 0',
                  opacity: 0.85
                }}
              >
                📍 {item.kabupaten}
              </p>

              <p
                style={{
                  fontSize: '14px',
                  marginTop: '10px',
                  color: '#ffd700',
                  fontWeight: '600'
                }}
              >
                ⭐ {item.avgRating?.toFixed(1) || "0"} •{" "}
                {item.totalReview || 0} ulasan
              </p>

            </div>
          </div>

        ))}

        </div>
      </div>
    </div>
  );
};

export default LandingPage;