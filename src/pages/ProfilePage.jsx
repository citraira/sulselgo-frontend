import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [loading, setLoading] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);

 
const [user, setUser] = useState({
  username: "",
  email: "",
  telepon: "",
  tanggalLahir: "",
  alamat: ""
});

useEffect(() => {

  const fetchUser = async () => {

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    if (!savedUser) {
      navigate("/login");
      return;
    }

    try {

      const res = await API.get(
        `/user/${savedUser.id}`
      );

      const data = res.data;

      const userData = {
        username: data.username || "",
        email: data.email || "",
        telepon: data.telepon || "",
        tanggalLahir: data.tanggalLahir || "",
        alamat: data.alamat || ""
      };

      setUser(userData);
      setOriginalUser(userData);

    } catch (err) {

      console.error(
        "Gagal mengambil user:",
        err
      );

    }
  };

  fetchUser();

}, [navigate]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSimpan = async () => {

    const savedUser = JSON.parse(
      localStorage.getItem("user")
    );

    setLoading(true);

    try {

      const response = await API.put(
        `/user/${savedUser.id}`,
        user
      );

      const updatedUser = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...savedUser,
          ...updatedUser
        })
      );

      setUser(updatedUser);
      setOriginalUser(updatedUser);

      alert("Profil berhasil diperbarui");

      setIsEdit(false);

    } catch (err) {

      console.error(
        "Gagal update profil:",
        err
      );

      if (originalUser) {
        setUser(originalUser);
      }

      alert(
        err.response?.data?.message ||
        "Gagal update profil"
      );

    } finally {

      setLoading(false);

    }
  };

  const infoList = [
    { label: "Email", key: "email", icon: "✉" },
    { label: "Telepon", key: "telepon", icon: "☎" },
    { label: "Tanggal Lahir", key: "tanggalLahir", icon: "📅" },
    { label: "Alamat", key: "alamat", icon: "⌂" }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: "70px",
        background: "linear-gradient(180deg, #f4f4f4 0%, #efefef 45%, #f8f8f8 100%)"
      }}
    >
      {/* HERO */}
      <div
        style={{
          width: "100%",
          height: isMobile ? "190px" : "320px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <img
          src="/leang leang.jpg"
          alt="Header Profil"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.45))"
          }}
        />

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          style={{
            position: "absolute",
            top: isMobile ? "16px" : "20px",
            left: isMobile ? "16px" : "20px",
            width: isMobile ? "40px" : "44px",
            height: isMobile ? "40px" : "44px",
            borderRadius: "50%",
            border: "none",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(0,0,0,0.18)",
            zIndex: 3
          }}
        >
          <svg
            width="20"
            height="20"
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
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: isMobile ? "22px" : "90px",
            width: isMobile ? "calc(100% - 30px)" : "min(1100px, calc(100% - 40px))",
            color: "#fff"
          }}
        >
          <div
            style={{
              fontSize: isMobile ? "12px" : "14px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              opacity: 0.9,
              marginBottom: "8px"
            }}
          >
            Profil Pengguna
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: isMobile ? "28px" : "40px",
              fontWeight: "700",
              lineHeight: 1.2
            }}
          >
            Kelola akun Anda
          </h1>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div
        style={{
          width: isMobile ? "calc(100% - 24px)" : "min(1100px, calc(100% - 40px))",
          margin: "0 auto",
          marginTop: isMobile ? "20px" : "-20px",
          position: "relative",
          zIndex: 2,
          paddingBottom: "50px"
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "320px 1fr",
            gap: isMobile ? "18px" : "24px",
            alignItems: "start"
          }}
        >
          {/* LEFT CARD */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: isMobile ? "22px" : "28px",
              boxShadow: "0 16px 45px rgba(0,0,0,0.10)",
              border: "1px solid rgba(0,0,0,0.04)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                padding: isMobile ? "20px 16px" : "30px 28px",
                background: "linear-gradient(135deg, #8b0000, #b11212)",
                color: "#fff",
                textAlign: "center",
                position: "relative"
              }}
            >
              <div
                style={{
                  width: isMobile ? "90px" : "126px",
                  height: isMobile ? "90px" : "126px",
                  fontSize: isMobile ? "38px" : "54px",
                  borderRadius: "50%",
                  margin: "0 auto 18px auto",
                  background: "rgba(255,255,255,0.15)",
                  border: "6px solid rgba(255,255,255,0.92)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)"
                }}
              >
                👤
              </div>

              <div
                style={{
                  position: "absolute",
                  right: isMobile ? "18px" : "26px",
                  top: isMobile ? "18px" : "26px",
                  backgroundColor: "rgba(255,255,255,0.18)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  padding: isMobile ? "7px 10px" : "8px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}
              >
                Active
              </div>

              {isEdit ? (
                <input
                  type="text"

                  name="username"

                  value={user.username}

                  onChange={handleChange}

                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    border: "1px solid rgba(255,255,255,0.4)",
                    outline: "none",
                    fontSize: isMobile ? "20px" : "28px",
                    fontWeight: "700",
                    color: "#fff",
                    background: "rgba(255,255,255,0.12)",
                    textAlign: "center",
                    boxSizing: "border-box",
                    backdropFilter: "blur(6px)"
                  }}
                />
              ) : (
                <h2
                  style={{
                    margin: 0,
                    fontSize: isMobile ? "24px" : "28px",
                    fontWeight: "700",
                    lineHeight: 1.2
                  }}
                >
                  {user.username}
                </h2>
              )}

              <p
                style={{
                  margin: "10px 0 0 0",
                  fontSize: isMobile ? "13px" : "14px",
                  opacity: 0.92,
                  lineHeight: "1.7"
                }}
              >
                Akun pribadi untuk mengelola informasi pengguna dan preferensi profil.
              </p>
            </div>

            <div style={{ padding: isMobile ? "18px" : "24px 24px 28px 24px" }}>
              <div
                style={{
                  display: "grid",
                  gap: "14px"
                }}
              >
                <div
                  style={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #efefef",
                    borderRadius: "18px",
                    padding: "16px 18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px"
                    }}
                  >
                    Email utama
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#222",
                      wordBreak: "break-word"
                    }}
                  >
                    {user.email}
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: "#fafafa",
                    border: "1px solid #efefef",
                    borderRadius: "18px",
                    padding: "16px 18px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px"
                    }}
                  >
                    Nomor telepon
                  </div>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#222"
                    }}
                  >
                    {user.telepon}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT CARD */}
          <div
            style={{
              backgroundColor: "#fff",
              borderRadius: isMobile ? "22px" : "28px",
              boxShadow: "0 16px 45px rgba(0,0,0,0.10)",
              border: "1px solid rgba(0,0,0,0.04)",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                padding: isMobile ? "18px 16px" : "28px 30px 18px 30px",
                borderBottom: "1px solid #efefef",
                display: "flex",
                justifyContent: "space-between",
                alignItems: isMobile ? "flex-start" : "center",
                gap: "16px",
                flexWrap: "wrap"
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "#8b0000",
                    fontWeight: "700",
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    marginBottom: "6px"
                  }}
                >
                  Detail Akun
                </div>
                <h3
                  style={{
                    margin: 0,
                    fontSize: isMobile ? "24px" : "28px",
                    fontWeight: "700",
                    color: "#171717"
                  }}
                >
                  Informasi Profil
                </h3>
              </div>

              <div
                style={{
                  backgroundColor: "#f8f1f1",
                  color: "#8b0000",
                  border: "1px solid #f0dddd",
                  padding: "10px 14px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "600"
                }}
              >
                Data dapat diperbarui
              </div>
            </div>

            <div style={{ padding: isMobile ? "18px 20px 24px 20px" : "24px 30px 30px 30px" }}>
              <div
                style={{
                  display: "grid",
                  gap: "16px"
                }}
              >
                {infoList.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: "#fbfbfb",
                      border: "1px solid #ededed",
                      borderRadius: "20px",
                      padding: isMobile ? "14px" : "18px 20px",
                      display: "grid",
                      gridTemplateColumns: isMobile ? "1fr" : "220px 1fr",
                      gap: "18px",
                      alignItems: "center"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px"
                      }}
                    >
                      <div
                        style={{
                          width: isMobile ? "36px" : "42px",
                          height: isMobile ? "36px" : "42px",
                          fontSize: isMobile ? "16px" : "18px",
                          borderRadius: "14px",
                          backgroundColor: "#f3e6e6",
                          color: "#8b0000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        }}
                      >
                        {item.icon}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            marginBottom: "4px",
                            textTransform: "uppercase",
                            letterSpacing: "0.7px"
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "#222"
                          }}
                        >
                          {item.label}
                        </div>
                      </div>
                    </div>

                    {isEdit ? (
                    <input

                      type={
                        item.key === "tanggalLahir"
                          ? "date"
                          : "text"
                      }

                      name={item.key}

                      value={user[item.key]}

                      onChange={handleChange}

                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        border: "1px solid #d8d8d8",
                        outline: "none",
                        fontSize: "14px",
                        color: "#222",
                        backgroundColor: "#fff",
                        boxSizing: "border-box"
                      }}
                    />
                    ) : (
                      <div
                        style={{
                          fontSize: "15px",
                          color: "#555",
                          lineHeight: 1.7,
                          wordBreak: "break-word"
                        }}
                      >
                        {user[item.key]}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: "26px",
                  display: "flex",
                  gap: "14px",
                  flexWrap: "wrap"
                }}
              >
                {isEdit ? (
                  <>
                    <button
                      onClick={() => {

                        if (originalUser) {
                          setUser(originalUser);
                        }

                        setIsEdit(false);

                      }}
                      style={{
                        flex: 1,
                        minWidth: isMobile ? "100%" : "180px",
                        padding: isMobile ? "13px 16px" : "15px 18px",
                        borderRadius: "16px",
                        border: "1px solid #d9d9d9",
                        backgroundColor: "#fff",
                        color: "#333",
                        fontSize: "15px",
                        fontWeight: "600",
                        cursor: "pointer"
                      }}
                    >
                      Batal
                    </button>

                    <button
                      onClick={handleSimpan}
                      disabled={loading}
                      style={{
                        flex: 1,
                        minWidth: isMobile ? "100%" : "180px",
                        padding: isMobile ? "13px 16px" : "15px 18px",
                        borderRadius: "16px",
                        border: "none",
                        background: "linear-gradient(135deg, #8b0000, #b41515)",
                        color: "#fff",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                        boxShadow: "0 10px 24px rgba(139,0,0,0.22)"
                      }}
                    >
                      {loading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    style={{
                      width: "100%",
                      padding: "15px 18px",
                      borderRadius: "16px",
                      border: "none",
                      background: "linear-gradient(135deg, #8b0000, #b41515)",
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                      cursor: loading ? "not-allowed" : "pointer",
                      boxShadow: "0 10px 24px rgba(139,0,0,0.22)"
                    }}
                  >
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;