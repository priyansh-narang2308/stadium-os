import { SiteHeader } from "@/src/components/layout/site-header";
import { OperationsDashboard } from "@/src/features/operations-dashboard/operations-dashboard";

export default function OperationsPage() {
  return (
    <>
      <SiteHeader />
      <OperationsDashboard />
    </>
  );
}
