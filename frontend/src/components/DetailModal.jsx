function DetailModal({ mahasiswa, onClose }) {
  if (!mahasiswa) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full border border-white/20 transform transition-all animate-slide-up">
          {/* Header */}
          <div className="bg-linear-to-r from-amber-600 to-stone-600 rounded-t-2xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">Detail Mahasiswa</h3>
              <button
                onClick={onClose}
                className="text-white/80 hover:text-white transition duration-200 hover:rotate-90 transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-amber-600 to-stone-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                {mahasiswa.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-bold text-stone-800">{mahasiswa.name}</h4>
                <p className="text-stone-600">{mahasiswa.nim}</p>
              </div>
            </div>

            <div className="space-y-4">
              <DetailRow label="Nama Lengkap" value={mahasiswa.name} />
              <DetailRow label="NIM" value={mahasiswa.nim} />
              <DetailRow label="Jurusan" value={mahasiswa.jurusan} />
              <DetailRow label="IPK" value={parseFloat(mahasiswa.ipk).toFixed(2)} />
              <DetailRow 
                label="Status" 
                value={
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    mahasiswa.isactive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {mahasiswa.isactive ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                } 
              />
              {mahasiswa.alamat && <DetailRow label="Alamat" value={mahasiswa.alamat} />}
              {mahasiswa.email && <DetailRow label="Email" value={mahasiswa.email} />}
              {mahasiswa.noHp && <DetailRow label="No. HP" value={mahasiswa.noHp} />}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-stone-200/50 p-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition duration-200"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center py-2 border-b border-stone-200/50 last:border-0">
      <span className="text-sm font-medium text-stone-600 sm:w-32">{label}</span>
      <span className="text-stone-800 sm:flex-1">{value}</span>
    </div>
  );
}

export default DetailModal;