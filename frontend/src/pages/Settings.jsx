import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Settings() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', state: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/parents/me').then(res => {
      const u = res.data.user;
      setProfile({ name: u.name, email: u.email, phone: u.phone || '', state: u.state || '' });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    // NOTE: profile update endpoint could be added later; for now show saved state
    setTimeout(() => {
      setSaving(false);
      setMessage('Profile settings saved (display only — backend update endpoint not yet implemented).');
    }, 500);
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input value={profile.email} disabled className="input-field bg-gray-50 text-gray-400 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <select value={profile.state} onChange={e => setProfile({ ...profile, state: e.target.value })} className="input-field">
                <option value="">Select State</option>
                <option value="Delhi">Delhi</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
                <option value="West Bengal">West Bengal</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          {message && <p className="text-sm text-accent-600">{message}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm py-2 px-5 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Account */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Account</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Role</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || 'parent'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-700">Member Since</p>
              <p className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <button onClick={logout} className="text-sm text-red-500 font-semibold hover:underline">
          Sign Out
        </button>
      </div>

      {/* About */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-2">About WombTo18</h2>
        <p className="text-sm text-gray-500">
          WombTo18 is a comprehensive health-tech platform tracking children's vaccination, growth milestones, 
          and sustainability impact from birth to 18 years. Built with the Indian National Immunization Schedule.
        </p>
        <p className="text-xs text-gray-400 mt-2">Version 1.0.0</p>
      </div>
    </div>
  );
}
