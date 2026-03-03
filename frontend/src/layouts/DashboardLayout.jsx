import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout() {
  return (
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
