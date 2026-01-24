import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
// import { useAuthStore } from '@/stores/auth-store';

// Layouts
import MarketingLayout from '@/components/layout/MarketingLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';

// Marketing Pages
import Landing from '@/pages/Landing';
// import Login from '@/pages/Login';
// import Register from '@/pages/Register';

// Dashboard Pages
import Dashboard from '@/pages/dashboard/Dashboard';
import Accounts from '@/pages/dashboard/Accounts';
import Campaigns from '@/pages/dashboard/Campaigns';
import Analytics from '@/pages/dashboard/Analytics';
import Recommendations from '@/pages/dashboard/Recommendations';
import Chat from '@/pages/dashboard/Chat';
import Automation from '@/pages/dashboard/Automation';
import Predictions from '@/pages/dashboard/Predictions';
import Competitors from '@/pages/dashboard/Competitors';
import Journeys from '@/pages/dashboard/Journeys';
import CreativeLab from '@/pages/dashboard/CreativeLab';
import Reports from '@/pages/dashboard/Reports';
import Settings from '@/pages/dashboard/Settings';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // const { isAuthenticated, isLoading } = useAuthStore();

  //   if (isLoading) {
  //     return (
  //       <div className="flex h-screen items-center justify-center">
  //         <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  //       </div>
  //     );
  //   }

  //   if (!isAuthenticated) {
  //     return <Navigate to="/login" replace />;
  //   }

  return <>{children}</>;
};

function App() {
  return (
    <>
      <Routes>
        {/* Marketing routes */}
        <Route element={<MarketingLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="/register" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Dashboard routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="chat" element={<Chat />} />
          <Route path="automation" element={<Automation />} />
          <Route path="predictions" element={<Predictions />} />
          <Route path="competitors" element={<Competitors />} />
          <Route path="journeys" element={<Journeys />} />
          <Route path="creative-lab" element={<CreativeLab />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
