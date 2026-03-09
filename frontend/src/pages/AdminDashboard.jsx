import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('overview');
  const [coupons, setCoupons] = useState([]);
  const [payments, setPayments] = useState([]);
  const [couponForm, setCouponForm] = useState({ code: '', type: 'percentage', value: 10, maxUses: 100 });

  useEffect(() => {
    Promise.all([
      api.get('/admin/enhanced-stats').catch(() => api.get('/admin/stats')),
    ]).then(([statsRes]) => {
      setStats(statsRes.data);
    }).catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadCoupons = () => api.get('/admin/coupons').then(r => setCoupons(r.data.coupons || [])).catch(() => {});
  const loadPayments = () => api.get('/admin/payment-logs').then(r => setPayments(r.data.payments || [])).catch(() => {});

  useEffect(() => {
    if (tab === 'coupons') loadCoupons();
    if (tab === 'payments') loadPayments();
  }, [tab]);

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

  const createCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/coupons', couponForm);
      loadCoupons();
      setCouponForm({ code: '', type: 'percentage', value: 10, maxUses: 100 });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const deleteCoupon = async (id) => {
    if (!confirm('Delete this coupon?')) return;
    await api.delete(`/admin/coupons/${id}`).catch(() => {});
    loadCoupons();
  };

  if (loading) return <div className="text-center text-gray-500 py-12">Loading admin panel...</div>;

  const s = stats || {};
  const tabs = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'coupons', label: '🏷️ Coupons' },
    { key: 'payments', label: '💳 Payments' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Super Admin Panel</h1>
        <p className="text-sm text-gray-500">Enhanced administration with maternal, payments, partners & Go Green insights</p>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${tab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: '👥', label: 'Parents', value: s.parentCount || 0, color: 'blue', to: '/admin/parents' },
              { icon: '🤰', label: 'Maternal Active', value: s.maternalCount || 0, color: 'pink' },
              { icon: '👶', label: 'Children', value: s.childCount || 0, color: 'indigo' },
              { icon: '🔔', label: 'Reminders', value: s.reminderCount || 0, color: 'yellow', to: '/admin/reminders' },
              { icon: '💳', label: 'Payments', value: s.paymentCount || 0, color: 'green' },
              { icon: '🤝', label: 'Partners', value: s.partnerCount || 0, color: 'purple' },
              { icon: '🌳', label: 'Trees Planted', value: s.treeCount || 0, color: 'emerald' },
              { icon: '✅', label: 'Sent OK', value: s.remindersSent || 0, color: 'teal' },
            ].map((card, i) => {
              const Wrapper = card.to ? Link : 'div';
              return (
                <Wrapper key={i} to={card.to} className="card hover:shadow-md transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-${card.color}-100 rounded-xl flex items-center justify-center text-lg`}>{card.icon}</div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wide">{card.label}</p>
                      <p className="text-xl font-bold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </Wrapper>
              );
            })}
          </div>

          {s.planDistribution && (
            <div className="card">
              <h3 className="text-sm font-bold text-gray-700 mb-3">Plan Distribution</h3>
              <div className="flex gap-6">
                {Object.entries(s.planDistribution).map(([plan, count]) => (
                  <div key={plan} className="text-center">
                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                    <p className="text-xs text-gray-500">{plan}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link to="/admin/parents" className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-100 transition">
                👥 View Parents
              </Link>
              <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
                📥 Export Parents CSV
              </button>
              <Link to="/admin/reminders" className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 text-yellow-700 rounded-lg text-sm font-semibold hover:bg-yellow-100 transition">
                🔔 Mark Reminder Status
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Coupons Tab */}
      {tab === 'coupons' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">Create Coupon</h3>
            <form onSubmit={createCoupon} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <input value={couponForm.code} onChange={e => setCouponForm(f => ({...f, code: e.target.value}))} placeholder="Code" className="input-field" required />
              <select value={couponForm.type} onChange={e => setCouponForm(f => ({...f, type: e.target.value}))} className="input-field">
                <option value="percentage">Percentage</option>
                <option value="flat">Flat ₹</option>
                <option value="full_waiver">Full Waiver</option>
              </select>
              <input type="number" value={couponForm.value} onChange={e => setCouponForm(f => ({...f, value: Number(e.target.value)}))} placeholder="Value" className="input-field" />
              <button type="submit" className="btn-accent py-2">Create</button>
            </form>
          </div>
          <div className="card overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b text-left text-gray-500">
                <th className="pb-2 pr-4">Code</th><th className="pb-2 pr-4">Type</th><th className="pb-2 pr-4">Value</th><th className="pb-2 pr-4">Used</th><th className="pb-2">Actions</th>
              </tr></thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c._id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono">{c.code}</td>
                    <td className="py-2 pr-4">{c.type}</td>
                    <td className="py-2 pr-4">{c.type === 'percentage' ? `${c.value}%` : c.type === 'full_waiver' ? '100%' : `₹${c.value}`}</td>
                    <td className="py-2 pr-4">{c.usedCount}/{c.maxUses}</td>
                    <td className="py-2"><button onClick={() => deleteCoupon(c._id)} className="text-red-500 text-xs hover:underline">Delete</button></td>
                  </tr>
                ))}
                {!coupons.length && <tr><td colSpan={5} className="py-4 text-center text-gray-400">No coupons</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {tab === 'payments' && (
        <div className="card overflow-x-auto">
          <h3 className="font-bold text-gray-800 mb-3">Payment Logs</h3>
          <table className="min-w-full text-sm">
            <thead><tr className="border-b text-left text-gray-500">
              <th className="pb-2 pr-4">User</th><th className="pb-2 pr-4">Plan</th><th className="pb-2 pr-4">Amount</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Date</th>
            </tr></thead>
            <tbody>
              {payments.map(p => (
                <tr key={p._id} className="border-b last:border-0">
                  <td className="py-2 pr-4">{p.userId?.name || p.userId}</td>
                  <td className="py-2 pr-4">{p.plan}</td>
                  <td className="py-2 pr-4">₹{p.finalAmount}</td>
                  <td className="py-2 pr-4"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td>
                  <td className="py-2 text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {!payments.length && <tr><td colSpan={5} className="py-4 text-center text-gray-400">No payments</td></tr>}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
