import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MahasiswaList from "./pages/MahasiswaList";
import Forbidden from "./pages/Forbidden";

// Komponen 404
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
      <div className="text-center max-w-md px-6">
        <h1 className="text-8xl font-bold text-amber-600 mb-4">404</h1>
        <div className="w-24 h-24 mx-auto mb-6 text-amber-600">
          <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-xl text-stone-600 mb-8">Halaman yang Anda cari tidak ditemukan</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/home"
            className="px-6 py-3 bg-gradient-to-r from-amber-600 to-emerald-600 text-white rounded-lg hover:from-amber-700 hover:to-emerald-700 transition-all duration-300 shadow-lg"
          >
            Kembali ke Home
          </a>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-white text-stone-700 rounded-lg hover:bg-stone-50 transition-all duration-300 border border-stone-200"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  console.log("App rendered, current path:", window.location.pathname);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes - semua route bisa diakses tanpa login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/home" element={<Home />} />
        <Route path="/mahasiswa" element={<MahasiswaList />} />
        <Route path="/mahasiswa/:id" element={<MahasiswaList />} />
        
        {/* Route Admin - tanpa proteksi */}
        <Route 
          path="/admin" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
              <div className="bg-white/80 backdrop-blur-lg p-8 rounded-xl shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold text-stone-800 mb-4">Halaman Admin</h1>
                <p className="text-stone-600 mb-6">Selamat datang di dashboard admin</p>
                <div className="flex gap-4">
                  <a
                    href="/home"
                    className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    Kembali ke Home
                  </a>
                  <a
                    href="/mahasiswa"
                    className="px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
                  >
                    Lihat Mahasiswa
                  </a>
                </div>
              </div>
            </div>
          } 
        />

        {/* 404 Page - harus di paling bawah */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
