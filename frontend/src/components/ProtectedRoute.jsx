// import { Navigate } from "react-router-dom";
// import { useState, useEffect } from "react";
// import api from "../services/api";

// const ProtectedRoute = ({ children, requiredRole = null }) => {
//   const [authState, setAuthState] = useState({
//     isAuthenticated: null,
//     user: null,
//     loading: true
//   });

//   useEffect(() => {
//     checkAuth();
//   }, []);

//   const checkAuth = async () => {
//     try {
//       const response = await api.get("/check-auth");
//       console.log("Auth response:", response.data); // Untuk debugging
//       setAuthState({
//         isAuthenticated: true,
//         user: response.data.user,
//         loading: false
//       });
//     } catch (error) {
//       console.log("Not authenticated:", error.response?.data || error.message);
//       setAuthState({
//         isAuthenticated: false,
//         user: null,
//         loading: false
//       });
//     }
//   };

//   if (authState.loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-emerald-50">
//         <div className="text-center">
//           <div className="relative">
//             <div className="w-20 h-20 border-4 border-amber-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4"></div>
//             <div className="w-12 h-12 border-4 border-emerald-200 border-b-emerald-600 rounded-full animate-spin mx-auto absolute inset-0 m-auto"></div>
//           </div>
//           <p className="text-stone-600 font-medium">Memverifikasi akses...</p>
//           <p className="text-sm text-stone-400 mt-2">Mohon tunggu sebentar</p>
//         </div>
//       </div>
//     );
//   }

//   // Jika tidak terautentikasi, redirect ke login
//   if (!authState.isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   // Jika ada requiredRole dan user tidak memiliki role yang sesuai
//   if (requiredRole && authState.user?.role !== requiredRole) {
//     // Redirect ke halaman forbidden (perbaiki ejaan)
//     return <Navigate to="/forbidden" replace />;
//   }

//   // Jika semua ok, render children
//   return children;
// };

// export default ProtectedRoute;