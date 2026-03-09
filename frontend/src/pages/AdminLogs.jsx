import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/activity-logs?page=${p}&limit=20`);
      setLogs(res.data.logs || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
        <p className="text-sm text-gray-500">System audit trail</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Loading...</div>
      ) : logs.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">📝</p>
          <p className="text-gray-600 font-medium">No activity logs yet</p>
          <p className="text-sm text-gray-400 mt-1">Actions will be logged here as users interact with the system</p>
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-600">User</th>
                <th className="pb-3 font-semibold text-gray-600">Action</th>
                <th className="pb-3 font-semibold text-gray-600">Resource</th>
                <th className="pb-3 font-semibold text-gray-600">Details</th>
                <th className="pb-3 font-semibold text-gray-600">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 font-medium text-gray-800">{log.userId?.name || 'System'}</td>
                  <td className="py-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-gray-100 text-gray-700">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 text-gray-600">{log.resource || '—'}</td>
                  <td className="py-3 text-gray-500 text-xs max-w-[200px] truncate">{log.details || '—'}</td>
                  <td className="py-3 text-gray-500 text-xs">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => fetchLogs(page - 1)} disabled={page <= 1} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => fetchLogs(page + 1)} disabled={page >= totalPages} className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
