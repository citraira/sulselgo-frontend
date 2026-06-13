import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

export default function SearchPage() {
  const navigate = useNavigate();
  const isMobile = window.innerWidth <= 768;

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [showFullResult, setShowFullResult] = useState(false);
  const [matchedKabupatenList, setMatchedKabupatenList] = useState([]);
  const [trendingSearch, setTrendingSearch] = useState(() => {

  const savedTrending = localStorage.getItem("trendingSearchSULSELGO");

  return savedTrending ? JSON.parse(savedTrending) : [];

});

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
  ];



  // ================= SEARCH =================
  const handleSearch = async () => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    try {
    const res = await API.get(
      `/destinasi/search?q=${keyword}`
    );

    const data = res.data;

    setResults(data);
    } catch (err) {
      console.error("Gagal search:", err);
    }
  };

  // ================= LIVE SEARCH =================
  useEffect(() => {
    const delay = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  // ================= ENTER =================
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      updateTrendingSearch(keyword);

      const searchText = keyword.toLowerCase().trim();

    const matchedKabupaten = wilayahList.filter(
      (item) => {
        const wilayah = item.toLowerCase();

        return (
          wilayah === searchText ||
          wilayah.startsWith(searchText)
        );
      }
    );

      // ================= JIKA LEBIH DARI 1 =================
      if (matchedKabupaten.length > 1) {

        setResults([]);
        setShowFullResult(false);

        setMatchedKabupatenList(matchedKabupaten);

        return;
      }

      // ================= JIKA HANYA 1 =================
      if (matchedKabupaten.length === 1) {

        navigate(`/kabpage/${matchedKabupaten[0]}`);

        return;
      }

      // ================= DESTINASI BIASA =================
      setMatchedKabupatenList([]);

      setShowFullResult(true);
    }
  };

  const updateTrendingSearch = (term) => {

    if (!term.trim()) return;

    setTrendingSearch((prev) => {

      // hapus duplicate
      const filtered = prev.filter(
        (item) =>
          item.toLowerCase() !== term.toLowerCase()
      );

      // masukkan terbaru di depan
      const updated = [term, ...filtered];

      // maksimal 5
      const finalTrending = updated.slice(0, 8);

      // simpan ke localStorage
      localStorage.setItem(
        "trendingSearchSULSELGO",
        JSON.stringify(finalTrending)
      );

      return finalTrending;
    });
  };

  const handleTrendingClick = async (term) => {
    setKeyword(term);
    setMatchedKabupatenList([]);
    setShowFullResult(false);

    const searchText = term.toLowerCase().trim();

    const matchedKabupaten = wilayahList.filter((item) =>
      item.toLowerCase().includes(searchText)
    );

    if (matchedKabupaten.length === 1) {
      navigate(`/kabpage/${matchedKabupaten[0]}`);
      return;
    }

    if (matchedKabupaten.length > 1) {
      setResults([]);
      setMatchedKabupatenList(matchedKabupaten);
      return;
    }

    try {
    const res = await API.get(
      `/destinasi/search?q=${encodeURIComponent(term)}`
    );

    const data = res.data;

    setResults(data);
      setShowFullResult(true);
    } catch (err) {
      console.error("Gagal search trending:", err);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        paddingBottom: "60px"
      }}
    >
     {/* BACK BUTTON */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '92px',
          left: '18px',
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
      
      <div
        style={{
          height: isMobile ? "280px" : "420px",
          width: "100%",
          background:
            "linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url('https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781029397/sulselgo/k5ptrmeg8u3mzniztyws.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderBottomLeftRadius: "40px",
          borderBottomRightRadius: "40px",
          position: "relative",
          overflow: "visible",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: isMobile ? "90px" : "80px",
        }}
      >
        <div
          style={{
            width: "88%",
            maxWidth: "1200px"
          }}
        >
        <h1
          style={{
            fontSize: isMobile ? "2px" : "72px",
            fontWeight: "700",
            lineHeight: "1.15",
            marginBottom: "16px",
            color: "#fff",
            marginLeft: isMobile ? "55px" : "0",
            maxWidth: isMobile ? "220px" : "700px",
          }}
        >
          Jelajahi Sulawesi Selatan
        </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.9)",
              fontSize: isMobile ? "14px" : "18px",
              marginBottom: isMobile ? "22px" : "10px",
              maxWidth: "600px",
              lineHeight: "1.8"
            }}
          >
            Temukan pantai indah, wisata budaya,
            pegunungan, dan destinasi terbaik
            di Sulawesi Selatan.
          </p>

          {/* SEARCH BOX */}
          <div
            style={{
              background: "rgba(255,255,255,0.98)",
              borderRadius: "25px",
              padding: isMobile ? "14px 18px" : "18px 24px",
              display: "flex",
              alignItems: "center",
              gap: "15px",
              position: "relative",
              boxShadow: "0 12px 35px rgba(0,0,0,0.22)",
              backdropFilter: "blur(15px)",
              zIndex: 999,
              marginTop: isMobile ? "16px" : "0",
              marginBottom: isMobile ? "" : "0",
            }}
          >
            
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#555"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                minWidth: "22px"
              }}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>

            <input
              type="text"
              placeholder="Cari pantai, kabupaten, air terjun..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setShowFullResult(false);
                setMatchedKabupatenList([]);
              }}
              onKeyDown={handleKeyDown}
              style={{
                border: "none",
                outline: "none",
                width: "100%",
                fontSize: isMobile ? "15px" : "17px",
                background: "transparent",
                paddingRight: "45px"
              }}
            />

            {keyword && (
              <button
                onClick={() => {
                  setKeyword("");
                  setResults([]);
                  setShowFullResult(false);
                  setMatchedKabupatenList([]);
                }}
                style={{
                  position: "absolute",
                  right: "20px",
                  width: "34px",
                  height: "34px",
                  borderRadius: "50%",
                  border: "none",
                  background: "#f1f1f1",
                  color: "#666",
                  cursor: "pointer",
                  fontSize: "18px",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "0.25s ease"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#800000";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f1f1f1";
                  e.currentTarget.style.color = "#666";
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

       {/* ================= TRENDING SEARCH ================= */}
      {!keyword && (
        <div
          style={{
            width: "88%",
            margin: isMobile ? "80px auto 50px" : "50px auto"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginBottom: "24px"
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: isMobile ? "24px" : "34px",
                  fontWeight: "800",
                  marginBottom: "8px",
                  lineHeight: "1.2",
                }}
              >
                Riwayat Pencarian
              </h2>

              <p
                style={{
                  color: "#666",
                  fontSize: isMobile ? "14px" : "15px",
                  lineHeight: "1.6",
                }}
              >
                Temukan kembali destinasi yang pernah Anda cari.
              </p>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(4, 1fr)",
              gap: "18px"
            }}
          >
            {trendingSearch.map((item, index) => (
              <div
                key={index}
                onClick={() => handleTrendingClick(item)}
                style={{
                  background: "rgba(255,255,255,0.85)",
                  borderRadius: "24px",
                  padding: "18px",
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  alignItems: isMobile ? "flex-start" : "center",
                  gap: "18px",
                  cursor: "pointer",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 30px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0px)";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(0,0,0,0.08)";
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#666"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* panah melingkar */}
                    <path d="M4 12a8 8 0 1 0 2.3-5.6" />

                    {/* kepala panah */}
                    <path d="M4 4v4h4" />

                    {/* jarum jam */}
                    <path d="M12 8v4l2.5 1.5" />
                  </svg>
                </div>

                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      display: "inline-block",
                      background: "rgba(128,0,0,0.08)",
                      color: "#800000",
                      padding: "4px 10px",
                      borderRadius: "20px",
                      fontSize: "11px",
                      fontWeight: "700",
                      marginBottom: "10px"
                    }}
                  >
                    RIWAYAT
                  </div>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      marginBottom: "5px"
                    }}
                  >
                    {item}
                  </h3>

                  <p
                    style={{
                      color: "#666",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}
                  >
                    Klik untuk mencari kembali
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

        {/* ================= LIVE SEARCH ================= */}
        {!showFullResult && results.length > 0 && (
          <div
            style={{
              width: "88%",
              margin: "50px auto"
            }}
          >
            <h2
              style={{
                marginBottom: "25px",
                fontSize: "28px",
                fontWeight: "800"
              }}
            >
              Hasil Pencarian
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px"
              }}
            >
              {results.map((item) => (
                <div
                  key={item._id}
                  onClick={() =>
                    navigate("/detail", {
                      state: item
                    })
                  }
                  style={{
                    background: "#fff",
                    borderRadius: "22px",
                    padding: isMobile ? "12px" : "16px",
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    gap: isMobile ? "12px" : "20px",
                    cursor: "pointer",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)"
                  }}
                >
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    style={{
                    width: isMobile ? "100%" : "140px",
                    height: isMobile ? "180px" : "100px",
                      objectFit: "cover",
                      borderRadius: "18px"
                    }}
                  />

                  <div
                    style={{
                      width: "100%"
                    }}
                  >
                    <h3
                      style={{
                        marginBottom: "8px",
                        fontSize: isMobile ? "20px" : "22px",
                        lineHeight: "1.3",
                        wordBreak: "break-word",
                      }}
                    >
                      {item.nama}
                    </h3>

                    <p
                      style={{
                        color: "#800000",
                        fontWeight: "700",
                        marginBottom: "6px"
                      }}
                    >
                      {item.kategori}
                    </p>

                    <p>
                      📍 {item.kabupaten}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* ================= PILIHAN KABUPATEN ================= */}
      {matchedKabupatenList.length > 1 && (
        <div
          style={{
            width: "88%",
            margin: "50px auto"
          }}
        >
          <h2
            style={{
              marginBottom: "25px",
              fontSize: "30px",
              fontWeight: "800"
            }}
          >
            Pilih Kabupaten/Kota
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "25px"
            }}
          >
            {matchedKabupatenList.map((kab) => (
              <div
                key={kab}
                onClick={() => navigate(`/kabpage/${kab}`)}
                style={{
                  background: "#fff",
                  borderRadius: "22px",
                  padding: "35px",
                  cursor: "pointer",
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: "22px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
                }}
              >
                📍 {kab}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= FULL RESULT ================= */}
      {showFullResult && results.length > 0 && (
        <div
          style={{
            width: "88%",
            margin: "50px auto"
          }}
        >
          <h2
            style={{
              marginBottom: "30px",
              fontSize: "34px",
              fontWeight: "800"
            }}
          >
            Destinasi Ditemukan
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile
                ? "1fr"
                : "repeat(auto-fill, minmax(330px, 1fr))",
              gap: "30px"
            }}
          >
            {results.map((item) => (
              <div
                key={item._id}
                onClick={() =>
                  navigate("/detail", {
                    state: item
                  })
                }
                style={{
                  background: "#fff",
                  borderRadius: "28px",
                  overflow: "hidden",
                  cursor: "pointer",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.12)"
                }}
              >
                <div
                  style={{
                    position: "relative"
                  }}
                >
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    style={{
                      width: "100%",
                      height: isMobile ? "180px" : "250px",
                      objectFit: "cover"
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      top: "18px",
                      left: "18px",
                      background: "#800000",
                      color: "#fff",
                      padding: "10px 16px",
                      borderRadius: "30px",
                      fontSize: "13px",
                      fontWeight: "700"
                    }}
                  >
                    {item.kategori}
                  </div>
                </div>

                <div
                  style={{
                    padding: "24px"
                  }}
                >
                  <h2
                    style={{
                      marginBottom: "12px",
                      fontSize: isMobile ? "20px" : "26px",
                    }}
                  >
                    {item.nama}
                  </h2>

                  <p
                    style={{
                      color: "#666",
                      lineHeight: "1.8",
                      marginBottom: "18px"
                    }}
                  >
                    {item.deskripsiSingkat?.slice(0, 120)}...
                  </p>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "700"
                      }}
                    >
                      📍 {item.kabupaten}
                    </span>

                    <span
                      style={{
                        color: "#800000",
                        fontWeight: "800"
                      }}
                    >
                      Detail →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* ================= SEARCH NOT FOUND ================= */}
      {showFullResult &&
        results.length === 0 &&
        matchedKabupatenList.length === 0 &&
        keyword.trim() !== "" && (
          <div
            style={{
              width: "88%",
              margin: "50px auto",
              background: "#fff",
              borderRadius: "28px",
              padding: "60px 30px",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
            }}
          >
            <div
              style={{
                fontSize: "70px",
                marginBottom: "20px"
              }}
            >
              🔍
            </div>

            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                marginBottom: "14px",
                color: "#222"
              }}
            >
              Destinasi Tidak Ditemukan
            </h2>

            <p
              style={{
                fontSize: "17px",
                color: "#666",
                lineHeight: "1.8"
              }}
            >
              Tidak ada hasil untuk{" "}
              <span
                style={{
                  color: "#800000",
                  fontWeight: "700"
                }}
              >
                "{keyword}"
              </span>
              .
              <br />
              Coba gunakan kata kunci lain seperti:
              pantai, makassar, air terjun, toraja, danau, dll.
            </p>
          </div>
      )}
    </div>
  );
}

