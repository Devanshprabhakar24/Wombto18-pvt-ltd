import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminReminders() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [sending, setSending] = useState(false);

  const fetchLogs = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reminder-logs?page=${p}&limit=20`);
      setLogs(res.data.logs || []);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || 1);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const handleStatusUpdate = async (logId, newStatus) => {
    setUpdating(logId);
    try {
      await api.patch(`/admin/reminder-status/${logId}`, { status: newStatus });
      setLogs(prev => prev.map(l => l._id === logId ? { ...l, status: newStatus } : l));
    } catch { /* empty */ }
    setUpdating(null);
  };

  const handleSendManualReminder = async () => {
    if (!window.confirm('Send email reminder for next due vaccine to all parents?')) return;
    setSending(true);
    try {
      const res = await api.post('/admin/send-reminder');
      alert('Email reminders sent to ' + (res.data.count || 0) + ' parent(s) for their next vaccine.');
      fetchLogs(1);
    } catch {
      alert('Failed to send reminders.');
    }
    setSending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reminder Management</h1>
          <p className="text-sm text-gray-500">View, send, and update reminder statuses</p>
        </div>
        <button
          onClick={handleSendManualReminder}
          disabled={sending}
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold hover:bg-yellow-600 transition shadow-sm disabled:opacity-50"
        >
          {sending ? '⏳ Sending...' : '� Send Email Reminder'}
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg mb-4">
          <span className="text-2xl">�</span>
          <div>
            <p className="text-sm font-medium text-yellow-800">Email Reminder for Next Vaccine</p>
            <p className="text-xs text-yellow-700">
              Sends an email to each parent about their child's next due vaccine.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading reminder logs...</div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">🔔</p>
            <p className="text-gray-600 font-medium">No reminder logs yet</p>
            <p className="text-sm text-gray-400 mt-1">Reminders will appear here when sent via the API or cron scheduler</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-gray-600">Parent</th>
                <th className="pb-3 font-semibold text-gray-600">Vaccine</th>
                <th className="pb-3 font-semibold text-gray-600">Status</th>
                <th className="pb-3 font-semibold text-gray-600">Timestamp</th>
                <th className="pb-3 font-semibold text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log._id} className="border-b last:border-none hover:bg-gray-50">
                  <td className="py-3 text-gray-800">{log.childId?.parentId?.name || 'N/A'}</td>
                  <td className="py-3 font-medium text-gray-800">{log.vaccineName}</td>
                  <td className="py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${log.status === 'sent' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{new Date(log.timestamp).toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    <button
                      onClick={() => handleStatusUpdate(log._id, log.status === 'sent' ? 'failed' : 'sent')}
                      disabled={updating === log._id}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                    >
                      {updating === log._id ? '...' : `Mark ${log.status === 'sent' ? 'Failed' : 'Sent'}`}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
