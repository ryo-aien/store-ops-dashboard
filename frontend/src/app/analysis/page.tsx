'use client';

import { KpiAnalysisView } from '@/components/admin/KpiAnalysisView';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AnalysisPage() {
  return (
    <AdminLayout activeNav="analysis">
      <KpiAnalysisView />
    </AdminLayout>
  );
}
