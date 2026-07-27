import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import CandidateProfile from './pages/CandidateProfile';
import JobListings from './pages/JobListings';
import JobDetails from './pages/JobDetails';
import CreateJob from './pages/CreateJob';
import EditJob from './pages/EditJob';
import Applicants from './pages/Applicants';
import CandidateDetails from './pages/CandidateDetails';
import MatchingResults from './pages/MatchingResults';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

import { ROLES } from './utils/constants';

export default function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected routes: any authenticated role */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<JobListings />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/settings" element={<Settings />} />

            {/* Candidate-only routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.CANDIDATE]} />}>
              <Route path="/upload-resume" element={<UploadResume />} />
              <Route path="/profile" element={<CandidateProfile />} />
              <Route path="/matching-results" element={<MatchingResults />} />
            </Route>

            {/* Recruiter & Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={[ROLES.RECRUITER, ROLES.ADMIN]} />}>
              <Route path="/jobs/create" element={<CreateJob />} />
              <Route path="/jobs/:id/edit" element={<EditJob />} />
              <Route path="/applicants" element={<Applicants />} />
              <Route path="/candidates/:id" element={<CandidateDetails />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
            </Route>
          </Route>
        </Route>

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
      />
    </>
  );
}
