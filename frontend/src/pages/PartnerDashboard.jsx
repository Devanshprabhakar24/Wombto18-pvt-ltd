// WombTo18 project code
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function PartnerDashboard() {
  const [partner, setPartner] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('partnerRefId');
    if (saved) {
      api.get(`/partners/${saved}/dashboard`)
        .then(res => { setPartner(res.data.partner); setReferrals(res.data.referrals || []); })
        .catch(() => localStorage.removeItem('partnerRefId'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  if (!partner) {
    return (
      <div className="max-w-md mx-auto mt-16 text-center space-y-4">
        <p className="text-4xl">🤝</p>
        <h2 className="text-xl font-bold text-gray-900">No Partner Account Found</h2>
        <p className="text-sm text-gray-500">Register as a partner from the home page to get your referral QR code.</p>
        <Link to="/#partner" onClick={() => setTimeout(() => document.getElementById('partner')?.scrollIntoView({ behavior: 'smooth' }), 100)} className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-700 transition">
          Go to Partner Registration
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{partner.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{partner.type} Partner</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Referral Code</p>
            <p className="text-lg font-mono font-bold text-primary-600">{partner.referralId}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold text-gray-800 mb-3">QR Code for Referrals</h3>
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <div className="inline-block p-4 bg-white rounded-xl border">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.origin + '/register?ref=' + partner.referralId)}`}
              alt="QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-xs text-gray-400 mt-3">Scan to register with your referral</p>
          <p className="text-xs text-gray-500 mt-1 font-mono">{window.location.origin}/register?ref={partner.referralId}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{partner.totalReferrals || 0}</p>
          <p className="text-xs text-gray-500">Total Referrals</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{referrals.length}</p>
          <p className="text-xs text-gray-500">Sign-ups Tracked</p>
        </div>
      </div>

      {referrals.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Recent Sign-ups</h3>
          <div className="divide-y">
            {referrals.map((r, i) => (
              <div key={i} className="flex justify-between items-center py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.plan} plan • {r.state || '—'}</p>
                </div>
                <span className="text-xs text-gray-400">{new Date(r.registeredAt).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
