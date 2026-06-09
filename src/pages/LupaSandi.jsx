import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function LupaSandi() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false); // State untuk melacak apakah instruksi sudah dikirim

const handleReset = async (e) => {
    e.preventDefault();
    
    try {

      const response = await API.post(
        "/forgot-password",
        {
          email
        }
      );

      const data = response.data;

      if (response.status === 200) {
        setIsSent(true);
      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Gagal terhubung ke server"
      );

    }
  };

  return (
    <div className="login-container">
      <style>{`
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
          box-shadow: 
            0px 20px 40px rgba(0, 0, 0, 0.08),
            0px 8px 16px rgba(0, 0, 0, 0.06);
          position: relative;
          text-align: center;
        }

        .login-card .logo {
          margin-bottom: 20px;
        }

        .login-card .logo img {
          width: 80px;
        }

        .login-card h2 {
          font-size: 20px;
          color: #1a1a1a;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .login-card .info-text {
          font-size: 13px;
          color: #666;
          margin-bottom: 25px;
          line-height: 1.5;
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
          margin-bottom: 20px;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          font-size: 14px;
          outline: none;
          transition: 0.3s;
        }

        .login-card input:focus {
          border: 1px solid #8b0000;
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

        .login-card .back-to-login {
          font-size: 13px;
          margin-top: 20px;
          color: #8b0000;
          font-weight: 600;
          cursor: pointer;
          display: inline-block;
        }
      `}</style>

      {/* TOMBOL BACK KE LOGIN */}
      <div className="back" onClick={() => navigate("/login")}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Kembali</span>
      </div>

      <div className="login-card">
        <div className="logo">
          <img src="https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781033400/sulselgo/logo_sulselgoo.png" alt="logo" />
        </div>

        {/* TAMPILAN BERUBAH BERDASARKAN APAKAH EMAIL SUDAH TERKIRIM */}
        {!isSent ? (
          <>
            <h2>Lupa Kata Sandi?</h2>
            <p className="info-text">
              Masukkan email yang terdaftar. Kami akan mengirimkan instruksi untuk mengatur ulang kata sandi Anda.
            </p>

            <form onSubmit={handleReset}>
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Contoh: citra@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button type="submit">Kirim Instruksi</button>
            </form>
          </>
        ) : (
          <>
            <h2>Masukkan Kode OTP</h2>

            <p className="info-text">
              Kode reset password telah dikirim ke
              <b> {email} </b>.
              Silakan cek Gmail Anda lalu lanjutkan
              verifikasi kode OTP untuk membuat
              password baru.
            </p>

            <button onClick={() => navigate("/reset-sandi")}>
              Verifikasi Kode
            </button>
          </>
        )}

        <p className="back-to-login" onClick={() => navigate("/login")}>
          Kembali ke halaman Masuk
        </p>
      </div>
    </div>
  );
}