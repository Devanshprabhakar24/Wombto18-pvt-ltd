import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function MaskedOverlay({ onUpgrade }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-xl">
      <div className="text-center">
        <p className="text-lg font-bold text-gray-800 mb-2">🔒 Premium Feature</p>
        <p className="text-sm text-gray-500 mb-4">Upgrade to unlock full dashboard access</p>
        <button onClick={onUpgrade} className="btn-accent py-2 px-6 text-sm">Upgrade Now</button>
      </div>
    </div>
  );
}

function VaccineCard({ vaccine, isFree, onMark }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    upcoming: 'bg-yellow-100 text-yellow-700',
    overdue: 'bg-red-100 text-red-700',
  };
  const isANC = vaccine.name?.includes('ANC');
  const isSupplement = vaccine.name?.includes('IFA') || vaccine.name?.includes('Calcium') || vaccine.name?.includes('Albendazole');
  const icon = isANC ? '🏥' : isSupplement ? '💊' : '💉';
  const iconBg = vaccine.status === 'completed' ? 'bg-green-100' : isANC ? 'bg-purple-100' : isSupplement ? 'bg-orange-100' : 'bg-blue-100';

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{vaccine.name}</p>
          <p className="text-xs text-gray-500">
            {isFree ? '••••••••' : (vaccine.dueDate ? new Date(vaccine.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${statusColors[vaccine.status] || 'bg-gray-100 text-gray-500'}`}>
          {vaccine.masked ? 'Locked' : vaccine.status}
        </span>
        {!isFree && vaccine.status !== 'completed' && (
          <button onClick={() => onMark(vaccine.name)} className="text-xs text-blue-600 hover:underline">Mark Done</button>
        )}
      </div>
    </div>
  );
}

export default function MaternalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [planType, setPlanType] = useState('FREE');
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [maternalForm, setMaternalForm] = useState({ edd: '', lmp: '', bloodGroup: '', weight: '', height: '', gravida: '', para: '', highRisk: false });
  const [registering, setRegistering] = useState(false);
  const [mode, setMode] = useState(null); // 'expecting' or 'delivered'
  const [childForm, setChildForm] = useState({ name: '', dob: '', gender: 'male', birthHospital: '' });
  const [hasChildren, setHasChildren] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [profileRes, childRes] = await Promise.allSettled([
          api.get('/maternal/profile'),
          api.get('/children'),
        ]);
        if (cancelled) return;
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data.profile);
          setPlanType(profileRes.value.data.plan_type);
        } else if (profileRes.reason?.response?.status === 404) {
          setShowRegister(true);
        }
        if (childRes.status === 'fulfilled' && childRes.value.data.children?.length > 0) {
          setHasChildren(true);
        }
      } catch { /* empty */ }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const reloadProfile = async () => {
    try {
      const res = await api.get('/maternal/profile');
      setProfile(res.data.profile);
      setPlanType(res.data.plan_type);
      setShowRegister(false);
    } catch (err) {
      if (err.response?.status === 404) setShowRegister(true);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await api.post('/maternal/register', {
        edd: maternalForm.edd,
        lmp: maternalForm.lmp,
        bloodGroup: maternalForm.bloodGroup,
        weight: maternalForm.weight,
        height: maternalForm.height,
        gravida: maternalForm.gravida,
        para: maternalForm.para,
        highRisk: maternalForm.highRisk,
      });
      setShowRegister(false);
      reloadProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
    setRegistering(false);
  };

  const handleMarkVaccine = async (name) => {
    try {
      await api.post('/maternal/mark-vaccine', { vaccineName: name });
      reloadProfile();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark vaccine');
    }
  };

  const handleRegisterChild = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      await api.post('/children', childForm);
      setShowRegister(false);
      setMode(null);
      navigate('/dashboard/child');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to register child');
    }
    setRegistering(false);
  };

  const isFree = planType === 'FREE';

  if (loading) return <div className="text-center text-gray-500 py-12">Loading...</div>;

  // If user has children but no maternal profile, skip registration and redirect
  if (showRegister && hasChildren && !mode) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <div className="card text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">👶 You Have Children Registered</h2>
          <p className="text-sm text-gray-500 mb-4">View your children's profiles or start a new maternal journey.</p>
          <div className="space-y-3">
            <button onClick={() => navigate('/dashboard/child')} className="btn-accent w-full py-2.5">View My Children →</button>
            <button onClick={() => setMode('expecting')} className="w-full p-3 rounded-xl border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition text-sm font-semibold text-gray-700">
              🤰 Start New Maternal Journey
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showRegister) {
    // If no mode selected yet, show choice
    if (!mode) {
      return (
        <div className="max-w-md mx-auto mt-10">
          <div className="card">
            <h2 className="text-xl font-bold text-gray-900 mb-2">🤰 Maternal Journey</h2>
            <p className="text-sm text-gray-500 mb-6">Choose your current stage to get started.</p>
            <div className="space-y-3">
              <button onClick={() => setMode('expecting')} className="w-full p-4 rounded-xl border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50 transition text-left">
                <p className="font-semibold text-gray-800">🤰 I'm Expecting</p>
                <p className="text-xs text-gray-500 mt-1">Enter your Expected Delivery Date to track your pregnancy.</p>
              </button>
              <button onClick={() => setMode('delivered')} className="w-full p-4 rounded-xl border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition text-left">
                <p className="font-semibold text-gray-800">👶 My Child Is Born</p>
                <p className="text-xs text-gray-500 mt-1">Register your child's details directly.</p>
              </button>
              {hasChildren && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mt-3">
                  <p className="text-xs text-yellow-700">You already have children registered. <button onClick={() => navigate('/dashboard/child')} className="underline font-semibold">View My Children →</button></p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Mode: expecting — enter EDD + maternal details
    if (mode === 'expecting') {
      return (
        <div className="max-w-lg mx-auto mt-10">
          <div className="card">
            <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-3">← Back</button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">🤰 Start Your Maternal Journey</h2>
            <p className="text-sm text-gray-500 mb-6">Fill in your details to create your maternal profile and vaccine schedule.</p>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Menstrual Period (LMP)</label>
                  <input type="date" value={maternalForm.lmp} onChange={e => {
                    const lmpVal = e.target.value;
                    setMaternalForm(f => {
                      const updated = { ...f, lmp: lmpVal };
                      // Auto-calculate EDD from LMP (LMP + 280 days)
                      if (lmpVal) {
                        const lmpDate = new Date(lmpVal);
                        const eddCalc = new Date(lmpDate.getTime() + 280 * 24 * 60 * 60 * 1000);
                        updated.edd = eddCalc.toISOString().split('T')[0];
                      }
                      return updated;
                    });
                  }} max={new Date().toISOString().split('T')[0]} className="input-field" />
                  <p className="text-[10px] text-gray-400 mt-1">EDD will auto-calculate from LMP</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expected Delivery Date (EDD) *</label>
                  <input type="date" value={maternalForm.edd} onChange={e => setMaternalForm(f => ({ ...f, edd: e.target.value }))} min={new Date().toISOString().split('T')[0]} className="input-field" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                  <select value={maternalForm.bloodGroup} onChange={e => setMaternalForm(f => ({ ...f, bloodGroup: e.target.value }))} className="input-field">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input type="number" value={maternalForm.weight} onChange={e => setMaternalForm(f => ({ ...f, weight: e.target.value }))} className="input-field" placeholder="e.g. 58" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <input type="number" value={maternalForm.height} onChange={e => setMaternalForm(f => ({ ...f, height: e.target.value }))} className="input-field" placeholder="e.g. 160" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gravida (pregnancies)</label>
                  <input type="number" min="1" value={maternalForm.gravida} onChange={e => setMaternalForm(f => ({ ...f, gravida: e.target.value }))} className="input-field" placeholder="e.g. 1" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Para (deliveries)</label>
                  <input type="number" min="0" value={maternalForm.para} onChange={e => setMaternalForm(f => ({ ...f, para: e.target.value }))} className="input-field" placeholder="e.g. 0" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input type="checkbox" checked={maternalForm.highRisk} onChange={e => setMaternalForm(f => ({ ...f, highRisk: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500" />
                    <span className="text-sm font-medium text-gray-700">High Risk Pregnancy</span>
                  </label>
                </div>
              </div>
              <button type="submit" disabled={registering} className="btn-accent w-full py-2.5">{registering ? 'Creating...' : 'Create Maternal Profile'}</button>
            </form>
          </div>
        </div>
      );
    }

    // Mode: delivered — register child details
    if (mode === 'delivered') {
      return (
        <div className="max-w-md mx-auto mt-10">
          <div className="card">
            <button onClick={() => setMode(null)} className="text-sm text-gray-400 hover:text-gray-600 mb-3">← Back</button>
            <h2 className="text-xl font-bold text-gray-900 mb-2">👶 Register Your Child</h2>
            <p className="text-sm text-gray-500 mb-6">Enter your child's details to create their profile.</p>
            <form onSubmit={handleRegisterChild} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Child Name *</label>
                <input value={childForm.name} onChange={e => setChildForm(f => ({ ...f, name: e.target.value }))} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                <input type="date" value={childForm.dob} onChange={e => setChildForm(f => ({ ...f, dob: e.target.value }))} max={new Date().toISOString().split('T')[0]} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select value={childForm.gender} onChange={e => setChildForm(f => ({ ...f, gender: e.target.value }))} className="input-field">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Birth Hospital</label>
                <input value={childForm.birthHospital} onChange={e => setChildForm(f => ({ ...f, birthHospital: e.target.value }))} className="input-field" />
              </div>
              <button type="submit" disabled={registering} className="btn-accent w-full py-2.5">{registering ? 'Registering...' : 'Register Child'}</button>
            </form>
          </div>
        </div>
      );
    }
  }

  const gaWeeks = profile?.lmp ? Math.floor((new Date() - new Date(profile.lmp)) / (7 * 24 * 60 * 60 * 1000)) : 0;
  const completedVaccines = profile?.vaccineSchedule?.filter(v => v.status === 'completed').length || 0;
  const totalVaccines = profile?.vaccineSchedule?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🤰 Maternal Dashboard</h1>
          <p className="text-sm text-gray-500">Welcome, {user?.name}! Track your pregnancy journey.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${planType === 'ULTRA' ? 'bg-purple-100 text-purple-700' : planType === 'PREMIUM' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
            {planType} Plan
          </span>
          {profile?.mrn && <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">MRN: {profile.mrn}</span>}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-pink-100">🤰</div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Gestational Age</p>
            <p className="text-xl font-bold text-gray-900">{gaWeeks} weeks</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-blue-100">📅</div>
          <div>
            <p className="text-xs text-gray-500 uppercase">EDD</p>
            <p className="text-xl font-bold text-gray-900">{profile?.edd ? new Date(profile.edd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-green-100">✅</div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Tasks Done</p>
            <p className="text-xl font-bold text-gray-900">{completedVaccines}/{totalVaccines}</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl bg-yellow-100">⏳</div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <p className="text-xl font-bold text-gray-900">{profile?.maternal_status || 'ACTIVE'}</p>
          </div>
        </div>
      </div>

      {/* Maternal Info (if available) */}
      {(profile?.bloodGroup || profile?.weight || profile?.height) && (
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-3">📋 Your Details</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {profile.bloodGroup && (
              <div className="bg-red-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Blood Group</p>
                <p className="text-lg font-bold text-red-700">{profile.bloodGroup}</p>
              </div>
            )}
            {profile.weight && (
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Weight</p>
                <p className="text-lg font-bold text-blue-700">{profile.weight} kg</p>
              </div>
            )}
            {profile.height && (
              <div className="bg-green-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Height</p>
                <p className="text-lg font-bold text-green-700">{profile.height} cm</p>
              </div>
            )}
            {profile.gravida != null && (
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Gravida</p>
                <p className="text-lg font-bold text-purple-700">G{profile.gravida}</p>
              </div>
            )}
            {profile.para != null && (
              <div className="bg-indigo-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Para</p>
                <p className="text-lg font-bold text-indigo-700">P{profile.para}</p>
              </div>
            )}
            {profile.highRisk && (
              <div className="bg-orange-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500">Risk</p>
                <p className="text-lg font-bold text-orange-700">⚠️ High</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grouped Schedule */}
      <div className="relative">
        {isFree && <MaskedOverlay onUpgrade={() => navigate('/dashboard/plans')} />}

        {/* Vaccines */}
        <div className="card mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">💉 Vaccines (UIP + IAP/FOGSI)</h2>
          <p className="text-xs text-gray-400 mb-4">As per Indian Govt Universal Immunization Programme</p>
          <div className="space-y-3">
            {profile?.vaccineSchedule?.filter(v => v.category === 'vaccine' || (!v.category && (v.name?.includes('Td') || v.name?.includes('TT') || v.name?.includes('Tdap')))).map((v, i) => (
              <VaccineCard key={`vac-${i}`} vaccine={v} isFree={isFree} onMark={handleMarkVaccine} />
            ))}
          </div>
        </div>

        {/* Supplementation */}
        <div className="card mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-1">💊 Supplementation (MoHFW)</h2>
          <p className="text-xs text-gray-400 mb-4">Iron, Calcium & Deworming as per Govt guidelines</p>
          <div className="space-y-3">
            {profile?.vaccineSchedule?.filter(v => v.category === 'supplement' || (!v.category && (v.name?.includes('IFA') || v.name?.includes('Calcium') || v.name?.includes('Albendazole')))).map((v, i) => (
              <VaccineCard key={`sup-${i}`} vaccine={v} isFree={isFree} onMark={handleMarkVaccine} />
            ))}
          </div>
        </div>

        {/* ANC Visits */}
        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-1">🏥 ANC Visits (PMSMA Guidelines)</h2>
          <p className="text-xs text-gray-400 mb-4">Pradhan Mantri Surakshit Matritva Abhiyan schedule</p>
          <div className="space-y-3">
            {profile?.vaccineSchedule?.filter(v => v.category === 'anc' || (!v.category && v.name?.includes('ANC'))).map((v, i) => (
              <VaccineCard key={`anc-${i}`} vaccine={v} isFree={isFree} onMark={handleMarkVaccine} />
            ))}
          </div>
        </div>
      </div>

      {/* Migration Button */}
      {(profile?.maternal_status === 'DELIVERED' || gaWeeks >= 36) && profile?.maternal_status !== 'MIGRATED' && (
        <div className="card bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="text-center py-4">
            <h2 className="text-xl font-bold text-blue-900 mb-2">🎉 Ready to Continue Your Journey?</h2>
            <p className="text-sm text-gray-600 mb-4">Migrate your maternal profile to a child profile and continue tracking.</p>
            <button onClick={() => navigate('/dashboard/migrate')} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
              Continue Journey → Create Child Profile
            </button>
          </div>
        </div>
      )}

      {profile?.maternal_status === 'MIGRATED' && (
        <div className="card bg-green-50 border-2 border-green-200">
          <div className="text-center py-4">
            <p className="text-lg font-bold text-green-800">✅ Migrated to Child Profile</p>
            <p className="text-sm text-gray-600">CRN: {profile.linkedChildCRN}</p>
            <button onClick={() => navigate('/dashboard/child')} className="mt-3 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition text-sm">
              View Child Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Upgrade Banner for Free Users */}
      {isFree && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-yellow-900">⭐ Unlock Full Access</h3>
              <p className="text-sm text-yellow-700">Upgrade to Premium or Ultra Premium for complete maternal care.</p>
            </div>
            <button onClick={() => navigate('/dashboard/plans')} className="bg-yellow-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition text-sm">
              View Plans
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
