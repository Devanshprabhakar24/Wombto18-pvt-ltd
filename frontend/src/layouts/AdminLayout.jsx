import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="flex flex-1">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 p-6 md:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
