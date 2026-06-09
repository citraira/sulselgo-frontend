import React, { useState } from "react"; // Tambahkan useState
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function Login({ setIsLogin }) {
  const navigate = useNavigate();

  // Logika Backend: State untuk menampung input user
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Logika Backend: Fungsi untuk memverifikasi login ke database
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {

      const response = await API.post("/login", {
        username,
        password
      });

      const data = response.data;

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      localStorage.setItem(
        "token",
        data.token
      );

      setIsLogin(true);

      alert("Selamat Datang di SULSELGO!");

      navigate("/");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal login"
      );

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="login-container">
      {/* KODE CSS GABUNGAN (TETAP SAMA) */}
      <style>{`
        /* ===== RESET GLOBAL ===== */
        .login-container *, .login-container *::before, .login-container *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }

        .login-container {
          height: 100vh;
          width: 100%;
          background: #f5f5f5;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          z-index: 1000;
        }

        .login-container .back {
          position: absolute;
          top: 25px;
          left: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 50px;
          background: white;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          transition: 0.3s;
          color: #333;
          z-index: 10;
        }

        .login-container .back:hover {
          background: #fff;
          transform: translateX(-5px);
          color: #8b0000;
          box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        }

        .login-container .back span {
          font-size: 14px;
          font-weight: 600;
        }

        .login-card {
          width: 380px;
          background: #fff;
          padding: 35px 30px;
          border-radius: 20px;
          box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.08), 0px 8px 16px rgba(0, 0, 0, 0.06);
          position: relative;
          text-align: center;
        }

        .login-card .close {
          position: absolute;
          right: 18px;
          top: 15px;
          font-size: 22px;
          cursor: pointer;
          color: #999;
          transition: 0.3s;
        }

        .login-card .close:hover {
          color: #333;
        }

        .login-card .logo {
          margin-bottom: 25px;
        }

        .login-card .logo img {
          width: 90px;
        }

        .login-card form {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .login-card label {
          font-size: 14px;
          font-weight: 500;
          color: #444;
          margin-bottom: 6px;
        }

        .login-card input {
          width: 100%;
          padding: 12px;
          margin-bottom: 16px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
          transition: 0.3s;
        }

        .login-card input:focus {
          border: 1px solid #8b0000;
          background: #fffcfc;
        }

        .login-card .forgot {
          font-size: 12px;
          color: #8b0000;
          margin-bottom: 20px;
          cursor: pointer;
          font-weight: 500;
          align-self: flex-start;
        }

        .login-card button {
          width: 100%;
          padding: 14px;
          background: #8b0000;
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .login-card button:hover {
          background: #6e0000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 0, 0, 0.3);
        }

        .login-card .register {
          font-size: 13px;
          margin-top: 18px;
          color: #666;
        }

        .login-card .register span {
          color: #8b0000;
          font-weight: bold;
          cursor: pointer;
        }

        .login-card button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>

      {/* TOMBOL BACK SERAGAM */}
      <div className="back" onClick={() => navigate("/")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Kembali</span>
      </div>

      <div className="login-card">
        <div className="close" onClick={() => navigate("/")}>×</div>

        <div className="logo">
          <img src="https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781033400/sulselgo/logo_sulselgoo.png" alt="logo" />
        </div>

        {/* Form dihubungkan ke handleLogin */}
        <form onSubmit={handleLogin} autoComplete="off">
          <label>Username</label>
          <input 
            type="text"
            autoComplete="off"
            placeholder="Masukkan Username" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        
          <label>Kata sandi</label>

          <div style={{ position: "relative" }}>

            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Masukkan Kata sandi"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                paddingRight: "45px"
              }}
            />

            <button
              type="button"
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
              onTouchStart={() => setShowPassword(true)}
              onTouchEnd={() => setShowPassword(false)}
              style={{
                position: "absolute",
                top: "40%",
                right: "12px",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                width: "auto",
                margin: 0,
                boxShadow: "none"
              }}
            >

              {showPassword ? (

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20C7 20 2.73 16.11 1 12c.92-2.18 2.36-4.02 4.1-5.36"></path>
                  <path d="M9.9 4.24A10.94 10.94 0 0 1 12 4c5 0 9.27 3.89 11 8a11.05 11.05 0 0 1-2.16 3.19"></path>
                  <path d="M1 1l22 22"></path>
                  <path d="M9.53 9.53a3 3 0 0 0 4.24 4.24"></path>
                </svg>

              ) : (

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#666"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>

              )}

            </button>

          </div>

          <p className="forgot" onClick={() => navigate("/lupa-sandi")}>
            Lupa sandi?
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="register">
            Belum punya akun?{" "}
            <span onClick={() => navigate("/register")}>Daftar</span>
          </p>
        </form>
      </div>
    </div>
  );
}