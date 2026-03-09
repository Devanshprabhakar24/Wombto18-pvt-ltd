import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function GoGreenPage() {
  const { user, refreshUser } = useAuth();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [plantForm, setPlantForm] = useState({ latitude: '', longitude: '', photoUrl: '' });
  const [planting, setPlanting] = useState(false);

  useEffect(() => {
    api.get('/go-green/status')
      .then(res => setStatus(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleEnroll = async (type) => {
    setEnrolling(true);
    try {
      await api.post('/go-green/enroll', { type });
      const res = await api.get('/go-green/status');
      setStatus(res.data);
      if (refreshUser) refreshUser();
    } catch (err) {
      alert(err.response?.data?.message || 'Enrollment failed');
    }
    setEnrolling(false);
  };

  const getLocation = () => {
    if (!navigator.geolocation) return alert('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      pos => setPlantForm(f => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => alert('Unable to get location')
    );
  };

  const handlePlant = async (e) => {
    e.preventDefault();
    if (!plantForm.latitude || !plantForm.longitude) return alert('Please provide location');
    setPlanting(true);
    try {
      await api.post('/go-green/plant', { latitude: Number(plantForm.latitude), longitude: Number(plantForm.longitude), photoUrl: plantForm.photoUrl || undefined });
      const res = await api.get('/go-green/status');
      setStatus(res.data);
      alert('Tree planted! Certificate generated.');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to record plantation');
    }
    setPlanting(false);
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  // Not enrolled yet
  if (!status?.enrolled) {
    return (
      <div className="max-w-xl mx-auto mt-6">
        <div className="card text-center">
          <div className="text-5xl mb-4">🌳</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Go Green Initiative</h2>
          <p className="text-sm text-gray-500 mb-8">Celebrate your child's journey by planting a tree. Choose how you'd like to participate.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border rounded-xl p-5 text-left">
              <h3 className="font-bold text-gray-800">Dashboard Badge</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Show your commitment on your dashboard. Available on Premium+.</p>
              <button onClick={() => handleEnroll('dashboard_only')} disabled={enrolling} className="w-full py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold hover:bg-green-100 transition">
                {enrolling ? 'Enrolling...' : 'Enroll (Free)'}
              </button>
            </div>
            <div className="border rounded-xl p-5 text-left border-green-300">
              <h3 className="font-bold text-gray-800">Plant a Tree 🌱</h3>
              <p className="text-xs text-gray-500 mt-1 mb-4">Geo-tagged plantation with certificate. Ultra plan required.</p>
              <button onClick={() => handleEnroll('plantation')} disabled={enrolling} className="btn-accent w-full py-2">
                {enrolling ? 'Enrolling...' : 'Enroll & Plant'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enrolled
  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-6">
      <div className="card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌳</div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Go Green Status</h2>
            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${status.tree ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {status.tree ? 'Tree Planted ✓' : 'Dashboard Enrolled'}
            </span>
          </div>
        </div>
      </div>

      {status.tree && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Your Tree</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {(status.tree.latitude || status.tree.longitude) && (
              <div><span className="text-gray-500">Location:</span> {status.tree.latitude}, {status.tree.longitude}</div>
            )}
            {status.tree.address && (
              <div><span className="text-gray-500">Address:</span> {status.tree.address}</div>
            )}
            <div><span className="text-gray-500">Planted:</span> {new Date(status.tree.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            {status.tree.certificateUrl && <div className="col-span-2"><span className="text-gray-500">Certificate:</span> <a href={status.tree.certificateUrl} target="_blank" rel="noreferrer" className="text-primary-600 underline">View Certificate</a></div>}
          </div>
        </div>
      )}

      {!status.tree && status.type === 'plantation' && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-3">Record Your Plantation 🌱</h3>
          <form onSubmit={handlePlant} className="space-y-4">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                <input value={plantForm.latitude} onChange={e => setPlantForm(f => ({...f, latitude: e.target.value}))} className="input-field" placeholder="e.g. 19.0760" />
              </div>
              <div className="flex-1">
                <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                <input value={plantForm.longitude} onChange={e => setPlantForm(f => ({...f, longitude: e.target.value}))} className="input-field" placeholder="e.g. 72.8777" />
              </div>
              <button type="button" onClick={getLocation} className="px-3 py-2 bg-gray-100 rounded-lg text-sm hover:bg-gray-200 transition">📍 GPS</button>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Photo URL (optional)</label>
              <input value={plantForm.photoUrl} onChange={e => setPlantForm(f => ({...f, photoUrl: e.target.value}))} className="input-field" placeholder="https://..." />
            </div>
            <button type="submit" disabled={planting} className="btn-accent w-full py-2.5">{planting ? 'Recording...' : 'Submit Plantation'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
