import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/dashboard/child', icon: '👶', label: 'My Child' },
  { to: '/dashboard/vaccines', icon: '💉', label: 'Vaccine Schedule' },
  { to: '/dashboard/milestones', icon: '📈', label: 'Milestones' },
  { to: '/dashboard/impact', icon: '🌱', label: 'Impact' },
  { to: '/dashboard/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] py-6 px-4 shrink-0">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/dashboard'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
              isActive
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
            }`
          }
        >
          <span className="text-lg">{link.icon}</span>
          {link.label}
        </NavLink>
      ))}
    </aside>
  );
}
