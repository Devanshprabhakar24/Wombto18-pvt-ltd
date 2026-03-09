import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminChildren() {
  const [children, setChildren] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/children?page=${p}&limit=10`);
      setChildren(res.data.children || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
      setPage(res.data.page || 1);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchChildren(); }, []);

  const getAge = (dob) => {
    const now = new Date();
    const birth = new Date(dob);
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    if (months >= 12) {
      const y = Math.floor(months / 12);
      const m = months % 12;
      return `${y}y ${m}m`;
    }
    return `${months}m`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registered Children</h1>
        <p className="text-sm text-gray-500">{total} total children in the system</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : children.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">👶</p>
          <p className="text-gray-600 font-medium">No children registered yet</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-600">#</th>
                <th className="pb-3 font-semibold text-gray-600">Child Name</th>
                <th className="pb-3 font-semibold text-gray-600">Gender</th>
                <th className="pb-3 font-semibold text-gray-600">Age</th>
                <th className="pb-3 font-semibold text-gray-600">DOB</th>
                <th className="pb-3 font-semibold text-gray-600">Parent</th>
                <th className="pb-3 font-semibold text-gray-600">Parent Email</th>
                <th className="pb-3 font-semibold text-gray-600">Vaccines Done</th>
              </tr>
            </thead>
            <tbody>
              {children.map((c, i) => (
                <tr key={c._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 text-gray-400">{(page - 1) * 10 + i + 1}</td>
                  <td className="py-3 font-medium text-gray-800">{c.name}</td>
                  <td className="py-3 text-gray-600 capitalize">{c.gender || '—'}</td>
                  <td className="py-3 text-gray-600">{getAge(c.dob)}</td>
                  <td className="py-3 text-gray-500">{new Date(c.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="py-3 text-gray-600">{c.parentId?.name || '—'}</td>
                  <td className="py-3 text-gray-500">{c.parentId?.email || '—'}</td>
                  <td className="py-3">
                    <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                      {c.completedVaccines?.length || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => fetchChildren(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => fetchChildren(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
