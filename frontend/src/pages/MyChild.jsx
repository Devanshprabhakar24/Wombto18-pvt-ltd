import { useEffect, useState } from 'react';
import api from '../services/api';

export default function MyChild() {
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', dob: '', gender: 'male', birthHospital: '' });
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchChildren = async () => {
    try {
      const res = await api.get('/children');
      setChildren(res.data.children);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchChildren(); }, []);

  const resetForm = () => {
    setForm({ name: '', dob: '', gender: 'male', birthHospital: '' });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/children/${editId}`, form);
      } else {
        await api.post('/children', form);
      }
      resetForm();
      fetchChildren();
    } catch { /* empty */ }
    setSaving(false);
  };

  const handleEdit = (child) => {
    setForm({
      name: child.name,
      dob: child.dob?.slice(0, 10) || '',
      gender: child.gender || 'male',
      birthHospital: child.birthHospital || '',
    });
    setEditId(child._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this child?')) return;
    await api.delete(`/children/${id}`);
    fetchChildren();
  };

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
          <p className="text-sm text-gray-400">Manage your children's profiles</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm py-2 px-4">
          + Add Child
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">{editId ? 'Edit Child' : 'Add New Child'}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Hospital</label>
                <input value={form.birthHospital} onChange={e => setForm({ ...form, birthHospital: e.target.value })} className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-accent text-sm py-2 px-5 disabled:opacity-50">
                {saving ? 'Saving...' : editId ? 'Update' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="btn-outline text-sm py-2 px-5">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {children.length === 0 ? (
        <div className="card text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">👶</p>
          <p>No children added yet. Click "Add Child" to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {children.map((child) => (
            <div key={child._id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-2xl">
                  {child.gender === 'female' ? '👧' : '👦'}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{child.name}</h3>
                  <p className="text-xs text-gray-400">
                    Born: {new Date(child.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {child.birthHospital && ` • ${child.birthHospital}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Vaccines completed: {child.completedVaccines?.length || 0} / 30
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(child)} className="text-xs text-primary-600 hover:underline font-medium">Edit</button>
                <button onClick={() => handleDelete(child._id)} className="text-xs text-red-500 hover:underline font-medium">Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
