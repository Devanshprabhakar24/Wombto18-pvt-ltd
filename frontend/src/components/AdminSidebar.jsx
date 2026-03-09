import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', icon: '🏠', label: 'Dashboard' },
  { to: '/admin/parents', icon: '👥', label: 'Parents' },
  { to: '/admin/children', icon: '👶', label: 'Children' },
  { to: '/admin/reminders', icon: '🔔', label: 'Reminders' },
  { to: '/admin/logs', icon: '📋', label: 'Activity Logs' },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] py-6 px-4 shrink-0">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">Admin Panel</p>
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/admin'}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all mb-1 ${
              isActive
                ? 'bg-blue-50 text-blue-700'
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
