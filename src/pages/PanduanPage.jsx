import React, { useState, useEffect } from "react";

const PanduanPage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const panduanList = [

    {
      icon: "🔍",
      title: "Mencari Destinasi",
      desc:
        "Gunakan fitur pencarian untuk menemukan destinasi wisata berdasarkan nama, kategori, atau kabupaten/kota."
    },

    {
      icon: "📍",
      title: "Melihat Detail Wisata",
      desc:
        "Klik card destinasi untuk melihat informasi lengkap, galeri foto, lokasi Google Maps, dan deskripsi wisata."
    },

    {
      icon: "⭐",
      title: "Memberikan Rating & Ulasan",
      desc:
        "Pengguna yang sudah login dapat memberikan rating dan ulasan pada halaman detail destinasi wisata."
    },

    {
      icon: "❤️",
      title: "Menambahkan Favorit",
      desc:
        "Klik ikon hati pada destinasi untuk menyimpan wisata favorit ke halaman favorit pengguna."
    },

    {
      icon: "👤",
      title: "Mengedit Profil",
      desc:
        "Masuk ke halaman profil lalu klik tombol edit untuk mengubah nama, alamat, dan tanggal lahir."
    }

  ];

  return (

    <div
      style={{
        minHeight: "100vh",
        paddingTop: "70px",
        background:
          "linear-gradient(180deg, #f6f6f6 0%, #ffffff 100%)",
        overflow: "hidden"
      }}
    >

      {/* HERO */}
      <div
        style={{
          position: "relative",
          height: isMobile ? "220px" : "270px",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/tanjung bira.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: isMobile ? "0 15px" : "0 20px"
        }}
      >

        <button
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: isMobile ? "15px" : "20px",
            left: isMobile ? "15px" : "20px",
            width: isMobile ? "38px" : "42px",
            height: isMobile ? "38px" : "42px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            transition: "0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
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
        
        <div>

          <div
            style={{
              display: "inline-block",
              padding: isMobile ? "6px 14px" : "8px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontSize: isMobile ? "11px" : "13px",
              fontWeight: "600",
              marginBottom: "20px",
              border: "1px solid rgba(255,255,255,0.2)"
            }}
          >
            SULSELGO USER GUIDE
          </div>

          <h1
            style={{
              color: "#fff",
              fontSize: isMobile ? "30px" : "48px",
              fontWeight: "700",
              margin: 0,
              lineHeight: 1.2
            }}
          >
            Panduan Pengguna
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? "14px" : "17px",
              marginTop: isMobile ? "12px" : "18px",
              lineHeight: 1.6,
              maxWidth: "700px",
            }}
          >
            Pelajari cara menggunakan fitur-fitur website
            wisata SULSELGO dengan mudah dan nyaman.
          </p>

        </div>
      </div>

      {/* CONTENT */}
      <div
        style={{
          width: isMobile
            ? "calc(100% - 20px)"
            : "min(1200px, calc(100% - 40px))",

          margin: isMobile
            ? "-35px auto 0 auto"
            : "-70px auto 0 auto",

          paddingBottom: isMobile ? "40px" : "70px",
          position: "relative",
          zIndex: 2,
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(280px, 1fr))",

            gap: isMobile ? "18px" : "28px",
          }}
        >

          {panduanList.map((item, index) => (

            <div
              key={index}

              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(14px)",

                borderRadius: isMobile ? "20px" : "28px",
                padding: isMobile ? "22px 18px" : "34px 28px",

                boxShadow:
                  "0 15px 35px rgba(0,0,0,0.08)",

                border:
                  "1px solid rgba(255,255,255,0.5)",

                transition: "0.3s",

                cursor: "pointer"
              }}

              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-8px)";
              }}

              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0px)";
              }}
            >

              <div
                style={{
                  width: isMobile ? "60px" : "75px",
                  height: isMobile ? "60px" : "75px",
                  fontSize: isMobile ? "28px" : "36px",
                  borderRadius: isMobile ? "18px" : "24px",
                  marginBottom: isMobile ? "18px" : "24px",

                  background:
                    "linear-gradient(135deg, #8b0000, #b11212)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow:
                    "0 10px 25px rgba(139,0,0,0.25)"
                }}
              >
                {item.icon}
              </div>

              <h2
                style={{
                  fontSize: isMobile ? "20px" : "24px",
                  color: "#181818",
                  marginBottom: isMobile ? "10px" : "14px",
                  fontWeight: "700"
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  color: "#666",
                  fontSize: isMobile ? "14px" : "15px",
                  lineHeight: isMobile ? "1.7" : "1.9",
                  margin: 0
                }}
              >
                {item.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default PanduanPage;