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
  // Supabase şemasına göre state'ler
  const [profiles, setProfiles] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [taskComments, setTaskComments] = useState([]);
  const [appSettings, setAppSettings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    // Profiller
    const { data: profilesData, error: profilesError } = await supabase.from('profiles').select('*');
    if (profilesError) toast({ title: "Profil verisi alınamadı", description: profilesError.message, variant: "destructive" });
    setProfiles(profilesData || []);

    // Projeler
    const { data: projectsData, error: projectsError } = await supabase.from('projects').select('*');
    if (projectsError) toast({ title: "Proje verisi alınamadı", description: projectsError.message, variant: "destructive" });
    setProjects(projectsData || []);

    // Görevler
    const { data: tasksData, error: tasksError } = await supabase.from('tasks').select('*');
    if (tasksError) toast({ title: "Görev verisi alınamadı", description: tasksError.message, variant: "destructive" });
    setTasks(tasksData || []);

    // Roller
    const { data: rolesData, error: rolesError } = await supabase.from('roles').select('*');
    if (rolesError) toast({ title: "Rol verisi alınamadı", description: rolesError.message, variant: "destructive" });
    setRoles(rolesData || []);

    // Audit Log
    const { data: auditLogsData, error: auditLogsError } = await supabase.from('audit_logs').select('*');
    if (auditLogsError) toast({ title: "Log verisi alınamadı", description: auditLogsError.message, variant: "destructive" });
    setAuditLogs(auditLogsData || []);

    // Proje Üyeleri
    const { data: projectMembersData, error: projectMembersError } = await supabase.from('project_members').select('*');
    if (projectMembersError) toast({ title: "Proje üyesi verisi alınamadı", description: projectMembersError.message, variant: "destructive" });
    setProjectMembers(projectMembersData || []);

    // Görev Yorumları
    const { data: taskCommentsData, error: taskCommentsError } = await supabase.from('task_comments').select('*');
    if (taskCommentsError) toast({ title: "Yorum verisi alınamadı", description: taskCommentsError.message, variant: "destructive" });
    setTaskComments(taskCommentsData || []);

    // Ayarlar
    const { data: appSettingsData, error: appSettingsError } = await supabase.from('app_settings').select('*');
    if (appSettingsError) toast({ title: "Ayar verisi alınamadı", description: appSettingsError.message, variant: "destructive" });
    setAppSettings(appSettingsData || []);

    // Bildirimler
    const { data: notificationsData, error: notificationsError } = await supabase.from('notifications').select('*');
    if (notificationsError) toast({ title: "Bildirim verisi alınamadı", description: notificationsError.message, variant: "destructive" });
    setNotifications(notificationsData || []);

    setLoading(false);
  };

  // CRUD fonksiyonları (her tablo için)
  // Profiles
  const addProfile = async (profile) => {
    const { error } = await supabase.from('profiles').insert([profile]);
    if (error) toast({ title: "Kullanıcı eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const updateProfile = async (id, updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id);
    if (error) toast({ title: "Kullanıcı güncellenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteProfile = async (id) => {
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) toast({ title: "Kullanıcı silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Roles
  const addRole = async (role) => {
    const { error } = await supabase.from('roles').insert([role]);
    if (error) toast({ title: "Rol eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const updateRole = async (id, updates) => {
    const { error } = await supabase.from('roles').update(updates).eq('id', id);
    if (error) toast({ title: "Rol güncellenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteRole = async (id) => {
    const { error } = await supabase.from('roles').delete().eq('id', id);
    if (error) toast({ title: "Rol silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Projects
  const addProject = async (project) => {
    const { error } = await supabase.from('projects').insert([project]);
    if (error) toast({ title: "Proje eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const updateProject = async (id, updates) => {
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (error) toast({ title: "Proje güncellenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) toast({ title: "Proje silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Tasks
  const addTask = async (task) => {
    const { error } = await supabase.from('tasks').insert([task]);
    if (error) toast({ title: "Görev eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const updateTask = async (id, updates) => {
    const { error } = await supabase.from('tasks').update(updates).eq('id', id);
    if (error) toast({ title: "Görev güncellenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) toast({ title: "Görev silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Audit Logs
  const addAuditLog = async (log) => {
    const { error } = await supabase.from('audit_logs').insert([log]);
    if (error) toast({ title: "Log eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Project Members
  const addProjectMember = async (member) => {
    const { error } = await supabase.from('project_members').insert([member]);
    if (error) toast({ title: "Proje üyesi eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteProjectMember = async (id) => {
    const { error } = await supabase.from('project_members').delete().eq('id', id);
    if (error) toast({ title: "Proje üyesi silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Task Comments
  const addTaskComment = async (comment) => {
    const { error } = await supabase.from('task_comments').insert([comment]);
    if (error) toast({ title: "Yorum eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteTaskComment = async (id) => {
    const { error } = await supabase.from('task_comments').delete().eq('id', id);
    if (error) toast({ title: "Yorum silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // Notifications
  const addNotification = async (notification) => {
    const { error } = await supabase.from('notifications').insert([notification]);
    if (error) toast({ title: "Bildirim eklenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };
  const deleteNotification = async (id) => {
    const { error } = await supabase.from('notifications').delete().eq('id', id);
    if (error) toast({ title: "Bildirim silinemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  // App Settings
  const updateAppSetting = async (id, updates) => {
    const { error } = await supabase.from('app_settings').update(updates).eq('id', id);
    if (error) toast({ title: "Ayar güncellenemedi", description: error.message, variant: "destructive" });
    else fetchAllData();
  };

  const value = {
    profiles,
    projects,
    tasks,
    roles,
    auditLogs,
    projectMembers,
    taskComments,
    appSettings,
    notifications,
    loading,
    fetchAllData,
    // CRUD fonksiyonları
    addProfile, updateProfile, deleteProfile,
    addRole, updateRole, deleteRole,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask,
    addAuditLog,
    addProjectMember, deleteProjectMember,
    addTaskComment, deleteTaskComment,
    addNotification, deleteNotification,
    updateAppSetting
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};