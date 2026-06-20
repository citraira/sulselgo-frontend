import React, { useMemo, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DetailPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [isZoomed, setIsZoomed] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isiUlasan, setIsiUlasan] = useState("");
  const [ratingInput, setRatingInput] = useState(0);
  const [filterBintang, setFilterBintang] = useState("all");
  const [loadingReview, setLoadingReview] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [menuAktif, setMenuAktif] = useState(null);
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoverHapus, setHoverHapus] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [hoverSide, setHoverSide] = useState(null); // "left" | "right" | null
  
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const [showEditForm, setShowEditForm] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRatingInput, setEditRatingInput] = useState(0);
  const [editIsiUlasan, setEditIsiUlasan] = useState("");
  const [dislikeCounts, setDislikeCounts] = useState({}); 
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Helper aman untuk memformat base URL agar bebas dari /api/api ganda
  const getCleanApiUrl = (endpoint) => {
    const baseUrl = import.meta.env.VITE_API_URL || "";
    // Jika endpoint dimulai dengan /api dan baseUrl diakhiri /api, bersihkan salah satu
    if (endpoint.startsWith("/api") && baseUrl.endsWith("/api")) {
      return `${baseUrl.replace(/\/api$/, "")}${endpoint}`;
    }
    // Jika baseUrl tidak memiliki /api dan endpoint juga tidak, tambahkan secara adaptif
    return `${baseUrl}${endpoint}`;
  };

  // ================= PERBAIKAN SCROLL INSTAN TANPA TRANSISI =================
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant"
    });
  }, [state]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  // ==========================================================================

  const nextImage = () => {
    const next = (currentImageIndex + 1) % galeri.length;
    setCurrentImageIndex(next);
    setSelectedImage(galeri[next]);
    setZoom(1);
  };

  const prevImage = () => {
    const prev = (currentImageIndex - 1 + galeri.length) % galeri.length;
    setCurrentImageIndex(prev);
    setSelectedImage(galeri[prev]);
    setZoom(1);
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 2.5));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 1));
  };

  useEffect(() => {
    if (!selectedImage || isMobile) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        nextImage();
      }
      if (e.key === "ArrowLeft") {
        prevImage();
      }
      if (e.key === "Escape") {
        setSelectedImage(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage, isMobile, currentImageIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) < 50) return;

    if (diff > 0) {
      nextImage();
    } else {
      prevImage();
    }
  };

  // ================= FETCH ULASAN ADAPTIF + FILTER DUMMY TESTING =================
  useEffect(() => {
    const fetchReviews = async () => {
      if (!state?._id) return;

      setReviews([]); 
      setLoadingReview(true);

      try {
        let apiUrl = getCleanApiUrl(`/api/reviews/${state._id}`);
        let res = await fetch(apiUrl);
        
        if (res.status === 404) {
          // Fallback tanpa sub-path /api jika routing backend berbeda
          const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
          res = await fetch(`${cleanBase}/reviews/${state._id}`);
        }

        const data = await res.json();
        const rawReviews = Array.isArray(data) ? data : data.reviews || data.data || [];
        
        // 🚀 FILTER ANTARMUKA: Singkirkan ulasan otomatis dari Unit Testing SQA kelompokmu
        const cleanReviews = rawReviews.filter(item => {
          const username = (item.userId?.username || item.nama || "").toLowerCase();
          const isiUlasan = (item.ulasan || "").toLowerCase();
          
          return !username.includes("usera") && 
                 !username.includes("reviewuser") && 
                 !username.includes("dislikeuser") && 
                 !username.includes("likeuser") &&
                 !isiUlasan.includes("test") &&
                 !isiUlasan.includes("update kedua");
        });

        setReviews(cleanReviews);
      } catch (err) {
        console.error("Gagal ambil reviews:", err);
      } finally {
        setLoadingReview(false);
      }
    };

    fetchReviews();
  }, [state?._id]);
  // ==========================================================================

  if (!state) {
    return (
      <div style={{ paddingTop: "100px", paddingInline: "30px" }}>
        <h2>Data destinasi tidak ditemukan</h2>
        <button
          onClick={() => navigate("/kabupaten")}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            borderRadius: "10px",
            border: "none",
            backgroundColor: "#800000",
            color: "#fff",
            cursor: "pointer"
          }}
        >
          Kembali
        </button>
      </div>
    );
  }

  const {
    nama,
    deskripsiSingkat = "",
    deskripsiLengkap = "",
    gambar,
    galeri = [],
    lokasi,
    kabupaten,
    kategori
  } = state;

  const deskripsiTampil = deskripsiLengkap || deskripsiSingkat || "Belum ada deskripsi.";

  const formatCount = (num) => {
    if (num >= 1000) return `${Math.floor(num / 1000)}RB`;
    return `${num}`;
  };

  const renderStarsInput = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => setRatingInput(star)}
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: star <= ratingInput ? "#f4c400" : "#d5d5d5",
          marginRight: "2px",
          userSelect: "none"
        }}
      >
        ★
      </span>
    ));
  };

  const renderEditStarsInput = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => setEditRatingInput(star)}
        style={{
          fontSize: "24px",
          cursor: "pointer",
          color: star <= editRatingInput ? "#f4c400" : "#d5d5d5",
          marginRight: "2px",
          userSelect: "none"
        }}
      >
        ★
      </span>
    ));
  };

  const renderStarsDisplay = (value) => {
    const starValue = Number(value) || 0;
    return (
      <span style={{ color: "#f4c400", fontSize: "18px", letterSpacing: "1px" }}>
        {"★".repeat(starValue)}
        <span style={{ color: "#d5d5d5" }}>
          {"★".repeat(5 - starValue)}
        </span>
      </span>
    );
  };

  const ratingCount = useMemo(() => {
    const count = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((item) => {
      if (count[Number(item.rating)] !== undefined) {
        count[Number(item.rating)] += 1;
      }
    });
    return count;
  }, [reviews]);

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, item) => sum + Number(item.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const filteredReviews =
    filterBintang === "all"
      ? reviews
      : reviews.filter((item) => Number(item.rating) === Number(filterBintang));

  // ================= PERBAIKAN: TAMBAH ULASAN ADAPTIF ANTI-404 GANDA =================
  const handleTambahUlasan = async () => {
    if (!isiUlasan.trim()) return;

    if (!user) {
      navigate("/login");
      return;
    }

    setLoadingReview(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Sesi Anda habis. Silakan login kembali.");
        navigate("/login");
        return;
      }

      const payload = {
        destinasiId: state?._id,
        userId: user?.id || user?._id,
        nama: user?.username || "User",
        rating: ratingInput || 5,
        ulasan: isiUlasan
      };

      let apiUrl = getCleanApiUrl("/api/reviews");
      let res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        res = await fetch(`${cleanBase}/reviews`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      if (!res.ok) {
        let errorMessage = "Gagal menambahkan ulasan.";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server bermasalah dengan status kode: ${res.status}`;
        }
        alert(errorMessage);
        return;
      }

      const data = await res.json();
      const reviewBaru = data.review || data.data || data;

      setReviews((prevReviews) => [reviewBaru, ...prevReviews]); 

      setIsiUlasan("");
      setRatingInput(0);
      setShowForm(false);
      alert("Ulasan berhasil dikirim!");
    } catch (err) {
      console.error("Gagal tambah ulasan:", err);
      alert("Gagal terhubung ke server. Pastikan koneksi atau alamat API Anda benar.");
    } finally {
      setLoadingReview(false);
    }
  };
  // =====================================================================================

  const handleSelectFilter = (star) => {
    setFilterBintang(star);
    setShowDropdown(false);
  };

  const labelFilter = filterBintang === "all" ? "Semua Bintang" : `${filterBintang} Bintang`;

  // ================= PERBAIKAN: HAPUS ULASAN ADAPTIF =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus ulasan?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      let apiUrl = getCleanApiUrl(`/api/reviews/${id}`);

      let res = await fetch(apiUrl, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        res = await fetch(`${cleanBase}/reviews/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) => prev.filter((item) => item._id !== id));
        setMenuAktif(null);
        alert(data.message || "Ulasan berhasil dihapus");
      } else {
        alert(data.message || "Gagal menghapus ulasan");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus ulasan");
    }
  };

  // ================= PERBAIKAN: LIKE ULASAN ADAPTIF =================
  const handleLike = async (id) => {
    if (!user) { navigate("/login"); return; }
    
    const token = localStorage.getItem("token");
    try {
      let apiUrl = getCleanApiUrl(`/api/reviews/${id}/like`);
      let res = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        }
      });

      if (res.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        res = await fetch(`${cleanBase}/reviews/${id}/like`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json" 
          }
        });
      }
      
      if (res.ok) {
        const updatedReview = await res.json();
        setReviews(prev => prev.map(r => r._id === id ? (updatedReview.review || updatedReview.data || updatedReview) : r));
      }
    } catch (err) {
      console.error("Gagal like:", err);
    }
  };

  // ================= PERBAIKAN: DISLIKE ULASAN ADAPTIF =================
  const handleDislike = async (id) => {
    if (!user) { navigate("/login"); return; }
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      let apiUrl = getCleanApiUrl(`/api/reviews/${id}/dislike`);
      let res = await fetch(apiUrl, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        res = await fetch(`${cleanBase}/reviews/${id}/dislike`, {
          method: "POST",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
      }
      
      if (res.ok) {
        const updatedReview = await res.json();
        setReviews(prev => prev.map(r => r._id === id ? (updatedReview.review || updatedReview.data || updatedReview) : r));
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleEdit = (review) => {
    setEditReviewId(review._id);
    setEditRatingInput(Number(review.rating) || 0);
    setEditIsiUlasan(review.ulasan || "");
    setShowEditForm(true);
    setMenuAktif(null);
  };

  // ================= PERBAIKAN: SIMPAN EDIT ULASAN ADAPTIF =================
  const handleSimpanEdit = async () => {
    if (!editIsiUlasan.trim()) return;

    try {
      const token = localStorage.getItem("token");
      let apiUrl = getCleanApiUrl(`/api/reviews/${editReviewId}`);

      let res = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: editRatingInput,
          ulasan: editIsiUlasan
        })
      });

      if (res.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        res = await fetch(`${cleanBase}/reviews/${editReviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            rating: editRatingInput,
            ulasan: editIsiUlasan
          })
        });
      }

      const data = await res.json();

      if (res.ok) {
        setReviews((prev) =>
          prev.map((item) =>
            item._id === editReviewId
              ? { ...item, rating: editRatingInput, ulasan: editIsiUlasan }
              : item
          )
        );

        setShowEditForm(false);
        setEditReviewId(null);
        setEditRatingInput(0);
        setEditIsiUlasan("");

        alert("Ulasan berhasil diedit");
      } else {
        alert(data.message || "Gagal edit ulasan");
      }
    } catch (error) {
      console.error(error);
      alert("Gagal edit ulasan");
    }
  };

  // ================= PERBAIKAN: CEK STATUS FAVORIT ADAPTIF ANTI-404 GANDA =================
  useEffect(() => {
    const cekStatusFavorit = async () => {
      if (!user || !state?._id) return;

      try {
        const token = localStorage.getItem("token");
        let apiUrl = getCleanApiUrl(`/api/favorit/${user.id || user?._id}`);

        let response = await fetch(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 404) {
          const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
          response = await fetch(`${cleanBase}/favorit/${user.id || user?._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }

        const data = await response.json();
        const listFavorit = Array.isArray(data) ? data : data.favorit || data.data || [];

        const sudahFavorit = listFavorit.some(
          (fav) => fav.destinasiId?._id === state._id || fav.destinasiId === state._id
        );

        setIsFavorite(sudahFavorit);
      } catch (err) {
        console.error("Gagal cek status favorit:", err);
      }
    };

    cekStatusFavorit();
  }, [state?._id, user]);

  // ================= PERBAIKAN: PROCESS FAVORIT ADAPTIF ANTI-404 GANDA =================
  const handleFavorite = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (!state?._id) {
      alert("Data destinasi tidak memiliki ID MongoDB. Favorit gagal disimpan.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      let apiUrl = getCleanApiUrl("/api/favorit");

      let response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id || user?._id,
          destinasiId: state._id
        })
      });

      if (response.status === 404) {
        const cleanBase = (import.meta.env.VITE_API_URL || "").replace(/\/api$/, "");
        response = await fetch(`${cleanBase}/favorit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: user.id || user?._id,
            destinasiId: state._id
          })
        });
      }

      const data = await response.json();

      if (response.ok) {
        setIsFavorite(!isFavorite);
        alert(data.message || "Berhasil memperbarui favorit");
      } else {
        alert(data.message || "Gagal menyimpan favorit");
      }
    } catch (err) {
      console.error("Gagal memproses favorit:", err);
      alert("Gagal terhubung ke server backend");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "70px",
        backgroundColor: "#f5f5f5"
      }}
    >
      {/* HERO IMAGE */}
      <div
        style={{
          width: "100%",
          height: "430px",
          overflow: "hidden",
          position: "relative"
        }}
      >
        <img
          src={gambar}
          alt={nama}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <button
          onClick={() => {
            if (state?.returnKategori) {
              navigate("/kategori", {
                state: {
                  selectedKategori: state.returnKategori
                }
              });
            } else {
              navigate(-1);
            }
          }}
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
            zIndex: 20,
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
      </div>

      {/* WHITE CARD FULL */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#fff",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "22px 28px 36px 28px",
            boxSizing: "border-box"
          }}
        >
          {/* TITLE + FAVORITE */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "14px",
              marginBottom: "16px"
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "18px",
                lineHeight: "1.45",
                fontWeight: "700",
                color: "#1f1f1f",
                flex: 1
              }}
            >
              {nama}
            </h1>

            <button
              onClick={handleFavorite}
              style={{
                width: "50px",
                height: "50px",
                border: "none",
                background: "#fff",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                transition: "0.2s"
              }}
            >
              <span
                style={{
                  fontSize: "34px",
                  color: isFavorite ? "#b00020" : "#666",
                  lineHeight: "1"
                }}
              >
                {isFavorite ? "♥" : "♡"}
              </span>
            </button>
          </div>

          {/* BADGE */}
          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              marginBottom: "18px"
            }}
          >
            {kabupaten && (
              <span
                style={{
                  backgroundColor: "#f1e7e7",
                  color: "#8b0000",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {kabupaten}
              </span>
            )}

            {kategori && (
              <span
                style={{
                  backgroundColor: "#dfe7f8",
                  color: "#2c53a6",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {kategori}
              </span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p
            style={{
              margin: 0,
              marginBottom: "18px",
              fontSize: "14px",
              lineHeight: "1.8",
              color: "#333"
            }}
          >
            {deskripsiTampil}
          </p>

          {/* MAPS LINK */}
          {lokasi && (
            <div style={{ marginBottom: "18px" }}>
              <a
                href={lokasi}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#1a73e8",
                  textDecoration: "none",
                  fontWeight: "500",
                  fontSize: "14px"
                }}
              >
                Buka di Google Maps
              </a>
            </div>
          )}

          {/* GALERI FOTO */}
          {galeri.length > 0 && (
            <div style={{ marginTop: "20px", marginBottom: "20px" }}>
              <h3
                style={{
                  marginBottom: "12px",
                  color: "#222"
                }}
              >
                Galeri Foto
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    window.innerWidth <= 768 ? "1fr 1fr" : "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "10px",
                }}
              >
                {galeri.map((foto, index) => (
                  <img
                    key={index}
                    src={foto}
                    alt={`galeri-${index}`}
                    onClick={() => {
                      setSelectedImage(foto);
                      setCurrentImageIndex(index);
                      setZoom(1);
                    }}
                    style={{
                      width: "220px",
                      height: window.innerWidth <= 768 ? "120px" : "150px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      cursor: "pointer",
                      transition: "0.2s"
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* REVIEW HEADER */}
          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#222",
                marginBottom: "12px"
              }}
            >
              {averageRating} <span style={{ color: "#f4c400" }}>⭐</span> Ulasan Pengunjung ({formatCount(totalReviews)})
            </div>

            {!showForm && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: "8px",
                  flexWrap: "wrap",
                  marginBottom: "10px"
                }}
              >
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    border: "1px solid #cfcfcf",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#222"
                  }}
                >
                  Tambahkan Ulasan
                </button>

                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown);
                    }}
                    style={{
                      padding: "9px 14px",
                      borderRadius: "10px",
                      border: "1px solid #cfcfcf",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#222",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      minWidth: "130px",
                      justifyContent: "space-between"
                    }}
                  >
                    <span>
                      {labelFilter} <span style={{ color: "#f4c400" }}>⭐</span>
                    </span>
                    <span style={{ fontSize: "12px" }}>▼</span>
                  </button>

                  {showDropdown && (
                    <div
                      style={{
                        position: "absolute",
                        top: "44px",
                        right: 0,
                        width: "175px",
                        backgroundColor: "#fff",
                        border: "1px solid #cfcfcf",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                        zIndex: 20,
                        overflow: "hidden"
                      }}
                    >
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div
                          key={star}
                          onClick={() => handleSelectFilter(star)}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "10px 12px",
                            cursor: "pointer",
                            borderBottom: "1px solid #d9d9d9",
                            backgroundColor:
                              Number(filterBintang) === star ? "#fafafa" : "#fff"
                          }}
                        >
                          <div
                            style={{
                              color: "#f4c400",
                              fontSize: "16px",
                              letterSpacing: "1px",
                              whiteSpace: "nowrap"
                            }}
                          >
                            {"★".repeat(star)}
                            <span style={{ color: "#d5d5d5" }}>
                              {"★".repeat(5 - star)}
                            </span>
                          </div>

                          <div
                            style={{
                              fontSize: "14px",
                              color: "#666",
                              marginLeft: "10px",
                              minWidth: "28px",
                              textAlign: "right"
                            }}
                          >
                            {formatCount(ratingCount[star])}
                          </div>
                        </div>
                      ))}

                      <button
                        onClick={() => {
                          setFilterBintang("all");
                          setShowDropdown(false);
                        }}
                        onMouseEnter={() => setHoverHapus(true)}
                        onMouseLeave={() => setHoverHapus(false)}
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "600",
                          textAlign: "center",
                          backgroundColor: hoverHapus ? "#8b0000" : "#fff",
                          color: hoverHapus ? "#fff" : "#8b0000",
                          transition: "0.2s"
                        }}
                      >
                        Hapus Filter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {showEditForm && (
            <div
              style={{
                marginBottom: "18px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5"
              }}
            >
              <div style={{ marginBottom: "10px" }}>
                {renderEditStarsInput()}
              </div>

              <textarea
                rows="5"
                value={editIsiUlasan}
                onChange={(e) => setEditIsiUlasan(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #cfcfcf",
                  outline: "none",
                  resize: "none",
                  marginBottom: "12px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "8px"
                }}
              >
                <button
                  onClick={() => {
                    setShowEditForm(false);
                    setEditReviewId(null);
                  }}
                  style={{
                    padding: "9px 14px",
                    borderRadius: "10px",
                    border: "1px solid #d0d0d0",
                    backgroundColor: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Batal
                </button>

                <button
                  onClick={handleSimpanEdit}
                  style={{
                    padding: "9px 18px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: "#8b0000",
                    color: "#fff",
                    cursor: "pointer"
                  }}
                >
                  Simpan
                </button>
              </div>
            </div>
          )}

          {/* FORM REVIEW */}
          {showForm ? (
            <div
              style={{
                marginBottom: "18px",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#fff",
                border: "1px solid #e5e5e5"
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px"
                }}
              >
                <div
                  style={{
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "#555",
                    marginTop: "2px"
                  }}
                >
                  👤
                </div>

                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "#222",
                      marginBottom: "8px"
                    }}
                  >
                    {user?.username || "User"}
                  </div>

                  <div style={{ marginBottom: "10px" }}>
                    {renderStarsInput()}
                  </div>

                  <textarea
                    placeholder="Bagikan ulasan Anda..."
                    rows="5"
                    value={isiUlasan}
                    onChange={(e) => setIsiUlasan(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      borderRadius: "12px",
                      border: "1px solid #cfcfcf",
                      outline: "none",
                      resize: "none",
                      marginBottom: "12px",
                      fontSize: "14px",
                      backgroundColor: "#fff",
                      boxSizing: "border-box"
                    }}
                  />

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "8px"
                    }}
                  >
                    <button
                      onClick={() => {
                        setShowForm(false);
                        setIsiUlasan("");
                        setRatingInput(0);
                      }}
                      style={{
                        padding: "9px 14px",
                        borderRadius: "10px",
                        border: "1px solid #d0d0d0",
                        backgroundColor: "#fff",
                        color: "#333",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}
                    >
                      Batal
                    </button>

                    <button
                      onClick={handleTambahUlasan}
                      disabled={loadingReview}
                      style={{
                        padding: "9px 18px",
                        borderRadius: "10px",
                        border: "none",
                        backgroundColor: "#8b0000",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "14px"
                      }}
                    >
                      {loadingReview ? "Mengirim..." : "Kirim"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: "10px" }}>
              {filteredReviews.length > 0 ? (
                (showAllReviews
                  ? filteredReviews
                  : filteredReviews.slice(0, 5)
                ).map((item, index) => {
                  const ownerId = item.userId?._id || item.userId;
                  const isOwner = user?.id === ownerId || user?._id === ownerId;
                  const username = item.userId?.username || item.nama || "user";

                  return (
                    <div
                      key={item._id || index}
                      style={{
                        padding: "16px 0",
                        borderBottom: "1px solid #e5e5e5"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                        {/* Avatar */}
                        <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#a64ac9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", flexShrink: 0 }}>
                          {username.charAt(0).toUpperCase()}
                        </div>

                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontWeight: "600", fontSize: "14px" }}>@{username}</span>
                            <span style={{ fontSize: "13px", color: "#777" }}>
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : ""}
                            </span>
                          </div>

                          <div style={{ marginBottom: "10px" }}>{renderStarsDisplay(item.rating)}</div>
                          <div style={{ fontSize: "15px", color: "#111", marginBottom: "10px", lineHeight: "1.6" }}>{item.ulasan}</div>
                         
                          {/* --- BAGIAN LIKE & DISLIKE YANG DIPERBAIKI --- */}
                          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                          
                            {/* TOMBOL LIKE */}
                            <div
                              onClick={() => handleLike(item._id)}
                              style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", userSelect: "none", zIndex: 10 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                                  fill={item.likes && item.likes.includes(user?.id || user?._id) ? "#000" : "none"} 
                                  stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M7 10v12" />
                                <path d="M15 5.88L14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3l4-7a2 2 0 0 1 4 1.88Z" />
                              </svg>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>{item.likes ? item.likes.length : 0}</span>
                            </div>

                            {/* TOMBOL DISLIKE */}
                            <div
                              onClick={() => handleDislike(item._id)}
                              style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer", userSelect: "none", zIndex: 10 }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" 
                                  fill={item.dislikes && item.dislikes.includes(user?.id || user?._id) ? "#000" : "none"} 
                                  stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 14V2" />
                                <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3l-4 7a2 2 0 0 1-4-1.88Z" />
                              </svg>
                              <span style={{ fontSize: "12px", color: "#555", fontWeight: "500" }}>{item.dislikes ? item.dislikes.length : 0}</span>
                            </div>
                          </div>
                          {/* --- AKHIR PERBAIKAN --- */}
                        </div>
                        
                        {isOwner ? (
                          <div style={{ position: "relative" }}>
                            <button
                              onClick={() => setMenuAktif(menuAktif === item._id ? null : item._id)}
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: "0 5px",
                                lineHeight: 1,
                                color: "#333",
                                width: "24px",
                                height: "24px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#111"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <circle cx="12" cy="5" r="1.5" />
                                <circle cx="12" cy="12" r="1.5" />
                                <circle cx="12" cy="19" r="1.5" />
                              </svg>
                            </button>

                            {menuAktif === item._id && (
                              <div
                                style={{
                                  position: "absolute",
                                  right: 0,
                                  top: "32px",
                                  backgroundColor: "#fff",
                                  borderRadius: "14px",
                                  boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
                                  overflow: "hidden",
                                  width: "180px",
                                  zIndex: 99,
                                  padding: "6px 0"
                                }}
                              >
                                <button
                                  onClick={() => {
                                    handleEdit(item);
                                    setMenuAktif(null);
                                  }}
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    background: "#fff",
                                    padding: "12px 14px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#111"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                                  </svg>
                                  <span>Edit</span>
                                </button>

                                <button
                                  onClick={() => {
                                    handleDelete(item._id);
                                    setMenuAktif(null);
                                  }}
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    background: "#fff",
                                    padding: "12px 14px",
                                    textAlign: "left",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px"
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#111"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                  </svg>
                                  <span>Hapus</span>
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ width: "24px" }} />
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div
                  style={{
                    backgroundColor: "#f1f1f1",
                    borderRadius: "12px",
                    padding: "14px",
                    color: "#666",
                    fontSize: "14px"
                  }}
                >
                  Belum ada ulasan untuk filter bintang ini.
                </div>
              )}

              {filteredReviews.length > 5 && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px"
                  }}
                >
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      cursor: "pointer",
                      fontWeight: "600"
                    }}
                  >
                    {showAllReviews
                      ? "Tampilkan Lebih Sedikit"
                      : `Lihat ${filteredReviews.length - 5} Ulasan Lainnya`}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            overflow: "hidden"
          }}
        >
          {!isMobile && (
            <div
              onMouseEnter={() => setHoverSide("left")}
              onMouseLeave={() => setHoverSide(null)}
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "25%",
                height: "100%",
                zIndex: 10000,
                cursor: "default"
              }}
            >
              {hoverSide === "left" && (
                <div
                  style={{
                    position: "absolute",
                    left: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none"
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "30px",
                      fontWeight: "700",
                      lineShadow: 1,
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)"
                    }}
                  >
                    ‹
                  </span>
                </div>
              )}
            </div>
          )}

          {!isMobile && (
            <div
              onMouseEnter={() => setHoverSide("right")}
              onMouseLeave={() => setHoverSide(null)}
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              style={{
                position: "absolute",
                right: 0,
                top: "25%",
                width: "25%",
                height: "100%",
                zIndex: 10000,
                cursor: "default"
              }}
            >
              {hoverSide === "right" && (
                <div
                  style={{
                    position: "absolute",
                    right: "24px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "32px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "transparent",
                    border: "none",
                    boxShadow: "none"
                  }}
                >
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "30px",
                      fontWeight: "700",
                      lineHeight: 1,
                      textShadow: "0 2px 8px rgba(0,0,0,0.8)"
                    }}
                  >
                    ›
                  </span>
                </div>
              )}
            </div>
          )}

          <img
            src={selectedImage}
            alt="preview"
            onClick={(e) => e.stopPropagation()}
            onDoubleClick={() => setZoom(zoom === 1 ? 2 : 1)}
            style={{
              maxWidth: "80%",
              maxHeight: "80%",
              objectFit: "contain",
              borderRadius: "14px",
              transform: `scale(${zoom})`,
              transition: "0.3s ease",
              zIndex: 10000
            }}
          />

          <div
            onClick={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: "30px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: "15px",
              zIndex: 10001
            }}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                border: "none",
                background: "#fff",
                fontSize: "32px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              −
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              style={{
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                border: "none",
                background: "#fff",
                fontSize: "32px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
              }}
            >
              +
            </button>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "none",
              backgroundColor: "#fff",
              color: "#111",
              fontSize: "28px",
              fontWeight: "bold",
              cursor: "pointer",
              zIndex: 10001
            }}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default DetailPage;