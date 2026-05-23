import React, { useEffect, ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from './store';
import ErrorBoundary from './components/ErrorBoundary';

// New Premium Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import PatientForm from './pages/PatientForm';
import PatientProfile from './pages/PatientProfile';
import CaseStudy from './pages/CaseStudy';
import Appointments from './pages/Appointments';
import VideoConsultation from './pages/VideoConsultation';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';

// Keep existing Stitch-exported pages as fallbacks
import PrescriptionDashboard from './pages/PrescriptionDashboard';
import ReportsDashboard from './pages/ReportsDashboard';
import MedicalRecordsRepository from './pages/MedicalRecordsRepository';
import BooksDashboard from './pages/BooksDashboard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } }
});

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, token } = useAuthStore();
  const localToken = token || localStorage.getItem('token');
  if (!localToken) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

interface ThemeWrapperProps {
  children: ReactNode;
}

function ThemeWrapper({ children }: ThemeWrapperProps) {
  const { theme } = useUIStore();
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeWrapper>
          <BrowserRouter>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Protected - Core New System */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
              <Route path="/patients/new" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
              <Route path="/patients/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
              <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
              <Route path="/case-study/:patientId" element={<ProtectedRoute><CaseStudy /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
              <Route path="/video-consultation" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

              {/* Additional pages (kept from original Stitch export) */}
              <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionDashboard /></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><ReportsDashboard /></ProtectedRoute>} />
              <Route path="/medical-records" element={<ProtectedRoute><MedicalRecordsRepository /></ProtectedRoute>} />
              <Route path="/books" element={<ProtectedRoute><BooksDashboard /></ProtectedRoute>} />

              {/* Legacy redirects */}
              <Route path="/dashboard-appointments" element={<Navigate to="/appointments" replace />} />
              <Route path="/follow-ups" element={<Navigate to="/appointments" replace />} />
              <Route path="/calendar" element={<Navigate to="/appointments" replace />} />

              {/* 404 */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ThemeWrapper>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
