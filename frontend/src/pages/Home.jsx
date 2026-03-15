import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    avgIpk: 0,
    cumlaude: 0,
    active: 0,
    inactive: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get("/mahasiswa");
      const data = res.data;
      
      const total = data.length;
      const totalIpk = data.reduce((sum, m) => sum + (parseFloat(m.ipk) || 0), 0);
      const avgIpk = total > 0 ? totalIpk / total : 0;
      const cumlaude = data.filter(m => parseFloat(m.ipk) >= 3.7).length;
      const active = data.filter(m => m.isactive).length;
      const inactive = data.filter(m => !m.isactive).length;
      
      setStats({ total, avgIpk, cumlaude, active, inactive });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, bgColor, textColor, delay }) => (
    <div 
      className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-stone-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold text-stone-800 mt-2">
            {loading ? (
              <div className="animate-pulse h-8 w-16 bg-stone-200 rounded"></div>
            ) : (
              typeof value === 'number' && value.toFixed ? value.toFixed(2) : value
            )}
          </p>
        </div>
        <div className={`${bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
          <div className={`w-8 h-8 ${textColor}`}>
            {icon}
          </div>
        </div>
      </div>
      <div className="mt-4 h-1 w-full bg-stone-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${bgColor.replace('100', '500')} transition-all duration-1000`}
          style={{ width: loading ? '0%' : '100%' }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-emerald-50">
      <Navbar />
      
      {/* Hero Section dengan Design Baru */}
      <div className="relative pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float animation-delay-2000"></div>
        </div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block animate-bounce-slow mb-6">
              <span className="bg-linear-to-r from-amber-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                🎓 Sistem Manajemen Akademik
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-stone-800 mb-6 animate-fade-in-up">
              Selamat Datang di
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-amber-600 to-emerald-600">
                EduManage
              </span>
            </h1>
            
            <p className="text-xl text-stone-600 mb-12 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
              Kelola data mahasiswa dengan mudah, pantau perkembangan akademik, 
              dan analisis performa secara real-time dalam satu platform terintegrasi.
            </p>

            <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
              <Link
                to="/mahasiswa"
                className="group relative px-8 py-4 bg-linear-to-r from-amber-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Lihat Data Mahasiswa</span>
                <div className="absolute inset-0 bg-linear-to-r from-amber-700 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/mahasiswa/add"
                className="group px-8 py-4 bg-white text-stone-700 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-amber-200 hover:border-amber-300"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Tambah Mahasiswa
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards dengan Design Grid yang Menarik */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Mahasiswa"
            value={stats.total}
            icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-1 .05 1.16.84 2 1.87 2 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>}
            bgColor="bg-amber-100"
            textColor="text-amber-600"
            delay={100}
          />
          
          <StatCard
            title="Rata-rata IPK"
            value={stats.avgIpk}
            icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>}
            bgColor="bg-emerald-100"
            textColor="text-emerald-600"
            delay={200}
          />
          
          <StatCard
            title="Mahasiswa Aktif"
            value={stats.active}
            icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
            bgColor="bg-green-100"
            textColor="text-green-600"
            delay={300}
          />
          
          <StatCard
            title="Cumlaude"
            value={stats.cumlaude}
            icon={<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 9H22L16 14L19 21L12 16.5L5 21L8 14L2 9H9L12 2Z"/></svg>}
            bgColor="bg-amber-100"
            textColor="text-amber-600"
            delay={400}
          />
        </div>
      </div>

      {/* Fitur Unggulan */}
      <div className="bg-white/50 backdrop-blur-sm py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-stone-800 mb-12">
            Kenapa Memilih EduManage?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "📊",
                title: "Manajemen Data Mudah",
                description: "Kelola data mahasiswa dengan interface yang intuitif dan user-friendly"
              },
              {
                icon: "📈",
                title: "Analisis Real-time",
                description: "Pantau perkembangan akademik dengan statistik dan grafik real-time"
              },
              {
                icon: "🔒",
                title: "Keamanan Terjamin",
                description: "Data mahasiswa aman dengan sistem keamanan berlapis"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 text-center"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-stone-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="bg-linear-to-r from-amber-600 to-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-white rounded-full"></div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">
              Siap Mengelola Data Mahasiswa dengan Lebih Baik?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Mulai kelola data mahasiswa sekarang juga dengan platform kami
            </p>
            <Link
              to="/mahasiswa"
              className="inline-block bg-white text-amber-600 px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;