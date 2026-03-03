import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Impact() {
  const [impact, setImpact] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/impact').then(res => {
      setImpact(res.data.impact);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-12">Loading...</div>;

  const score = impact?.impactScore || 0;
  const level = impact?.sustainabilityLevel || 'Bronze';
  const trees = impact?.treeCount || 0;

  const nextLevel = level === 'Gold' ? 'Gold' : level === 'Silver' ? 'Gold' : 'Silver';
  const targetScore = level === 'Gold' ? 100 : level === 'Silver' ? 90 : 70;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Green Cohort Impact</h1>
        <p className="text-sm text-gray-400">Your family's contribution to a healthier, greener India</p>
      </div>

      {/* Hero card */}
      <div className="card bg-gradient-to-br from-accent-50 to-green-50">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-accent-600">{score}</p>
            <p className="text-xs text-gray-500 mt-1">Impact Score</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent-600">{trees}</p>
            <p className="text-xs text-gray-500 mt-1">Trees Planted</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-accent-600">{level}</p>
            <p className="text-xs text-gray-500 mt-1">Sustainability Level</p>
          </div>
        </div>

        <div className="mt-6 bg-white/60 rounded-xl p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress to {nextLevel}</span>
            <span className="font-bold">{Math.min(score, targetScore)}/{targetScore}</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${Math.min((score / targetScore) * 100, 100)}%` }} />
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">How Impact Score Works</h2>
        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center text-sm shrink-0">💉</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Complete Vaccinations</p>
              <p className="text-xs text-gray-400">Every on-time vaccination increases your impact score. Staying on schedule maximizes your contribution.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center text-sm shrink-0">🌳</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Trees Planted</p>
              <p className="text-xs text-gray-400">For every 5 completed vaccines, a tree is planted in your family's name through our green initiative.</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-8 h-8 bg-accent-100 rounded-lg flex items-center justify-center text-sm shrink-0">🏅</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Sustainability Levels</p>
              <p className="text-xs text-gray-400">Bronze (0-69%) → Silver (70-89%) → Gold (90-100%). Reach Gold to unlock special community rewards!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Achievement Badges</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className={`p-4 rounded-xl border-2 ${score >= 1 ? 'border-accent-300 bg-accent-50' : 'border-gray-200 bg-gray-50 opacity-40'}`}>
            <span className="text-3xl">🥉</span>
            <p className="text-xs font-bold mt-2 text-gray-700">First Step</p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${score >= 70 ? 'border-accent-300 bg-accent-50' : 'border-gray-200 bg-gray-50 opacity-40'}`}>
            <span className="text-3xl">🥈</span>
            <p className="text-xs font-bold mt-2 text-gray-700">Silver Achiever</p>
          </div>
          <div className={`p-4 rounded-xl border-2 ${score >= 90 ? 'border-accent-300 bg-accent-50' : 'border-gray-200 bg-gray-50 opacity-40'}`}>
            <span className="text-3xl">🥇</span>
            <p className="text-xs font-bold mt-2 text-gray-700">Gold Champion</p>
          </div>
        </div>
      </div>
    </div>
  );
}
