import { useEffect, useState } from 'react';
import api from '../services/api';

function VaccineRow({ vaccine, onMark }) {
  const colors = {
    completed: 'bg-accent-100 text-accent-700',
    upcoming: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  };
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-none">
      <div className="flex items-center gap-3">
        <button
          onClick={() => vaccine.status !== 'completed' && onMark(vaccine.name)}
          disabled={vaccine.status === 'completed'}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
            vaccine.status === 'completed'
              ? 'bg-accent-500 border-accent-500 text-white cursor-default'
              : 'border-gray-300 hover:border-primary-400 cursor-pointer'
          }`}
        >
          {vaccine.status === 'completed' && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
          )}
        </button>
        <div>
          <p className="text-sm font-medium text-gray-800">{vaccine.name}</p>
          <p className="text-xs text-gray-400">{vaccine.description} — Due: {new Date(vaccine.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${colors[vaccine.status] || colors.upcoming}`}>
        {vaccine.status}
      </span>
    </div>
  );
}

export default function VaccineSchedule() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/children').then(res => {
      setChildren(res.data.children);
      if (res.data.children.length > 0) {
        setSelectedChild(res.data.children[0]._id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedChild) return;
    setLoading(true);
    api.get(`/vaccines/${selectedChild}/all`).then(res => {
      setSchedule(res.data.schedule);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [selectedChild]);

  const handleMark = async (vaccineName) => {
    try {
      await api.patch(`/vaccines/${selectedChild}/mark`, { vaccineName });
      // Refresh schedule
      const res = await api.get(`/vaccines/${selectedChild}/all`);
      setSchedule(res.data.schedule);
    } catch { /* empty */ }
  };

  const filtered = filter === 'all' ? schedule : schedule.filter(v => v.status === filter);
  const completedCount = schedule.filter(v => v.status === 'completed').length;
  const overdueCount = schedule.filter(v => v.status === 'overdue').length;
  const upcomingCount = schedule.filter(v => v.status === 'upcoming').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Vaccine Schedule</h1>
        <p className="text-sm text-gray-400">Indian National Immunization Schedule — 30 vaccines from birth to 12 years</p>
      </div>

      {/* Child selector */}
      {children.length > 1 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Child:</label>
          <select value={selectedChild || ''} onChange={e => setSelectedChild(e.target.value)} className="input-field w-auto inline-block">
            {children.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card flex items-center gap-3 cursor-pointer" onClick={() => setFilter('completed')}>
          <div className="w-10 h-10 bg-accent-50 rounded-lg flex items-center justify-center text-lg">✅</div>
          <div>
            <p className="text-xl font-bold text-accent-600">{completedCount}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer" onClick={() => setFilter('upcoming')}>
          <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center text-lg">🕐</div>
          <div>
            <p className="text-xl font-bold text-yellow-600">{upcomingCount}</p>
            <p className="text-xs text-gray-400">Upcoming</p>
          </div>
        </div>
        <div className="card flex items-center gap-3 cursor-pointer" onClick={() => setFilter('overdue')}>
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-lg">⚠️</div>
          <div>
            <p className="text-xl font-bold text-red-600">{overdueCount}</p>
            <p className="text-xs text-gray-400">Overdue</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'upcoming', 'overdue', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)} {f === 'all' ? `(${schedule.length})` : ''}
          </button>
        ))}
      </div>

      {/* Vaccine list */}
      <div className="card">
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading schedule...</p>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No vaccines in this category.</p>
        ) : (
          filtered.map(v => <VaccineRow key={v.name} vaccine={v} onMark={handleMark} />)
        )}
      </div>

      {/* Progress bar */}
      {schedule.length > 0 && (
        <div className="card">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Overall Progress</span>
            <span className="font-bold">{Math.round((completedCount / schedule.length) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${(completedCount / schedule.length) * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
