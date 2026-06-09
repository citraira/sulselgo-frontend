import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function ResetSandi() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Konfirmasi password tidak cocok");
      return;
    }

    try {

      const response = await API.post(
        "/verify-reset-code",
        {
          email,
          code,
          newPassword
        }
      );

      const data = response.data;

      if (response.status === 200) {

        alert("Password berhasil diubah");

        navigate("/login");

      }

    } catch (err) {

      alert(
        err.response?.data?.message ||
        "Server error"
      );

    }
  };

  return (
    <div className="login-container">

      <style>{`
        .login-container *,
        .login-container *::before,
        .login-container *::after {
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
          box-shadow:
            0px 20px 40px rgba(0, 0, 0, 0.08),
            0px 8px 16px rgba(0, 0, 0, 0.06);
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

        .login-card h2 {
          font-size: 22px;
          margin-bottom: 10px;
          color: #222;
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
          margin-top: 5px;
        }

        .login-card button:hover {
          background: #6e0000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(139, 0, 0, 0.3);
        }
      `}</style>

      <div className="back" onClick={() => navigate("/login")}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Kembali</span>
      </div>

      <div className="login-card">

        <div className="close" onClick={() => navigate("/")}>
          ×
        </div>

        <div className="logo">
          <img src="https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781033400/sulselgo/logo_sulselgoo.png" alt="logo" />
        </div>

        <h2>Verifikasi Reset Password</h2>

        <p className="info-text">
          Masukkan email dan kode OTP yang dikirim ke Gmail Anda.
        </p>

        <form onSubmit={handleUpdate} autoComplete="off">

          <label>Email</label>
          <input
            type="email"
            autoComplete="off"
            placeholder="Masukkan Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Kode OTP</label>
          <input
            type="text"
            autoComplete="off"
            placeholder="Masukkan kode OTP"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <label>Password Baru</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Masukkan password baru"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <label>Konfirmasi Password</label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Konfirmasi password baru"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Simpan Password
          </button>

        </form>
      </div>
    </div>
  );
}