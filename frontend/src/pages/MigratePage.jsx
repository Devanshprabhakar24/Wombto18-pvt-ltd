import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function MigratePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ childName: '', dob: '', gender: '', birthWeight: '', bloodGroup: '', apgarScore: '', birthHospital: '' });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/maternal/migrate', form);
      setResult(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Migration failed');
    }
    setLoading(false);
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="card text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Migration Successful! 🎉</h2>
          <p className="text-sm text-gray-500 mb-4">Your child's profile has been created from your maternal record.</p>
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-left mb-4">
            <p className="text-sm"><span className="font-semibold">Child Name:</span> {result.child?.name}</p>
            <p className="text-sm"><span className="font-semibold">CRN:</span> {result.crn}</p>
            <p className="text-sm"><span className="font-semibold">Linked MRN:</span> {result.mrn}</p>
          </div>
          <button onClick={() => navigate('/dashboard/child')} className="btn-accent w-full py-2.5">Go to Child Dashboard →</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-6">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-1">👶 Continue Your Journey</h2>
        <p className="text-sm text-gray-500 mb-6">Fill in your child's details to migrate from maternal to child profile. Your maternal history will be preserved.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child Name *</label>
            <input value={form.childName} onChange={e => setForm(f => ({...f, childName: e.target.value}))} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
            <input type="date" value={form.dob} onChange={e => setForm(f => ({...f, dob: e.target.value}))} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))} className="input-field">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Weight</label>
              <input value={form.birthWeight} onChange={e => setForm(f => ({...f, birthWeight: e.target.value}))} placeholder="e.g. 3.2 kg" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
              <select value={form.bloodGroup} onChange={e => setForm(f => ({...f, bloodGroup: e.target.value}))} className="input-field">
                <option value="">Select</option>
                <option value="A+">A+</option><option value="A-">A-</option>
                <option value="B+">B+</option><option value="B-">B-</option>
                <option value="O+">O+</option><option value="O-">O-</option>
                <option value="AB+">AB+</option><option value="AB-">AB-</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Apgar Score</label>
              <input type="number" min="0" max="10" value={form.apgarScore} onChange={e => setForm(f => ({...f, apgarScore: e.target.value}))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Birth Hospital</label>
              <input value={form.birthHospital} onChange={e => setForm(f => ({...f, birthHospital: e.target.value}))} className="input-field" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-accent w-full py-2.5 mt-4">{loading ? 'Migrating...' : 'Generate Child Profile (CRN)'}</button>
        </form>
      </div>
    </div>
  );
}
