import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useLocation } from "react-router-dom";

const KategoriPage = () => {
  const navigate = useNavigate();
  const [destinasiList, setDestinasiList] = useState([]);
  const location = useLocation();

  const [selectedKategori, setSelectedKategori] = useState(
  location.state?.selectedKategori || null
);

  useEffect(() => {

    API.get("/destinasi")
      .then((res) => {

        const data = res.data;

        setDestinasiList(data);

      })
      .catch((err) =>
        console.error(
          "Gagal mengambil data:",
          err
        )
      );

  }, []);

  const kategoriData = [ 
    { n: 'Wisata Alam Darat', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781029572/sulselgo/gnskugjrlyhtsy9mmkzc.png' }, 
    { n: 'Wisata Budaya & Sejarah', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781029587/sulselgo/ehbl3jym81bijz3rtz8n.png' },
    { n: 'Wisata Hiburan', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781029599/sulselgo/s0v74ux2ai25vjazckqr.png' }, 
    { n: 'Wisata Laut & Pesisir', i: 'https://res.cloudinary.com/dnxo5qbrg/image/upload/f_auto,q_auto,w_800/v1781029611/sulselgo/a6vmem84ipn5di7g4znf.png' }
  ];

  // Data yang sudah difilter berdasarkan kategori yang diklik
  const filteredDestinasi = destinasiList.filter(item => item.kategori === selectedKategori);

  // Jika kategori dipilih, tampilkan halaman daftar destinasi (seperti di gambar)
  if (selectedKategori) {
    return (
      <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '100px', paddingLeft: '6%', paddingRight: '6%' }}>
        {/* BACK BUTTON BARU */}
        <button
          onClick={() => setSelectedKategori(null)}
          style={{
            position: 'absolute',
            top: '95px',
            left: '6%',
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

        {/* JUDUL */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            margin: 0
          }}>
            {selectedKategori}
          </h1>
        </div>

        {/* GRID DAFTAR DESTINASI SESUAI GAMBAR */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '25px' 
        }}>
          {filteredDestinasi.length > 0 ? (
            filteredDestinasi.map((item) => (
              <div 
                key={item._id} 
                onClick={() =>
                  navigate('/detail', {
                    state: {
                      ...item,
                      returnKategori: selectedKategori
                    }
                  })
                }
                style={{
                  height: '400px', borderRadius: '20px', overflow: 'hidden', position: 'relative',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)', cursor: 'pointer'
                }}
              >
                <img src={item.gambar} alt={item.nama} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                  padding: '20px', color: '#fff'
                }}>
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', fontWeight: '700' }}>{item.nama}</h3>
                  <p style={{ margin: 0, fontSize: '12px', opacity: 0.9, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {item.deskripsiSingkat}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>Belum ada destinasi untuk kategori ini.</p>
          )}
        </div>
      </div>
    );
  }

 // Tampilan Awal (Grid 4 Kategori)
return (
  <div style={{ backgroundColor: '#fff', minHeight: '100vh', paddingTop: '70px' }}>

    <div style={{
      height: '350px',
      width: '100%',
      backgroundImage: "url('https://res.cloudinary.com/dnxo5qbrg/image/upload/v1781027521/sulselgo/dpdmbu1yrbmiqyxmcpho.png')",
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative'
    }}>

      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
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

    </div>

    {/* TITLE */}
    <div style={{ textAlign: 'center', padding: '40px 10% 20px' }}>
      <h1 style={{
        fontSize: '24px',
        fontWeight: '700',
        color: '#1a1a1a'
      }}>
        Kategori Perjalanan
      </h1>
    </div>
      
      <div style={{ margin: '0 auto 50px', width: '90%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
        {kategoriData.map((k, idx) => (
          <div key={idx} onClick={() => setSelectedKategori(k.n)} style={{
            aspectRatio: '1 / 1', borderRadius: '15px', overflow: 'hidden', position: 'relative',
            border: '3px solid #fff', boxShadow: '0 8px 20px rgba(0,0,0,0.15)', cursor: 'pointer'
          }}>
            <img src={k.i} alt={k.n} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '15px 12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', color: '#fff', fontWeight: '600', fontSize: '14px' }}>
              {k.n}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KategoriPage;