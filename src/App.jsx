
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
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
import { DialogProvider, useDialog } from '@/contexts/DialogContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { NewTaskDialog } from '@/components/dialogs/NewTaskDialog';
import { EditTaskDialog } from '@/components/dialogs/EditTaskDialog';
import { NewProjectDialog } from '@/components/dialogs/NewProjectDialog';
import { EditProjectDialog } from '@/components/dialogs/EditProjectDialog';
import { NewUserDialog } from '@/components/dialogs/NewUserDialog';
import { EditUserDialog } from '@/components/dialogs/EditUserDialog';
import { NewRoleDialog } from '@/components/dialogs/NewRoleDialog';
import { EditRoleDialog } from '@/components/dialogs/EditRoleDialog';

const dialogComponents = {
  newTaskDialog: NewTaskDialog,
  editTaskDialog: EditTaskDialog,
  newProjectDialog: NewProjectDialog,
  editProjectDialog: EditProjectDialog,
  newUserDialog: NewUserDialog,
  editUserDialog: EditUserDialog,
  newRoleDialog: NewRoleDialog,
  editRoleDialog: EditRoleDialog,
};

const DialogRenderer = () => {
  const { dialogs } = useDialog();
  return (
    <>
      {dialogs.map(({ id, props }) => {
        const Component = dialogComponents[id];
        return Component ? <Component key={id} dialogId={id} {...props} /> : null;
      })}
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
        <Router>
            <DataProvider>
                <DialogProvider>
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
                            <Route path="projeler/:projectId" element={<ProjectDetail />} />
                            <Route path="kullanicilar" element={<UserManagement />} />
                            <Route path="roller" element={<RoleManagement />} />
                            <Route path="guvenlik-kayitlari" element={<AuditLog />} />
                            <Route path="profil" element={<Profile />} />
                            </Route>
                        </Routes>
                    </div>
                    
                    <Toaster />
                    <DialogRenderer />
                </DialogProvider>
            </DataProvider>
        </Router>
    </ThemeProvider>
  );
}

export default App;
