import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

/* ---- Stat Card ---- */
function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-text-muted uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-text-heading">{value}</p>
        {trend && <p className="text-xs text-primary-bright font-medium">{trend}</p>}
      </div>
    </div>
  );
}

function VaccineRow({ name, date, status }) {
  const colors = {
    completed: 'bg-accent-green text-primary-dark',
    upcoming: 'bg-accent-yellow text-primary-dark',
    overdue: 'bg-accent-red text-primary-dark',
  };
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-none">
      <div className="flex items-center gap-3">
        <input type="checkbox" checked={status === 'completed'} readOnly className="w-4 h-4 rounded text-primary-bright" />
        <div>
          <p className="text-sm font-medium text-text-heading">{name}</p>
          <p className="text-xs text-text-muted">{date}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${colors[status] || colors.upcoming}`}>{status}</span>
    </div>
  );
}

function MilestoneItem({ age, text, done }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="flex flex-col items-center">
        <div className={`w-3.5 h-3.5 rounded-full border-2 ${done ? 'bg-primary-bright border-primary-bright' : 'bg-white border-accent-grayBorder'}`} />
        <div className="w-0.5 flex-1 bg-accent-grayBorder" />
      </div>
      <div className="pb-5">
        <p className="text-sm font-semibold text-text-body">{age}</p>
        <p className="text-xs text-text-muted">{text}</p>
      </div>
    </div>
  );
}

function MiniBarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-32">
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-md bg-primary-500 transition-all" style={{ height: `${(d.value / max) * 100}%` }} />
          <span className="text-[9px] text-text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

const milestoneMap = [
  { ageWeeks: 0, age: 'Birth', text: 'BCG, OPV-0, Hep B Birth Dose' },
  { ageWeeks: 6, age: '6 Weeks', text: 'DTwP/DTaP-1, IPV-1, Hib-1, Rotavirus-1, PCV-1, Hep B-2' },
  { ageWeeks: 10, age: '10 Weeks', text: 'DTwP/DTaP-2, IPV-2, Hib-2, Rotavirus-2, PCV-2' },
  { ageWeeks: 14, age: '14 Weeks', text: 'DTwP/DTaP-3, IPV-3, Hep B-3, Hib-3, Rotavirus-3, PCV-3' },
  { ageWeeks: 36, age: '9 Months', text: 'MMR-1, JE-1 (endemic)' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const childRes = await api.get('/children');
        setChildren(childRes.data.children);

        if (childRes.data.children.length > 0) {
          const schedRes = await api.get(`/vaccines/${childRes.data.children[0]._id}/all`);
          setSchedule(schedRes.data.schedule);
        }
      } catch { /* empty */ }
      setLoading(false);
    };
    load();
  }, []);

  const upcomingCount = schedule.filter(v => v.status === 'upcoming').length;
  const completedCount = schedule.filter(v => v.status === 'completed').length;
  const overdueCount = schedule.filter(v => v.status === 'overdue').length;

  const nextVaccines = schedule.filter(v => v.status !== 'completed').slice(0, 5);

  const firstChild = children[0];
  const ageWeeks = firstChild
    ? Math.floor((new Date() - new Date(firstChild.dob)) / (1000 * 60 * 60 * 24 * 7))
    : 0;

  const chartLabels = ['Birth', '6w', '10w', '14w', '9m', '12m+'];
  const chartThresholds = [0, 6, 10, 14, 36, 52];
  const chartData = chartLabels.map((label, i) => {
    const wk = chartThresholds[i];
    const nextWk = chartThresholds[i + 1] || 9999;
    const group = schedule.filter(v => v.dueAgeWeeks >= wk && v.dueAgeWeeks < nextWk);
    const done = group.filter(v => v.status === 'completed').length;
    return { label, value: done || (group.length > 0 ? 1 : 0) };
  });

  if (loading) return <div className="text-center text-text-muted py-12">Loading dashboard...</div>;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-text-heading">Dashboard</h1>
          <p className="text-sm text-text-muted">Welcome back, {user?.name || 'Parent'}! Here's your child's health overview.</p>
        </div>
        <span className="text-xs text-text-muted bg-accent-green/10 px-3 py-1.5 rounded-full border border-accent-green/40">📅 {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="💉" label="Upcoming Vaccines" value={upcomingCount} color="bg-accent-green/20" />
        <StatCard icon="📊" label="Completed" value={`${completedCount} / ${schedule.length}`} trend={overdueCount > 0 ? `${overdueCount} overdue` : 'On track!'} color="bg-accent-green" />
        <StatCard icon="👶" label="Children" value={children.length} color="bg-accent-green/40" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming Vaccines */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-heading">Upcoming Vaccines</h2>
            <a href="/dashboard/vaccines" className="text-xs text-primary-bright font-semibold hover:underline">View All</a>
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
              <p className="text-sm text-text-muted text-center py-4">All vaccines are up to date!</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-text-heading">Growth Milestones</h2>
            <a href="/dashboard/milestones" className="text-xs text-primary-bright font-semibold hover:underline">View All</a>
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

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">School Integration Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-lg">🏫</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Health Record Sharing</p>
                  <p className="text-xs text-gray-500">Share verified vaccination records with school</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 uppercase">Pending</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-lg">✅</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Vaccination Compliance</p>
                  <p className="text-xs text-gray-500">{completedCount}/{schedule.length} vaccines documented</p>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${completedCount > 0 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{completedCount > 0 ? 'Active' : 'Not started'}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-lg">📝</div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Digital Health Card</p>
                  <p className="text-xs text-gray-500">Paperless health records for school admission</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 uppercase">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            <a href="/dashboard/child" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
              <span className="text-2xl">👶</span>
              <div>
                <p className="font-semibold text-green-700">Manage Children</p>
                <p className="text-xs text-gray-500">{children.length} child{children.length !== 1 ? 'ren' : ''} registered</p>
              </div>
            </a>
            <a href="/dashboard/vaccines" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
              <span className="text-2xl">💉</span>
              <div>
                <p className="font-semibold text-green-700">Vaccine Schedule</p>
                <p className="text-xs text-gray-500">{upcomingCount} upcoming, {overdueCount} overdue</p>
              </div>
            </a>
            <a href="/dashboard/go-green" className="flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition">
              <span className="text-2xl">🌳</span>
              <div>
                <p className="font-semibold text-green-700">Go Green</p>
                <p className="text-xs text-gray-500">Plant trees & track your green impact</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
