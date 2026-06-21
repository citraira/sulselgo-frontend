import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import API from "../api/axios";

const wilayahList = [
  "Makassar",
  "Parepare",
  "Palopo",
  "Bantaeng",
  "Barru",
  "Bone",
  "Bulukumba",
  "Enrekang",
  "Gowa",
  "Jeneponto",
  "Kepulauan Selayar",
  "Luwu",
  "Luwu Timur",
  "Luwu Utara",
  "Maros",
  "Pangkep",
  "Pinrang",
  "Sidrap",
  "Sinjai",
  "Soppeng",
  "Takalar",
  "Tana Toraja",
  "Toraja Utara",
  "Wajo"
].sort((a, b) => a.localeCompare(b));

const KabPage = () => {
  const { kabupaten } = useParams();

  const [selectedKab, setSelectedKab] = useState(
    decodeURIComponent(kabupaten || "Bantaeng")
  );

  // Inisialisasi daftar destinasi langsung dari cache jika ada
  const [destinasiList, setDestinasiList] = useState(() => {
    const savedList = sessionStorage.getItem(`kab_destinasi_${selectedKab}`);
    return savedList ? JSON.parse(savedList) : [];
  });
  
  // PERBAIKAN SIDEBAR: Membaca status terakhir sidebar dari session cache (default true jika belum ada)
  const [showSidebar, setShowSidebar] = useState(() => {
    const savedSidebar = sessionStorage.getItem("kab_sidebar_show_status");
    return savedSidebar ? savedSidebar === "opened" : true;
  });

  const navigate = useNavigate();

  // Mengontrol pemulihan posisi scroll konten, sidebar, dan mematikan animasi luncuran
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const savedMainScroll = sessionStorage.getItem("kab_main_scroll_pos");
    const savedSidebarScroll = sessionStorage.getItem("kab_sidebar_scroll_pos");
    
    // Matikan efek smooth global browser secara instan
    document.documentElement.style.scrollBehavior = "auto";

    // Kembalikan posisi scroll area konten utama
    const mainContentArea = document.getElementById("main-content-area");
    if (mainContentArea && savedMainScroll) {
      mainContentArea.scrollTop = parseInt(savedMainScroll, 10);
      sessionStorage.removeItem("kab_main_scroll_pos");
    }

    // Kembalikan posisi scroll kontainer tombol di sidebar
    const sidebarScrollArea = document.getElementById("sidebar-scroll-area");
    if (sidebarScrollArea && savedSidebarScroll) {
      sidebarScrollArea.scrollTop = parseInt(savedSidebarScroll, 10);
      sessionStorage.removeItem("kab_sidebar_scroll_pos");
    }

    // Hidupkan kembali setelan bawaan CSS setelah koordinat melompat
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "";
    }, 50);
  }, [destinasiList, selectedKab]);

  useEffect(() => {
    API.get(`/destinasi/wilayah/${selectedKab}`)
      .then((res) => {
        const data = res.data;
        setDestinasiList(data);
        sessionStorage.setItem(`kab_destinasi_${selectedKab}`, JSON.stringify(data));
      })
      .catch((err) =>
        console.error("Gagal mengambil destinasi:", err)
      );
  }, [selectedKab]);

  // Tangkap data koordinat scroll sebelum melompat ke detail page
  const handleDetail = (item) => {
    const mainContentArea = document.getElementById("main-content-area");
    const sidebarScrollArea = document.getElementById("sidebar-scroll-area");

    if (mainContentArea) {
      sessionStorage.setItem("kab_main_scroll_pos", mainContentArea.scrollTop);
    }
    if (sidebarScrollArea) {
      sessionStorage.setItem("kab_sidebar_scroll_pos", sidebarScrollArea.scrollTop);
    }
    
    // Simpan status terkini dari sidebar sebelum pindah halaman
    sessionStorage.setItem("kab_sidebar_show_status", showSidebar ? "opened" : "closed");

    navigate("/detail", {
      state: item
    });
  };

  // Fungsi toggle sidebar dengan penyimpanan status ter-update
  const toggleSidebar = () => {
    const nextStatus = !showSidebar;
    setShowSidebar(nextStatus);
    sessionStorage.setItem("kab_sidebar_show_status", nextStatus ? "opened" : "closed");
  };

  return (
    <div style={{ 
      display: "flex", 
      height: "100vh", 
      width: "100%", 
      overflow: "hidden", 
      paddingTop: "70px",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif"
    }}>

      {/* GLOBAL KEYFRAME ANIMASI SKELETON */}
      <style>{`
        @keyframes pulse {
          0% { background-color: #e0e0e0; }
          50% { background-color: #edf0f2; }
          100% { background-color: #e0e0e0; }
        }
        .skeleton-box {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* BUTTON TOGGLE SIDEBAR */}
      <div
        onClick={toggleSidebar}
        style={{
          position: "fixed",
          top: "50%",
          left: showSidebar ? "285px" : "0px",
          transform: "translateY(-50%)",
          zIndex: 999,
          width: "28px",
          height: "90px",
          background: "#800000",
          color: "#fff",
          borderTopRightRadius: "14px",
          borderBottomRightRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.4s",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
        }}
      >
        <span style={{ fontSize: "18px", fontWeight: "bold" }}>
          {showSidebar ? "‹" : "›"}
        </span>
      </div>

      {/* SIDEBAR */}
      <div
        style={{
          width: showSidebar ? "300px" : "0px",
          overflow: "hidden",
          transition: "0.4s",
          backgroundColor: "#800000",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flexShrink: 0,
        }}
      >
        {/* Judul Sidebar - Statis */}
        <div style={{ padding: "25px 20px 15px 20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", lineHeight: "1.4" }}>
            Kota/Kabupaten di Sulawesi Selatan
          </h3>
        </div>

        {/* Daftar Tombol - Scrollable */}
        <div
          id="sidebar-scroll-area"
          style={{
            flex: 1,
            overflowY: "scroll",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: "0 20px 20px 20px",
          }}
        >
          {wilayahList.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                setSelectedKab(item);
                navigate(`/kabpage/${item}`);
              }}
              style={{
                width: "100%",
                padding: "12px 15px",
                marginBottom: "10px",
                borderRadius: "20px",
                border: "1px solid #fff",
                background: selectedKab === item ? "#fff" : "transparent",
                color: selectedKab === item ? "#800000" : "#fff",
                cursor: "pointer",
                textAlign: "left",
                fontWeight: "600",
                transition: "0.3s"
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* AREA KONTEN UTAMA */}
      <div 
        id="main-content-area"
        style={{ 
          flex: 1, 
          padding: "40px", 
          background: "#f5f5f5", 
          overflowY: "auto", 
          height: "100%" 
        }}
      >
        <h2 style={{ marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}>
          {selectedKab}
        </h2>

        {destinasiList.length === 0 ? (
          <p>Belum ada data destinasi untuk wilayah ini.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "25px",
              transition: "0.4s"
            }}
          >
            {destinasiList.map((item, index) => (
              // 🚀 MODIFIKASI: Memanggil sub-komponen terisolasi state agar skeleton loader bekerja per item gambar
              <KabCardKeyed
                key={item._id || index}
                item={item}
                handleDetail={handleDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ================= SUB-KOMPONEN HELPER UNTUK SKELETON LOADER DI KABUPATEN PAGE =================
const KabCardKeyed = ({ item, handleDetail }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      onClick={() => handleDetail(item)}
      style={{
        width: "100%",
        maxWidth: "320px",
        aspectRatio: "4 / 5",
        borderRadius: "25px",
        overflow: "hidden",
        position: "relative",
        cursor: "pointer",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        transition: "transform 0.2s ease",
        margin: "0 auto",
        backgroundColor: "#e0e0e0" // Penahan latar belakang dasar saat download aset gambar
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
      onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      {/* KOTAK ANIMASI SKELETON BERDENYUT */}
      {!isLoaded && (
        <div 
          className="skeleton-box" 
          style={{ 
            width: '100%', 
            height: '100%', 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            zIndex: 2 
          }} 
        />
      )}

      {/* IMAGE DARI HOSTINGER DENGAN TRANSFORMASI CADANGAN */}
      <img
        src={item.gambar ? item.gambar.replace("/upload/", "/upload/f_auto,q_auto,w_1000/") : ""}
        alt={item.nama}
        onLoad={() => setIsLoaded(true)} // Ubah state loading setelah tuntas memuat file
        style={{ 
          width: "100%", 
          height: "100%", 
          objectFit: "cover",
          opacity: isLoaded ? 1 : 0, // Gambar disembunyikan total sebelum beres diunduh
          transition: "opacity 0.4s ease-in-out" // Efek visual memudar halus (fade-in)
        }}
      />

      {/* GRADIENT OVERLAY LAYER */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          zIndex: 3
        }}
      />

      {/* KONTEN OVERLAY TEKS */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          padding: "20px",
          color: "#fff",
          boxSizing: "border-box",
          zIndex: 4
        }}
      >
        {/* Badge Kategori Transparan */}
        <div
          style={{
            background: "rgba(128, 0, 0, 0.8)", 
            display: "inline-block",
            padding: "6px 14px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            marginBottom: "10px"
          }}
        >
          {item.kategori}
        </div>

        <h3 style={{ marginBottom: "8px", fontSize: "22px", fontWeight: "bold" }}>
          {item.nama}
        </h3>

        <p style={{ 
          fontSize: "13px", 
          lineHeight: "1.4", 
          margin: 0,
          opacity: 0.9,
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical",
          overflow: "hidden"
        }}>
          {item.deskripsiSingkat}
        </p>
      </div>
    </div>
  );
};

export default KabPage;