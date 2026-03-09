import { useEffect, useState } from 'react';
import api from '../services/api';

// Group vaccines by age milestone for the timeline view
const milestoneAges = [
  { ageWeeks: 0, label: 'Birth' },
  { ageWeeks: 6, label: '6 Weeks' },
  { ageWeeks: 10, label: '10 Weeks' },
  { ageWeeks: 14, label: '14 Weeks' },
  { ageWeeks: 26, label: '6 Months' },
  { ageWeeks: 30, label: '7 Months' },
  { ageWeeks: 36, label: '9 Months' },
  { ageWeeks: 52, label: '12 Months' },
  { ageWeeks: 65, label: '15 Months' },
  { ageWeeks: 68, label: '16-18 Months' },
  { ageWeeks: 78, label: '18 Months' },
  { ageWeeks: 208, label: '4-6 Years' },
  { ageWeeks: 260, label: '5 Years' },
  { ageWeeks: 468, label: '9 Years' },
  { ageWeeks: 494, label: '9.5 Years' },
  { ageWeeks: 520, label: '10-12 Years' },
];

export default function Milestones() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [ageWeeks, setAgeWeeks] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/children').then(res => {
      const list = res.data.children || [];
      setChildren(list);
      if (list.length > 0) {
        setSelectedChild(list[0]._id);
      }
      setLoading(false);
    }).catch(() => { setError('Failed to load children'); setLoading(false); });
  }, []);

  // Fetch schedule when child changes
  useEffect(() => {
    if (!selectedChild) return;
    setLoading(true);
    setError('');
    api.get(`/vaccines/${selectedChild}/all`).then(res => {
      setSchedule(res.data.schedule || []);
      setAgeWeeks(res.data.ageWeeks || 0);
      setLoading(false);
    }).catch(() => { setError('Failed to load vaccine schedule'); setLoading(false); });
  }, [selectedChild]);

  const handleChildChange = (id) => {
    setSelectedChild(id);
  };

  const handleMark = async (vaccineName) => {
    // Find the vaccine being marked
    const targetVaccine = schedule.find(v => v.name === vaccineName);
    if (!targetVaccine) return;

    // Collect all previous vaccines that are not yet completed
    const missedPrevious = schedule.filter(
      v => v.dueAgeWeeks < targetVaccine.dueAgeWeeks && v.status !== 'completed'
    );

    if (missedPrevious.length > 0) {
      const missedNames = missedPrevious.map(v => `• ${v.name}`).join('\n');
      const proceed = window.confirm(
        `⚠️ Previous vaccines not yet given:\n\n${missedNames}\n\nIt is recommended to complete earlier vaccines first.\nDo you still want to mark "${vaccineName}" as completed?`
      );
      if (!proceed) return;
    }

    try {
      await api.patch(`/vaccines/${selectedChild}/mark`, { vaccineName });
      const res = await api.get(`/vaccines/${selectedChild}/all`);
      setSchedule(res.data.schedule || []);
    } catch { /* silent */ }
  };

  // Group schedule by dueAgeWeeks
  const grouped = milestoneAges.map(m => {
    const vaccines = schedule.filter(v => v.dueAgeWeeks === m.ageWeeks);
    const allDone = vaccines.length > 0 && vaccines.every(v => v.status === 'completed');
    const anyOverdue = vaccines.some(v => v.status === 'overdue');
    const isCurrent = !allDone && !anyOverdue && m.ageWeeks >= ageWeeks && vaccines.some(v => v.status === 'upcoming');
    return { ...m, vaccines, allDone, anyOverdue, isCurrent };
  }).filter(m => m.vaccines.length > 0);

  const completedCount = schedule.filter(v => v.status === 'completed').length;
  const totalCount = schedule.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  if (loading && children.length === 0) return <div className="text-center text-gray-500 py-12">Loading...</div>;

  const selectedChildData = children.find(c => c._id === selectedChild);
  const ageMonths = Math.floor(ageWeeks / 4.33);
  const ageYears = Math.floor(ageMonths / 12);
  const remMonths = ageMonths % 12;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Growth Milestones</h1>
        <p className="text-sm text-gray-500">Track your child's vaccination milestones</p>
      </div>

      {error && <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>}

      {children.length === 0 && !loading && (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">👶</p>
          <p className="text-gray-600 font-medium">No children registered yet</p>
          <p className="text-sm text-gray-400 mt-1">Add a child from the My Child page to see milestones</p>
        </div>
      )}

      {children.length > 1 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Child:</label>
          <select value={selectedChild || ''} onChange={e => handleChildChange(e.target.value)} className="input-field w-auto inline-block">
            {children.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Age summary & progress */}
      {selectedChildData && (
        <div className="card bg-gradient-to-r from-green-50 to-green-100/60">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/60 rounded-xl flex items-center justify-center text-3xl shadow-sm">
              {selectedChildData.gender === 'female' ? '👧' : '👦'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-green-700">{selectedChildData.name}</h2>
              <p className="text-sm text-gray-600">
                Age: {ageYears > 0 ? `${ageYears} year${ageYears > 1 ? 's' : ''} ` : ''}{remMonths} month{remMonths !== 1 ? 's' : ''} ({ageWeeks} weeks)
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Vaccination Progress — {completedCount}/{totalCount} completed</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {grouped.length > 0 && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-5">Immunization Timeline</h2>
          <div className="space-y-0">
            {grouped.map((m, i) => (
              <div key={m.ageWeeks} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                    m.allDone ? 'bg-green-500 border-green-500' :
                    m.anyOverdue ? 'bg-red-400 border-red-500 ring-4 ring-red-100' :
                    m.isCurrent ? 'bg-green-300 border-green-500 ring-4 ring-green-100' :
                    'bg-gray-100 border-gray-300'
                  }`} />
                  {i < grouped.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[2rem] ${m.allDone ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-6 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className={`text-sm font-bold ${
                      m.allDone ? 'text-green-700' :
                      m.anyOverdue ? 'text-red-600' :
                      m.isCurrent ? 'text-primary-700' :
                      'text-gray-600'
                    }`}>{m.label}</p>
                    {m.allDone && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">COMPLETED</span>}
                    {m.anyOverdue && !m.allDone && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold">OVERDUE</span>}
                    {m.isCurrent && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {m.vaccines.map(v => (
                      <div key={v.name} className="flex items-center gap-2">
                        <button
                          onClick={() => v.status !== 'completed' && handleMark(v.name)}
                          disabled={v.status === 'completed'}
                          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition shrink-0 ${
                            v.status === 'completed'
                              ? 'bg-green-500 border-green-500 text-white cursor-default'
                              : 'border-gray-300 hover:border-primary-400 cursor-pointer'
                          }`}
                        >
                          {v.status === 'completed' && (
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          )}
                        </button>
                        <span className={`text-xs ${v.status === 'completed' ? 'text-gray-400 line-through' : v.status === 'overdue' ? 'text-red-500 font-medium' : 'text-gray-600'}`}>
                          {v.name}
                        </span>
                        {v.status === 'overdue' && <span className="text-[9px] text-red-400">overdue</span>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
