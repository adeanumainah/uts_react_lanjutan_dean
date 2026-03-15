import { useState, useEffect } from "react";
import api from "../services/api";

function EditModal({ mahasiswa, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    nim: "",
    jurusan: "",
    ipk: "",
    isactive: false,
    alamat: "",
    email: "",
    noHp: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mahasiswa) {
      setForm({
        name: mahasiswa.name || "",
        nim: mahasiswa.nim || "",
        jurusan: mahasiswa.jurusan || "",
        ipk: mahasiswa.ipk || "",
        isactive: mahasiswa.isactive || false,
        alamat: mahasiswa.alamat || "",
        email: mahasiswa.email || "",
        noHp: mahasiswa.noHp || ""
      });
    }
  }, [mahasiswa]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({
      ...form,
      [e.target.name]: value
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Nama harus diisi";
    if (!form.nim) newErrors.nim = "NIM harus diisi";
    if (!form.jurusan) newErrors.jurusan = "Jurusan harus diisi";
    if (!form.ipk) newErrors.ipk = "IPK harus diisi";
    if (form.ipk && (form.ipk < 0 || form.ipk > 4)) {
      newErrors.ipk = "IPK harus antara 0 - 4";
    }
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email tidak valid";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await api.put(`/mahasiswa/${mahasiswa.id}`, form);
      onSuccess();
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!mahasiswa) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full border border-white/20 animate-slide-up">
          {/* Header */}
          <div className="bg-linear-to-r from-amber-600 to-stone-600 rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Edit Data Mahasiswa</h3>
              </div>
              <button 
                onClick={onClose} 
                className="text-white/80 hover:text-white transition-all duration-200 hover:rotate-90 transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : 'border-stone-200'} rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200`}
                  placeholder="Masukkan nama lengkap"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  NIM <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nim"
                  value={form.nim}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.nim ? 'border-red-300' : 'border-stone-200'} rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200`}
                  placeholder="Contoh: 2021001"
                />
                {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Jurusan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jurusan"
                  value={form.jurusan}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.jurusan ? 'border-red-300' : 'border-stone-200'} rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200`}
                  placeholder="Contoh: Teknik Informatika"
                />
                {errors.jurusan && <p className="text-red-500 text-xs mt-1">{errors.jurusan}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  IPK <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  name="ipk"
                  value={form.ipk}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${errors.ipk ? 'border-red-300' : 'border-stone-200'} rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-200`}
                  placeholder="0.00 - 4.00"
                />
                {errors.ipk && <p className="text-red-500 text-xs mt-1">{errors.ipk}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 p-4 bg-stone-50 rounded-lg cursor-pointer hover:bg-stone-100 transition-colors">
                  <input
                    type="checkbox"
                    name="isactive"
                    checked={form.isactive}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    Mahasiswa Aktif
                  </span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-stone-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-100 transition-all duration-200 transform hover:scale-105"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-linear-to-r from-amber-600 to-stone-600 text-white rounded-lg hover:from-amber-700 hover:to-stone-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Perubahan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditModal;