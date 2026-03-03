import { useEffect, useState } from 'react';
import api from '../services/api';

const milestoneData = [
  { ageWeeks: 0, age: 'Birth', text: 'BCG, OPV-0, Hepatitis B-1' },
  { ageWeeks: 6, age: '6 Weeks', text: 'DTP-1, IPV-1, Hep B-2, Hib-1, Rotavirus-1, PCV-1' },
  { ageWeeks: 10, age: '10 Weeks', text: 'DTP-2, IPV-2, Hib-2, Rotavirus-2, PCV-2' },
  { ageWeeks: 14, age: '14 Weeks', text: 'DTP-3, IPV-3, Hib-3, Rotavirus-3, PCV-3' },
  { ageWeeks: 36, age: '9 Months', text: 'MMR-1 (Measles, Mumps, Rubella)' },
  { ageWeeks: 52, age: '12 Months', text: 'Typhoid, Hepatitis A' },
  { ageWeeks: 68, age: '15-18 Months', text: 'MMR-2, DTP Booster-1, Hib Booster, Varicella' },
  { ageWeeks: 78, age: '18 Months', text: 'Hepatitis A-2' },
  { ageWeeks: 208, age: '5 Years', text: 'DTP Booster-2' },
  { ageWeeks: 260, age: '7 Years', text: 'Typhoid Booster' },
  { ageWeeks: 624, age: '12 Years', text: 'Tdap/Td' },
];

export default function Milestones() {
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [ageWeeks, setAgeWeeks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/children').then(res => {
      setChildren(res.data.children);
      if (res.data.children.length > 0) {
        const c = res.data.children[0];
        setSelectedChild(c._id);
        const dob = new Date(c.dob);
        const now = new Date();
        setAgeWeeks(Math.floor((now - dob) / (1000 * 60 * 60 * 24 * 7)));
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleChildChange = (id) => {
    setSelectedChild(id);
    const child = children.find(c => c._id === id);
    if (child) {
      const dob = new Date(child.dob);
      const now = new Date();
      setAgeWeeks(Math.floor((now - dob) / (1000 * 60 * 60 * 24 * 7)));
    }
  };

  const currentMilestoneIndex = milestoneData.findIndex(m => m.ageWeeks > ageWeeks);
  const progressPercent = currentMilestoneIndex === -1
    ? 100
    : Math.round((currentMilestoneIndex / milestoneData.length) * 100);

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  const selectedChildData = children.find(c => c._id === selectedChild);
  const ageMonths = Math.floor(ageWeeks / 4.33);
  const ageYears = Math.floor(ageMonths / 12);
  const remMonths = ageMonths % 12;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Growth Milestones</h1>
        <p className="text-sm text-gray-400">Track your child's development milestones</p>
      </div>

      {children.length > 1 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mr-2">Child:</label>
          <select value={selectedChild || ''} onChange={e => handleChildChange(e.target.value)} className="input-field w-auto inline-block">
            {children.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      )}

      {/* Age summary */}
      {selectedChildData && (
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-3xl shadow-sm">
              {selectedChildData.gender === 'female' ? '👧' : '👦'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{selectedChildData.name}</h2>
              <p className="text-sm text-gray-500">
                Age: {ageYears > 0 ? `${ageYears} year${ageYears > 1 ? 's' : ''} ` : ''}{remMonths} month{remMonths !== 1 ? 's' : ''} ({ageWeeks} weeks)
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Milestone Progress</span>
              <span className="font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-5">Immunization Timeline</h2>
        <div className="space-y-0">
          {milestoneData.map((m, i) => {
            const done = m.ageWeeks <= ageWeeks;
            const isCurrent = !done && (i === 0 || milestoneData[i - 1].ageWeeks <= ageWeeks);
            return (
              <div key={m.age} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 z-10 ${
                    done ? 'bg-accent-500 border-accent-500' :
                    isCurrent ? 'bg-primary-500 border-primary-500 ring-4 ring-primary-100' :
                    'bg-white border-gray-300'
                  }`} />
                  {i < milestoneData.length - 1 && (
                    <div className={`w-0.5 flex-1 min-h-[2rem] ${done ? 'bg-accent-300' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${done ? 'text-accent-700' : isCurrent ? 'text-primary-700' : 'text-gray-600'}`}>{m.age}</p>
                    {done && <span className="text-[10px] bg-accent-100 text-accent-700 px-2 py-0.5 rounded-full font-bold">PASSED</span>}
                    {isCurrent && <span className="text-[10px] bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-bold">CURRENT</span>}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{m.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
