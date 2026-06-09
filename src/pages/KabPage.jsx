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

  const [destinasiList, setDestinasiList] = useState([]);
  const [showSidebar, setShowSidebar] = useState(true);

  const navigate = useNavigate();

useEffect(() => {

  API.get(`/destinasi/wilayah/${selectedKab}`)
    .then((res) => {

      const data = res.data;

      setDestinasiList(data);

    })
    .catch((err) =>
      console.error(
        "Gagal mengambil destinasi:",
        err
      )
    );

}, [selectedKab]);

const handleDetail = (item) => {
  navigate("/detail", {
    state: item
  });
};

const toggleSidebar = () => {
  setShowSidebar(!showSidebar);
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

    <div
      onClick={() => setShowSidebar(!showSidebar)}
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
      <span style={{
        fontSize: "18px",
        fontWeight: "bold"
      }}>
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
          flexDirection: "column", // Membagi judul dan list secara vertikal
          height: "100%",
          flexShrink: 0,
        }}
      >
        {/* Judul Sidebar - Statis (Tidak ikut scroll) */}
        <div style={{ padding: "25px 20px 15px 20px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", lineHeight: "1.4" }}>
            Kota/Kabupaten di Sulawesi Selatan
          </h3>
        </div>

        {/* Daftar Tombol - Scrollable */}
        <div
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
      <div style={{ 
        flex: 1, 
        padding: "40px", 
        background: "#f5f5f5", 
        overflowY: "auto", 
        height: "100%" 
      }}>
        <h2 style={{ marginBottom: "30px", fontSize: "32px", fontWeight: "bold" }}>
          {selectedKab}
        </h2>

        {destinasiList.length === 0 ? (
          <p>Belum ada data destinasi untuk wilayah ini.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "25px",
              transition: "0.4s"
            }}
          >
              {destinasiList.map((item, index) => (
                <div
                  key={item._id || index}
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
                    margin: "0 auto"
                  }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <img
                  src={item.gambar.replace(
                    "/upload/",
                    "/upload/f_auto,q_auto,w_1000/"
                  )}
                  alt={item.nama}
                  loading="lazy"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)"
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    padding: "20px",
                    color: "#fff",
                    boxSizing: "border-box"
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KabPage;