import { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const change = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post("/login", form);
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error);
      // Tambahkan handling error disini
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-amber-100 via-stone-200 to-emerald-100">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-stone-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0">
        <svg className="absolute bottom-0 left-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path fill="rgba(180, 83, 9, 0.1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl mb-4">
            <svg className="w-12 h-12 text-amber-800" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-stone-800">Selamat Datang</h1>
          <p className="text-stone-600 mt-2">Silakan login untuk melanjutkan</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={submit} className="space-y-6">
            <h2 className="text-2xl font-semibold text-stone-800 mb-6">Login</h2>

            <div className="space-y-4">
              {/* Username Input */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    name="username"
                    placeholder="Masukkan username"
                    value={form.username}
                    onChange={change}
                    className="w-full pl-10 pr-3 py-3 border border-stone-300/50 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition duration-200 placeholder-stone-400"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={change}
                    className="w-full pl-10 pr-3 py-3 border border-stone-300/50 rounded-xl bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition duration-200 placeholder-stone-400"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-stone-300 text-amber-600 focus:ring-amber-500" />
                <span className="ml-2 text-sm text-stone-600">Ingat saya</span>
              </label>
              <a href="#" className="text-sm text-amber-700 hover:text-amber-800 transition duration-200">
                Lupa password?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-amber-700 to-stone-700 text-white py-3 px-4 rounded-xl hover:from-amber-800 hover:to-stone-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transform transition duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium shadow-lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </span>
              ) : (
                "Login"
              )}
            </button>

            {/* Register Link */}
            <p className="text-center text-sm text-stone-600">
              Belum punya akun?{" "}
              <Link to="/register" className="font-medium text-amber-700 hover:text-amber-800 transition duration-200">
                Daftar sekarang
              </Link>
            </p>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-stone-500 mt-6">
          © 2026 adeana. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Login;