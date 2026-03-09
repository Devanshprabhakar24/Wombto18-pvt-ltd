import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

import heroImg from '../assets/hero.jpg';

const HospitalIcon = () => (
  <svg className="w-6 h-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 8v8m-4-4h8" strokeLinecap="round" />
  </svg>
);
const SchoolIcon = () => (
  <svg className="w-6 h-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l8-3 8 3M4 6v6l8 3 8-3V6M4 12l8 3 8-3" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21C12 21 4 14.5 4 9.5 4 6.46 6.46 4 9.5 4c1.74 0 3.41.81 4.5 2.09A5.99 5.99 0 0118.5 4C21.54 4 24 6.46 24 9.5c0 5-8 11.5-8 11.5" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-6 h-6 text-green-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

const HeroIllustration = () => (
  <svg className="w-full max-w-md drop-shadow-xl" viewBox="0 0 420 360" fill="none">
    <ellipse cx="210" cy="190" rx="190" ry="170" fill="#eff6ff" />
    <ellipse cx="230" cy="200" rx="140" ry="130" fill="#dbeafe" />
    {/* Mother */}
    <circle cx="190" cy="130" r="40" fill="#fcd9b6" />
    <path d="M155 125Q155 95 190 88Q225 95 225 125" fill="#1e3a8a" />
    <circle cx="178" cy="130" r="3.5" fill="#1e3a5a" />
    <circle cx="202" cy="130" r="3.5" fill="#1e3a5a" />
    <path d="M183 142Q190 149 197 142" stroke="#c47a5a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M160 170Q155 200 165 260L215 260Q225 200 220 170Z" fill="#2563eb" />
    <path d="M160 180L135 220" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
    <path d="M220 180L240 210" stroke="#2563eb" strokeWidth="14" strokeLinecap="round" />
    <circle cx="133" cy="222" r="8" fill="#fcd9b6" />
    {/* Baby */}
    <ellipse cx="148" cy="235" rx="22" ry="16" fill="#fef3c7" />
    <circle cx="145" cy="228" r="12" fill="#fcd9b6" />
    <circle cx="141" cy="226" r="2" fill="#1e3a5a" />
    <circle cx="149" cy="226" r="2" fill="#1e3a5a" />
    <path d="M142 232Q145 235 148 232" stroke="#c47a5a" strokeWidth="1.2" fill="none" strokeLinecap="round" />
    <rect x="172" y="255" width="16" height="50" rx="8" fill="#1e40af" />
    <rect x="196" y="255" width="16" height="50" rx="8" fill="#1e40af" />
    <ellipse cx="180" cy="308" rx="12" ry="6" fill="#1e3a8a" />
    <ellipse cx="204" cy="308" rx="12" ry="6" fill="#1e3a8a" />
    <path d="M270 120C270 108 285 105 285 117C285 105 300 108 300 120C300 135 285 145 285 145C285 145 270 135 270 120Z" fill="#f87171" opacity="0.7" />
    <circle cx="330" cy="90" r="6" fill="#10b981" opacity="0.5" />
    <circle cx="80" cy="260" r="5" fill="#3b82f6" opacity="0.4" />
    <path d="M90 100l6-10 6 10" stroke="#10b981" strokeWidth="2" fill="none" opacity="0.5" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f6fcf7] to-[#f6fcf7] flex flex-col">
      <main className="flex-1">
        <section className="relative bg-gradient-to-br from-[#f6fcf7] to-[#f6fcf7] overflow-hidden border-b border-[#e6f4ea]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 md:py-20 flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-[3.2rem] font-extrabold text-gray-900 leading-tight mb-5">
                Protect Every Stage<br className="hidden md:block" />
                of Your Child’s Health Journey From<br className="hidden md:block" />
                <span className="text-green-800">Womb To 18 Years</span>
              </h1>
              <p className="text-lg text-gray-700 mb-8 max-w-lg">
                From prenatal care to adolescence, track vaccinations, milestones, and health records seamlessly — so you never miss what matters most.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
                <Link to="/register" className="px-7 py-3 rounded-md bg-green-800 text-white font-semibold text-lg shadow hover:bg-green-900 transition">Register as Parent</Link>
                <button type="button" onClick={() => document.getElementById('partner')?.scrollIntoView({ behavior: 'smooth' })} className="px-7 py-3 rounded-md border-2 border-green-800 text-green-900 font-semibold text-lg bg-white hover:bg-green-50 transition cursor-pointer">Partner With Us</button>
              </div>
              <div className="flex flex-wrap gap-8 mt-6 justify-center md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 rounded-lg p-2"><HospitalIcon /></span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-green-900 text-lg">200+</span>
                    <span className="text-xs text-gray-700">Hospitals</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 rounded-lg p-2"><SchoolIcon /></span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-green-900 text-lg">500+</span>
                    <span className="text-xs text-gray-700">Schools</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-red-100 rounded-lg p-2"><HeartIcon /></span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-red-500 text-lg">Trusted</span>
                    <span className="text-xs text-gray-700">by Parents</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 rounded-lg p-2"><ShieldIcon /></span>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-green-900 text-lg">Secure</span>
                    <span className="text-xs text-gray-700">Health Records</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="rounded-full overflow-hidden">
                <img src={heroImg} alt="Mother, child, and doctor" className="w-[380px] h-[380px] object-cover" />
              </div>
            </div>
          </div>
        </section>

      <section className="py-16 md:py-20 bg-accent-greenLight">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-heading">Why This Matters?</h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">Millions of children miss critical health milestones every year. Here are the problems we solve.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💉', title: 'Missed Vaccinations', desc: 'Over 30% of children miss at least one critical vaccine dose due to lack of reminders and tracking.', border: 'border-l-4 border-l-accent-red bg-accent-red' },
              { icon: '📈', title: 'No Growth Tracking', desc: 'Parents struggle to monitor developmental milestones without a centralized, easy-to-use platform.', border: 'border-l-4 border-l-accent-green bg-accent-green/10' },
              { icon: '📋', title: 'Disconnected Health Records', desc: 'Health data is scattered across hospitals, clinics, and schools — making continuity impossible.', border: 'border-l-4 border-l-accent-green bg-accent-green/20' },
            ].map((p) => (
              <div key={p.title} className={`rounded-xl p-6 ${p.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-bold text-text-heading mb-2">{p.title}</h3>
                <p className="text-sm text-text-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL-IN-ONE PLATFORM ===== */}
      <section className="py-16 md:py-20 bg-accent-green/10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-heading">All-in-One Child Health Platform</h2>
          <p className="text-center text-text-muted mb-12 max-w-2xl mx-auto">Everything you need to manage your child's health journey from birth to 18 years.</p>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: '🗓️', title: 'Vaccine Schedule', desc: 'Auto-generated vaccination schedule based on Indian immunization guidelines and your child\'s age.', bg: 'bg-accent-green/20 hover:bg-accent-green/40' },
              { icon: '📊', title: 'Growth Milestones', desc: 'Visual timelines and developmental tracking with alerts for any deviations from healthy benchmarks.', bg: 'bg-accent-green hover:bg-accent-greenLight' },
              { icon: '🏫', title: 'School Integration', desc: 'Seamlessly share verified health records with your child\'s school for a paperless experience.', bg: 'bg-accent-green/10 hover:bg-accent-green/20' },
            ].map((f) => (
              <div key={f.title} className={`card ${f.bg} transition-all duration-200`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-text-heading mb-2">{f.title}</h3>
                <p className="text-sm text-text-body">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'Green Cohort Impact', desc: 'Track your contribution to community health goals and earn sustainability impact scores.', bg: 'bg-accent-green hover:bg-accent-greenLight' },
              { icon: '🌐', title: 'Multilingual Support', desc: 'Access the platform in English and Hindi, with more regional languages coming soon.', bg: 'bg-accent-green/10 hover:bg-accent-green/20' },
              { icon: '🔒', title: 'Secure Data', desc: 'End-to-end encrypted health records with role-based access for parents, hospitals, and schools.', bg: 'bg-accent-green/20 hover:bg-accent-green/40' },
            ].map((f) => (
              <div key={f.title} className={`card ${f.bg} transition-all duration-200`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-text-heading mb-2">{f.title}</h3>
                <p className="text-sm text-text-body">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="partner" className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a3c1e] via-[#2d5a20] to-[#8a7a3a]" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-white mb-5 leading-tight">
              Are You a Hospital, School, or CSR Partner?
            </h2>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Join the WombTo18 ecosystem and help us protect every child's health journey.
            </p>
          </div>

          <PartnerRegForm />
        </div>
      </section>

      <footer className="py-6 bg-[#1a1a1a] text-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} WombTo18. All rights reserved.</p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
    </div>
  );
}

function PartnerRegForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', type: 'hospital', email: '', phone: '' });
  const [submitting, setSubmitting] = useState(false);
  const [referralId, setReferralId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/partners/register', form);
      localStorage.setItem('partnerRefId', res.data.partner.referralId);
      setReferralId(res.data.partner.referralId);
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
    setSubmitting(false);
  };

  if (referralId) {
    const referralUrl = `${window.location.origin}/register?ref=${referralId}`;
    return (
      <div className="bg-white/95 rounded-2xl p-6 sm:p-8 text-center max-w-md mx-auto shadow-xl space-y-4">
        <p className="text-3xl">✅</p>
        <h3 className="text-xl font-bold text-green-800">Registered Successfully!</h3>
        <p className="text-sm text-gray-600">Here's your referral QR code:</p>
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="inline-block p-3 bg-white rounded-xl border">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}`}
              alt="Referral QR Code"
              className="w-48 h-48"
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Scan to register with your referral</p>
          <p className="text-xs text-gray-500 mt-1 font-mono break-all">{referralUrl}</p>
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-gray-500">Referral Code:</span>
          <span className="font-mono font-bold text-primary-600">{referralId}</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/partner')}
          className="w-full py-2.5 bg-[#1a3c1e] text-white font-semibold rounded-lg hover:bg-[#2d5a20] transition"
        >
          Go to Partner Dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/95 rounded-2xl p-6 sm:p-8 max-w-md mx-auto space-y-4 shadow-xl">
      <h3 className="text-lg font-bold text-gray-900 text-center">Register as Partner</h3>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name *</label>
        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm">
          <option value="hospital">Hospital</option>
          <option value="doctor">Doctor / Clinic</option>
          <option value="school">School</option>
          <option value="csr">CSR / Corporate</option>
          <option value="ngo">NGO</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 border rounded-lg text-sm" placeholder="Optional" />
      </div>
      <button type="submit" disabled={submitting} className="w-full py-2.5 bg-[#1a3c1e] text-white font-semibold rounded-lg hover:bg-[#2d5a20] transition disabled:opacity-50">
        {submitting ? 'Registering...' : 'Register & Get Referral QR'}
      </button>
    </form>
  );
}
