import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ---- Stat Card ---- */
function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
        {trend && <p className="text-xs text-accent-600 font-medium">{trend}</p>}
      </div>
    </div>
  );
}

/* ---- Vaccine Row ---- */
function VaccineRow({ name, date, status }) {
  const colors = {
    completed: 'bg-accent-100 text-accent-700',
    upcoming: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  };
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-none">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={status === 'completed'} readOnly className="w-4 h-4 rounded text-accent-600" />
        <div>
          <p className="text-sm font-medium text-gray-800">{name}</p>
          <p className="text-xs text-gray-400">{date}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors[status] || colors.upcoming}`}>{status}</span>
    </div>
  );
}

/* ---- Milestone Item ---- */
function MilestoneItem({ age, text, done }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${done ? 'bg-accent-500 border-accent-500' : 'bg-white border-gray-300'}`} />
        <div className="w-0.5 flex-1 bg-gray-200" />
      </div>
      <div className="pb-5">
        <p className="text-sm font-semibold text-gray-700">{age}</p>
        <p className="text-xs text-gray-400">{text}</p>
      </div>
    </div>
  );
}

/* ---- Bar Chart (simple CSS) ---- */
function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md bg-primary-500 transition-all" style={{ height: `${(d.value / max) * 100}%` }} />
          <span className="text-[9px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ---- Milestone map ---- */
const milestoneMap = [
  { ageWeeks: 0, age: 'Birth', text: 'BCG & Hep B – Birth Dose' },
  { ageWeeks: 6, age: '6 Weeks', text: 'OPV, Pentavalent, Rotavirus' },
  { ageWeeks: 10, age: '10 Weeks', text: 'OPV, Pentavalent, Rotavirus' },
  { ageWeeks: 14, age: '14 Weeks', text: 'OPV, Pentavalent, IPV' },
  { ageWeeks: 36, age: '9 Months', text: 'MMR Dose-1, Vitamin A' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [childRes, impactRes] = await Promise.all([
          api.get('/children'),
          api.get('/impact'),
        ]);
        setChildren(childRes.data.children);
        setImpact(impactRes.data.impact);

        // Load vaccine schedule for first child
        if (childRes.data.children.length > 0) {
          const schedRes = await api.get(`/vaccines/${childRes.data.children[0]._id}/all`);
          setSchedule(schedRes.data.schedule);
        }
      } catch { /* empty */ }
      setLoading(false);
    };
    load();
  }, []);

  // Derive stats
  const upcomingCount = schedule.filter(v => v.status === 'upcoming').length;
  const completedCount = schedule.filter(v => v.status === 'completed').length;
  const overdueCount = schedule.filter(v => v.status === 'overdue').length;
  const impactScore = impact?.impactScore || 0;
  const level = impact?.sustainabilityLevel || 'Bronze';
  const trees = impact?.treeCount || 0;

  // Next 5 vaccines to show
  const nextVaccines = schedule.filter(v => v.status !== 'completed').slice(0, 5);

  // Milestones with age-based done status
  const firstChild = children[0];
  const ageWeeks = firstChild
    ? Math.floor((new Date() - new Date(firstChild.dob)) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  // Chart data: group vaccines by description period
  const chartLabels = ['Birth', '6w', '10w', '14w', '9m', '12m+'];
  const chartThresholds = [0, 6, 10, 14, 36, 52];
  const chartData = chartLabels.map((label, i) => {
    const wk = chartThresholds[i];
    const nextWk = chartThresholds[i + 1] || 9999;
    const group = schedule.filter(v => v.dueAgeWeeks >= wk && v.dueAgeWeeks < nextWk);
    const done = group.filter(v => v.status === 'completed').length;
    return { label, value: done || (group.length > 0 ? 1 : 0) };
  });

  if (loading) return <div className="text-center text-gray-400 py-12">Loading dashboard...</div>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400">Welcome back, {user?.name || 'Parent'}! Here's your child's health overview.</p>
        </div>
        <span className="text-xs text-gray-400 bg-white px-3 py-1.5 rounded-full border border-gray-200">📅 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💉" label="Upcoming Vaccines" value={upcomingCount} color="bg-blue-50" />
        <StatCard icon="📊" label="Completed" value={`${completedCount} / ${schedule.length}`} trend={overdueCount > 0 ? `${overdueCount} overdue` : 'On track!'} color="bg-accent-50" />
        <StatCard icon="🌱" label="Green Impact" value={impactScore} color="bg-green-50" />
        <StatCard icon="👶" label="Children" value={children.length} color="bg-purple-50" />
      </div>

      {/* Main Panels */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Vaccines */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Vaccines</h2>
            <a href="/dashboard/vaccines" className="text-xs text-primary-600 font-semibold hover:underline">View All</a>
          </div>
          <MiniBarChart data={chartData} />
          <div className="mt-4">
            {nextVaccines.length > 0 ? nextVaccines.map((v) => (
              <VaccineRow
                key={v.name}
                name={v.name}
                date={new Date(v.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                status={v.status}
              />
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">All vaccines are up to date!</p>
            )}
          </div>
        </div>

        {/* Growth Milestones */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Growth Milestones</h2>
            <a href="/dashboard/milestones" className="text-xs text-primary-600 font-semibold hover:underline">View All</a>
          </div>
          <MiniBarChart data={[
            { label: 'Vaccines', value: completedCount },
            { label: 'Upcoming', value: upcomingCount },
            { label: 'Overdue', value: overdueCount },
            { label: 'Total', value: schedule.length },
          ]} />
          <div className="mt-4">
            {milestoneMap.map((m) => (
              <MilestoneItem key={m.age} age={m.age} text={m.text} done={m.ageWeeks <= ageWeeks} />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Green Cohort Impact */}
        <div className="card bg-gradient-to-br from-accent-50 to-green-50">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Green Cohort Impact</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-accent-600">{impactScore}</p>
              <p className="text-xs text-gray-400 mt-1">Impact Score</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-600">{trees}</p>
              <p className="text-xs text-gray-400 mt-1">Trees Planted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-600">{level}</p>
              <p className="text-xs text-gray-400 mt-1">Sustainability</p>
            </div>
          </div>
          <div className="mt-4 bg-white/60 rounded-lg p-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress to {level === 'Gold' ? 'Max' : level === 'Silver' ? 'Gold' : 'Silver'}</span>
              <span>{impactScore}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-accent-500 rounded-full" style={{ width: `${impactScore}%` }} />
            </div>
          </div>
        </div>

        {/* Quick Links card */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/dashboard/child" className="flex items-center gap-3 p-3 bg-primary-50 rounded-xl hover:bg-primary-100 transition">
              <span className="text-2xl">👶</span>
              <div>
                <p className="font-semibold text-gray-800">Manage Children</p>
                <p className="text-xs text-gray-500">{children.length} child{children.length !== 1 ? 'ren' : ''} registered</p>
              </div>
            </a>
            <a href="/dashboard/vaccines" className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl hover:bg-yellow-100 transition">
              <span className="text-2xl">💉</span>
              <div>
                <p className="font-semibold text-gray-800">Vaccine Schedule</p>
                <p className="text-xs text-gray-500">{upcomingCount} upcoming, {overdueCount} overdue</p>
              </div>
            </a>
            <a href="/dashboard/impact" className="flex items-center gap-3 p-3 bg-accent-50 rounded-xl hover:bg-accent-100 transition">
              <span className="text-2xl">🌱</span>
              <div>
                <p className="font-semibold text-gray-800">Green Impact</p>
                <p className="text-xs text-gray-500">Score: {impactScore} — Level: {level}</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
