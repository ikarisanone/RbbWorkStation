import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import Projects from '@/pages/Projects';
import ProjectDetail from '@/pages/ProjectDetail';
import UserManagement from '@/pages/UserManagement';
import RoleManagement from '@/pages/RoleManagement';
import AuditLog from '@/pages/AuditLog';
import Profile from '@/pages/Profile';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Helmet>
            <title>Rbb Work Station - Güvenli Proje Yönetimi</title>
            <meta name="description" content="Yüksek güvenlikli, esnek rol yönetimi ile donatılmış modern proje yönetimi platformu. Asana tarzında güçlü özellikler." />
          </Helmet>
          
          <div className="min-h-screen">
            <Routes>
              <Route path="/giris" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<Navigate to="/panel" replace />} />
                <Route path="panel" element={<Dashboard />} />
                <Route path="projeler" element={<Projects />} />
                <Route path="projeler/:id" element={<ProjectDetail />} />
                <Route path="kullanicilar" element={<UserManagement />} />
                <Route path="roller" element={<RoleManagement />} />
                <Route path="guvenlik-kayitlari" element={<AuditLog />} />
                <Route path="profil" element={<Profile />} />
              </Route>
            </Routes>
          </div>
          
          <Toaster />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;