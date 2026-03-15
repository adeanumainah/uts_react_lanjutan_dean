import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import Swal from 'sweetalert2';
import DetailModal from "../components/DetailModal";
import EditModal from "../components/EditModal";
import AddModal from "../components/AddModal";

function MahasiswaList() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const getData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/mahasiswa");
      // Pastikan data yang diterima adalah array
      const mahasiswaData = Array.isArray(res.data) ? res.data : [];
      setData(mahasiswaData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Gagal mengambil data mahasiswa!',
        background: '#fff5e6',
        confirmButtonColor: '#b45309',
        timer: 2000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Fungsi untuk handle detail
  const handleDetail = (mahasiswa) => {
    console.log("Detail clicked:", mahasiswa); // Untuk debugging
    setSelectedMahasiswa(mahasiswa);
    setShowDetailModal(true);
  };

  // Fungsi untuk handle edit
  const handleEdit = (mahasiswa) => {
    console.log("Edit clicked:", mahasiswa); // Untuk debugging
    setSelectedMahasiswa(mahasiswa);
    setShowEditModal(true);
  };

  // Fungsi untuk handle delete
  const deleteData = async (id) => {
    const result = await Swal.fire({
      title: 'Apakah Anda yakin?',
      text: "Data mahasiswa akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#b45309',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: '#fff5e6',
    });

    if (result.isConfirmed) {
      try {
        await api.delete("/mahasiswa/" + id);
        await getData(); // Refresh data setelah hapus
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data mahasiswa berhasil dihapus',
          background: '#fff5e6',
          confirmButtonColor: '#b45309',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (error) {
        console.error("Error deleting data:", error);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Data mahasiswa gagal dihapus',
          background: '#fff5e6',
          confirmButtonColor: '#b45309'
        });
      }
    }
  };

  // Fungsi untuk handle success update
  const handleUpdateSuccess = () => {
    getData(); // Refresh data
    setShowEditModal(false);
    setSelectedMahasiswa(null);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data mahasiswa berhasil diperbarui',
      background: '#fff5e6',
      confirmButtonColor: '#b45309',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Fungsi untuk handle success add
  const handleAddSuccess = () => {
    getData(); // Refresh data
    setShowAddModal(false);
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Data mahasiswa berhasil ditambahkan',
      background: '#fff5e6',
      confirmButtonColor: '#b45309',
      timer: 1500,
      showConfirmButton: false
    });
  };

  // Fungsi untuk sorting
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Sorting data
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    if (sortConfig.key === 'ipk') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Filter data
  const filtered = sortedData
    .filter((m) => {
      if (!m) return false;
      if (filter === "active") return m.isactive === true;
      if (filter === "inactive") return m.isactive === false;
      if (filter === "cumlaude") return parseFloat(m.ipk) >= 3.7;
      return true;
    })
    .filter((m) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (m.name?.toLowerCase() || '').includes(searchLower) ||
        (m.nim?.toLowerCase() || '').includes(searchLower) ||
        (m.jurusan?.toLowerCase() || '').includes(searchLower)
      );
    });

  // Hitung statistik
  const total = data.length;
  const totalIpk = data.reduce((sum, m) => sum + (parseFloat(m.ipk) || 0), 0);
  const avg = total > 0 ? totalIpk / total : 0;
  const aktif = data.filter(m => m.isactive === true).length;
  const cumlaude = data.filter(m => parseFloat(m.ipk) >= 3.7).length;

  // Komponen icon sorting
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) {
      return (
        <svg className="w-4 h-4 ml-1 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/>
        </svg>
      );
    }
    return sortConfig.direction === 'asc' 
      ? (
        <svg className="w-4 h-4 ml-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"/>
        </svg>
      )
      : (
        <svg className="w-4 h-4 ml-1 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
        </svg>
      );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-amber-50 via-orange-50 to-emerald-50">
      <Navbar />
      
      {/* Header dengan Statistik Ringkas */}
      <div className="pt-20 pb-8 bg-linear-to-r from-amber-600 via-stone-600 to-emerald-600 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">📋 Data Mahasiswa</h1>
              <p className="text-amber-100">Kelola, pantau, dan analisis data mahasiswa dengan mudah</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="group relative px-6 py-3 bg-white text-amber-600 rounded-xl font-semibold shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Tambah Mahasiswa
              </span>
            </button>
          </div>

          {/* Mini Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Total</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Rata-rata IPK</p>
              <p className="text-2xl font-bold">{avg.toFixed(2)}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Aktif</p>
              <p className="text-2xl font-bold">{aktif}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-90">Cumlaude</p>
              <p className="text-2xl font-bold">{cumlaude}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6 mb-8 border border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Search Bar */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-500">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIM, atau jurusan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === "all" 
                    ? "bg-stone-600 text-white shadow-lg" 
                    : "bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
              >
                Semua
                {filter === "all" && <span className="ml-2">✓</span>}
              </button>
              <button
                onClick={() => setFilter("active")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === "active" 
                    ? "bg-green-600 text-white shadow-lg" 
                    : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                }`}
              >
                Aktif
                {filter === "active" && <span className="ml-2">✓</span>}
              </button>
              <button
                onClick={() => setFilter("inactive")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === "inactive" 
                    ? "bg-red-600 text-white shadow-lg" 
                    : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                }`}
              >
                Tidak Aktif
                {filter === "inactive" && <span className="ml-2">✓</span>}
              </button>
              <button
                onClick={() => setFilter("cumlaude")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 ${
                  filter === "cumlaude" 
                    ? "bg-amber-600 text-white shadow-lg" 
                    : "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                }`}
              >
                Cumlaude
                {filter === "cumlaude" && <span className="ml-2">✓</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-lg p-6 animate-pulse">
                <div className="grid grid-cols-6 gap-4">
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                  <div className="h-6 bg-stone-200 rounded col-span-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-xl overflow-hidden border border-white/20">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-amber-100 to-emerald-100">
                  <tr>
                    {[
                      { key: 'name', label: 'Nama' },
                      { key: 'nim', label: 'NIM' },
                      { key: 'jurusan', label: 'Jurusan' },
                      { key: 'ipk', label: 'IPK' },
                      { key: 'isactive', label: 'Status' },
                      { key: null, label: 'Aksi' }
                    ].map((col) => (
                      <th 
                        key={col.label}
                        className="p-4 text-left text-stone-700 font-semibold cursor-pointer hover:bg-white/30 transition-colors"
                        onClick={() => col.key && handleSort(col.key)}
                      >
                        <div className="flex items-center">
                          {col.label}
                          {col.key && <SortIcon column={col.key} />}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((m, index) => (
                    <tr 
                      key={m.id} 
                      className={`border-t border-stone-200/50 hover:bg-amber-50/50 transition-all duration-150 ${
                        index % 2 === 0 ? 'bg-white/40' : 'bg-stone-50/40'
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-linear-to-br from-amber-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {m.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-stone-800">{m.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-stone-600">{m.nim}</span>
                      </td>
                      <td className="p-4 text-stone-600">{m.jurusan}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          parseFloat(m.ipk) >= 3.7 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : parseFloat(m.ipk) >= 3.0 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-stone-100 text-stone-800 border border-stone-200'
                        }`}>
                          {parseFloat(m.ipk).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                          m.isactive 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${m.isactive ? 'bg-green-600' : 'bg-red-600'} animate-pulse`}></span>
                          {m.isactive ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleDetail(m)}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                            title="Lihat Detail"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(m)}
                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                            title="Edit Data"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteData(m.id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all duration-200 transform hover:scale-110 hover:shadow-md"
                            title="Hapus Data"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-20 h-20 text-stone-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl text-stone-600 mb-2">Tidak ada data mahasiswa</p>
                <p className="text-stone-500">Coba ubah filter atau kata kunci pencarian</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showDetailModal && selectedMahasiswa && (
        <DetailModal
          mahasiswa={selectedMahasiswa}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMahasiswa(null);
          }}
        />
      )}

      {showEditModal && selectedMahasiswa && (
        <EditModal
          mahasiswa={selectedMahasiswa}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMahasiswa(null);
          }}
          onSuccess={handleUpdateSuccess}
        />
      )}

      {showAddModal && (
        <AddModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}

export default MahasiswaList;