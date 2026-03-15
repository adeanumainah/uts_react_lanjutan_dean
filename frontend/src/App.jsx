import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import MahasiswaList from "./pages/MahasiswaList";
import Forbidden from "./pages/Forbiden";
import ProtectedRoute from "./components/ProtectedRoute";

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
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root ke login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* Protected Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/mahasiswa" 
          element={
            <ProtectedRoute>
              <MahasiswaList />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/mahasiswa/:id" 
          element={
            <ProtectedRoute>
              <MahasiswaList />
            </ProtectedRoute>
          } 
        />

        {/* Contoh route dengan role-based access */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Halaman Admin</div>
            </ProtectedRoute>
          } 
        />

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import MahasiswaList from "./pages/MahasiswaList";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* Redirect root ke login */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* Public Routes - Tanpa proteksi */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />

//         {/* Protected Routes - Dibungkus dengan ProtectedRoute */}
//         <Route 
//           path="/home" 
//           element={
//             <ProtectedRoute>
//               <Home />
//             </ProtectedRoute>
//           } 
//         />
        
//         <Route 
//           path="/mahasiswa" 
//           element={
//             <ProtectedRoute>
//               <MahasiswaList />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Optional: Route dengan parameter ID */}
//         <Route 
//           path="/mahasiswa/:id" 
//           element={
//             <ProtectedRoute>
//               <MahasiswaList />
//             </ProtectedRoute>
//           } 
//         />

//         {/* 404 Page - Route tidak ditemukan */}
//         <Route 
//           path="*" 
//           element={
//             <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
//               <div className="text-center">
//                 <h1 className="text-6xl font-bold text-amber-600 mb-4">404</h1>
//                 <p className="text-xl text-stone-600 mb-8">Halaman tidak ditemukan</p>
//                 <a
//                   href="/home"
//                   className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
//                 >
//                   Kembali ke Home
//                 </a>
//               </div>
//             </div>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Home from "./pages/Home";
// import MahasiswaList from "./pages/MahasiswaList";
// import ProtectedRoute from "./components/ProtectedRoute";

// function App() {
//   return (
//     <BrowserRouter>

//       <Routes>

//         {/* halaman pertama */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         <Route path="/login" element={<Login />} />

//         <Route path="/register" element={<Register />} />

//         <ProtectedRoute>

//         <Route path="/home" element={<Home />} />

//         <Route path="/mahasiswa" element={<MahasiswaList />} />
// </ProtectedRoute>
//       </Routes>

//     </BrowserRouter>
//   );
// }

// export default App;