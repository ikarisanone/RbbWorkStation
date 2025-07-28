import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    // Projeler
    const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*');
    if (projectsError) toast({ title: "Proje verisi alınamadı", description: projectsError.message, variant: "destructive" });
    setProjects(projectsData || []);

    // Görevler
    const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*');
    if (tasksError) toast({ title: "Görev verisi alınamadı", description: tasksError.message, variant: "destructive" });
    setTasks(tasksData || []);

    // Kullanıcılar
    const { data: usersData, error: usersError } = await supabase.from('users').select('*');
    if (usersError) toast({ title: "Kullanıcı verisi alınamadı", description: usersError.message, variant: "destructive" });
    setUsers(usersData || []);

    // Roller
    const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*');
    if (rolesError) toast({ title: "Rol verisi alınamadı", description: rolesError.message, variant: "destructive" });
    setRoles(rolesData || []);

    // Audit Log
    const { data: auditLogsData, error: auditLogsError } = await supabase.from('audit_logs').select('*');
    if (auditLogsError) toast({ title: "Log verisi alınamadı", description: auditLogsError.message, variant: "destructive" });
    setAuditLogs(auditLogsData || []);

    setLoading(false);
  };

  // CRUD fonksiyonlarını da Supabase ile yazmalısınız (örnek: addProject)
  // Burada sadece okuma işlemi örneği verildi.

  const value = {
    projects,
    tasks,
    users,
    roles,
    auditLogs,
    loading,
    // addProject, updateProject, ... (Supabase ile yazılmalı)
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
    // ...
    useEffect(() => {
      async function fetchData() {
        const { data: users } = await supabase.from('users').select('*');
        setUsers(users || []);
      }
      fetchData();
    }, []);
};