import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminParents() {
  const [parents, setParents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchParents = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/parents?page=${p}&limit=10`);
      setParents(res.data.parents || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setPage(res.data.page || 1);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchParents(); }, []);

  const handleExportCSV = async () => {
    try {
      const res = await api.get('/admin/export-csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'parents.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registered Parents</h1>
          <p className="text-sm text-gray-500">{total} total parents registered</p>
        </div>
        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition shadow-sm">
          📥 Export CSV
        </button>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : parents.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">👥</p>
          <p className="text-gray-600 font-medium">No parents registered yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-600">#</th>
                <th className="pb-3 font-semibold text-gray-600">Name</th>
                <th className="pb-3 font-semibold text-gray-600">Email</th>
                <th className="pb-3 font-semibold text-gray-600">Phone</th>
                <th className="pb-3 font-semibold text-gray-600">Registered</th>
              </tr>
            </thead>
            <tbody>
              {parents.map((p, i) => (
                <tr key={p._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{(page - 1) * 10 + i + 1}</td>
                  <td className="py-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 text-gray-600">{p.email}</td>
                  <td className="py-3 text-gray-600">{p.phone || '—'}</td>
                  <td className="py-3 text-gray-500">{new Date(p.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => fetchParents(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => fetchParents(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
