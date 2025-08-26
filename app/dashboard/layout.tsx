import { DashboardProvider } from "../../contexts/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </DashboardProvider>
  );
}