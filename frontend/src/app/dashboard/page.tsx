'use client';

import { DashboardView } from '@/components/admin/DashboardView';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function DashboardPage() {
  return (
    <AdminLayout activeNav="dashboard">
      <DashboardView />
    </AdminLayout>
  );
}
