import React from "react";

const PanduanPage = () => {

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
          height: "270px",
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url('/tanjung bira.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "0 20px"
        }}
      >

        <button
          onClick={() => window.history.back()}
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            width: "42px",
            height: "42px",
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
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              color: "#fff",
              fontSize: "13px",
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
              fontSize: "48px",
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
              marginTop: "18px",
              fontSize: "17px",
              maxWidth: "700px",
              lineHeight: 1.7
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
          width: "min(1200px, calc(100% - 40px))",
          margin: "-70px auto 0 auto",
          position: "relative",
          zIndex: 2,
          paddingBottom: "70px"
        }}
      >

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "28px"
          }}
        >

          {panduanList.map((item, index) => (

            <div
              key={index}

              style={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(14px)",

                borderRadius: "28px",

                padding: "34px 28px",

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
                  width: "75px",
                  height: "75px",

                  borderRadius: "24px",

                  background:
                    "linear-gradient(135deg, #8b0000, #b11212)",

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",

                  fontSize: "36px",

                  marginBottom: "24px",

                  boxShadow:
                    "0 10px 25px rgba(139,0,0,0.25)"
                }}
              >
                {item.icon}
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  color: "#181818",
                  marginBottom: "14px",
                  fontWeight: "700"
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  color: "#666",
                  lineHeight: "1.9",
                  fontSize: "15px",
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