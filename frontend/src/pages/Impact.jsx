import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Impact() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/impact').then(r => setData(r.data.impact)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center text-gray-400 py-12">Loading…</p>;
  if (!data) return <p className="text-center text-gray-400 py-12">No impact data yet.</p>;

  const { impactScore, sustainabilityLevel, treeCount, totalCompleted, totalDue, childCount } = data;

  const badgeColor = sustainabilityLevel === 'Gold' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : sustainabilityLevel === 'Silver' ? 'bg-gray-100 text-gray-600 border-gray-300' : 'bg-orange-50 text-orange-700 border-orange-200';
  const nextLevel = sustainabilityLevel === 'Gold' ? null : sustainabilityLevel === 'Silver' ? { name: 'Gold', target: 90 } : { name: 'Silver', target: 70 };
  const pendingVaccines = totalDue - totalCompleted;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-heading">Green Cohort Impact</h1>
        <p className="text-sm text-text-muted mt-1">
          Your Green Cohort Impact Score measures how well your family is staying on track with vaccinations. 
          Every completed vaccine raises your score and contributes to community health.
        </p>
      </div>

      {/* Score Card */}
      <div className="card bg-gradient-to-br from-green-50 to-green-100/60 text-center py-8">
        <p className="text-6xl font-extrabold text-green-600">{impactScore}</p>
        <p className="text-sm text-gray-500 mt-1">Impact Score (out of 100)</p>
        <span className={`inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full uppercase border ${badgeColor}`}>
          {sustainabilityLevel} Level
        </span>

        {/* Progress bar */}
        <div className="mt-5 mx-auto max-w-xs">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0</span>
            {nextLevel && <span className="font-medium text-green-600">{nextLevel.name} at {nextLevel.target}</span>}
            <span>100</span>
          </div>
          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${impactScore}%` }} />
          </div>
        </div>

        {nextLevel && (
          <p className="text-xs text-gray-500 mt-3">
            {impactScore >= nextLevel.target
              ? `You've reached ${nextLevel.name}!`
              : `${nextLevel.target - impactScore} more points to reach ${nextLevel.name}`}
          </p>
        )}
        {sustainabilityLevel === 'Gold' && (
          <p className="text-xs text-green-600 font-semibold mt-3">🏆 Maximum level achieved!</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat icon="✅" label="Vaccines Done" value={totalCompleted} desc="Completed on time" />
        <Stat icon="⏳" label="Pending" value={pendingVaccines} desc="Due vaccines left" />
        <Stat icon="🌳" label="Trees Planted" value={treeCount} desc="Via Go Green" />
        <Stat icon="👶" label="Children" value={childCount} desc="Registered" />
      </div>

      {/* How it works */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">How Your Score is Calculated</h2>
        <p className="text-sm text-gray-600 mb-4">
          We look at all vaccines that are due for your children based on their age, 
          then check how many you've completed. Your score = (completed ÷ due) × 100.
        </p>
        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 font-mono text-center">
          Score = ({totalCompleted} completed ÷ {totalDue} due) × 100 = <strong>{impactScore}</strong>
        </div>
      </div>

      {/* Level explainer */}
      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Sustainability Levels</h2>
        <div className="space-y-3">
          <LevelRow emoji="🥉" name="Bronze" range="0 – 69" desc="Getting started — complete more vaccines to level up" active={sustainabilityLevel === 'Bronze'} />
          <LevelRow emoji="🥈" name="Silver" range="70 – 89" desc="Great progress — your child is mostly on track" active={sustainabilityLevel === 'Silver'} />
          <LevelRow emoji="🥇" name="Gold" range="90 – 100" desc="Excellent — nearly all vaccines completed on time" active={sustainabilityLevel === 'Gold'} />
        </div>
      </div>

      {/* Tips */}
      <div className="card border-l-4 border-green-500">
        <h2 className="font-semibold text-gray-800 mb-2">💡 Tips to Improve Your Score</h2>
        <ul className="text-sm text-gray-600 space-y-1.5">
          <li>• Check your <strong>Vaccine Schedule</strong> and mark completed vaccines</li>
          <li>• Set up reminders so you never miss a due date</li>
          <li>• Register all your children to track their schedules</li>
          <li>• Plant a tree via <strong>Go Green</strong> to boost community impact</li>
        </ul>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, desc }) {
  return (
    <div className="card text-center py-4">
      <span className="text-2xl">{icon}</span>
      <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      {desc && <p className="text-[10px] text-gray-400 mt-0.5">{desc}</p>}
    </div>
  );
}

function LevelRow({ emoji, name, range, desc, active }) {
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg ${active ? 'bg-green-50 ring-1 ring-green-200' : 'bg-gray-50'}`}>
      <span className="text-xl">{emoji}</span>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-800">{name}</span>
          <span className="text-xs text-gray-400">({range})</span>
          {active && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-700 uppercase">Current</span>}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
