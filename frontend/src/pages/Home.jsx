import { Link } from 'react-router-dom';

/* ---- Inline SVG Icons ---- */
const HospitalIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 8v8m-4-4h8" strokeLinecap="round" />
  </svg>
);
const SchoolIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6l8-3 8 3M4 6v6l8 3 8-3V6M4 12l8 3 8-3" />
  </svg>
);
const HeartIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21C12 21 4 14.5 4 9.5 4 6.46 6.46 4 9.5 4c1.74 0 3.41.81 4.5 2.09A5.99 5.99 0 0118.5 4C21.54 4 24 6.46 24 9.5c0 5-8 11.5-8 11.5" transform="translate(-2,0) scale(0.92)" />
  </svg>
);
const ShieldIcon = () => (
  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
  </svg>
);

/* Mother & Baby SVG illustration */
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
    <main className="flex-1">
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-accent-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold text-gray-900 leading-tight mb-5">
              Protect Every Stage of Your Child’s Health Journey From{' '}
              <span className="text-primary-600">Womb To 18 Years</span>
            </h1>
            <p className="text-lg text-gray-500 mb-8 max-w-lg">
            From prenatal care to adolescence, track vaccinations, milestones, and health records seamlessly — so you never miss what matters most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/register" className="btn-primary text-center">Register as Parent</Link>
              <a href="#partner" className="btn-outline text-center">Partner With Us</a>
            </div>
            {/* Trust icons */}
            <div className="flex items-center gap-8 mt-10 justify-center md:justify-start text-gray-400">
              {[
                { icon: <HospitalIcon />, label: 'Hospitals' },
                { icon: <SchoolIcon />, label: 'Schools' },
                { icon: <HeartIcon />, label: 'CSR' },
                { icon: <ShieldIcon />, label: 'Data Security' },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1">
                  {t.icon}
                  <span className="text-[10px] font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <HeroIllustration />
          </div>
        </div>
      </section>

      {/* ===== WHY THIS MATTERS ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">Why This Matters?</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Millions of children miss critical health milestones every year. Here are the problems we solve.</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💉', title: 'Missed Vaccinations', desc: 'Over 30% of children miss at least one critical vaccine dose due to lack of reminders and tracking.', border: 'border-l-4 border-l-red-400 bg-red-50/60' },
              { icon: '📈', title: 'No Growth Tracking', desc: 'Parents struggle to monitor developmental milestones without a centralized, easy-to-use platform.', border: 'border-l-4 border-l-amber-400 bg-amber-50/60' },
              { icon: '📋', title: 'Disconnected Health Records', desc: 'Health data is scattered across hospitals, clinics, and schools — making continuity impossible.', border: 'border-l-4 border-l-blue-400 bg-blue-50/60' },
            ].map((p) => (
              <div key={p.title} className={`rounded-xl p-6 ${p.border} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="text-3xl mb-3">{p.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ALL-IN-ONE PLATFORM ===== */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-900">All-in-One Child Health Platform</h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">Everything you need to manage your child's health journey from birth to 18 years.</p>

          {/* Top row */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {[
              { icon: '🗓️', title: 'Vaccine Schedule', desc: 'Auto-generated vaccination schedule based on Indian immunization guidelines and your child\'s age.', bg: 'bg-primary-50 hover:bg-primary-100' },
              { icon: '📊', title: 'Growth Milestones', desc: 'Visual timelines and developmental tracking with alerts for any deviations from healthy benchmarks.', bg: 'bg-accent-50 hover:bg-accent-100' },
              { icon: '🏫', title: 'School Integration', desc: 'Seamlessly share verified health records with your child\'s school for a paperless experience.', bg: 'bg-indigo-50 hover:bg-indigo-100' },
            ].map((f) => (
              <div key={f.title} className={`card ${f.bg} transition-all duration-200`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom row */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🌱', title: 'Green Cohort Impact', desc: 'Track your contribution to community health goals and earn sustainability impact scores.', bg: 'bg-green-50 hover:bg-green-100' },
              { icon: '🌐', title: 'Multilingual Support', desc: 'Access the platform in English and Hindi, with more regional languages coming soon.', bg: 'bg-yellow-50 hover:bg-yellow-100' },
              { icon: '🔒', title: 'Secure Data', desc: 'End-to-end encrypted health records with role-based access for parents, hospitals, and schools.', bg: 'bg-purple-50 hover:bg-purple-100' },
            ].map((f) => (
              <div key={f.title} className={`card ${f.bg} transition-all duration-200`}>
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Give Your Child the Healthiest Start</h2>
          <p className="text-primary-100 text-lg mb-8">Join thousands of parents tracking their children's health with WombTo18.</p>
          <Link to="/register" className="inline-block bg-white text-primary-700 px-8 py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            Register Now
          </Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-10 bg-gray-900 text-gray-400 text-sm" id="partner">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">WombTo18</h3>
              <p className="max-w-xs text-gray-500">Integrated child health tracking from womb to 18 years. Trusted by hospitals, schools, and parents.</p>
            </div>
            <div className="flex gap-12">
              <div>
                <h4 className="text-white font-semibold mb-3">Platform</h4>
                <ul className="space-y-2">
                  <li><Link to="/register" className="hover:text-white transition">Register</Link></li>
                  <li><Link to="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
                  <li><a href="#" className="hover:text-white transition">Vaccines</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-3">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition">About</a></li>
                  <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} WombTo18. All rights reserved.</p>
            <div className="flex gap-3">
              {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
                <a key={s} href="#" className="px-3 py-1 rounded-md border border-gray-700 text-gray-500 hover:text-white hover:border-gray-500 transition text-xs">{s}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
