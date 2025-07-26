
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DataContext = createContext();

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }) => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [appSettings, setAppSettings] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const [
                projectsRes,
                tasksRes,
                usersRes,
                rolesRes,
                auditLogsRes,
                notificationsRes,
                appSettingsRes,
            ] = await Promise.all([
                supabase.from('projects').select('*, project_members(user_id)'),
                supabase.from('tasks').select('*, task_comments(*)'),
                supabase.from('profiles').select('*, roles(id, name)'),
                supabase.from('roles').select('*'),
                supabase.from('audit_logs').select('*').order('timestamp', { ascending: false }).limit(100),
                supabase.from('notifications').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }),
                supabase.from('app_settings').select('*').single(),
            ]);

            const errors = [
                projectsRes.error, tasksRes.error, usersRes.error, rolesRes.error,
                auditLogsRes.error, notificationsRes.error, appSettingsRes.error
            ].filter(Boolean);

            if (errors.length > 0) {
                throw new Error(errors.map(e => e.message).join(', '));
            }

            setProjects(projectsRes.data.map(p => ({...p, members: p.project_members.map(m => m.user_id)})));
            setTasks(tasksRes.data);
            setUsers(usersRes.data.map(u => ({...u, role: u.roles?.id, role_name: u.roles?.name})));
            setRoles(rolesRes.data);
            setAuditLogs(auditLogsRes.data);
            setNotifications(notificationsRes.data);
            setAppSettings(appSettingsRes.data);

        } catch (error) {
            console.error('Veri alınırken hata:', error);
            toast({ title: "Veri Alınamadı", description: `Bir hata oluştu: ${error.message}`, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const addAuditLog = async (log) => {
        const { error } = await supabase.from('audit_logs').insert({ ...log, user_id: user?.id });
        if (error) {
          toast({ title: 'Denetim kaydı hatası', description: error.message, variant: "destructive" });
        }
    };
    
    const addProject = async (projectData) => {
        const { data, error } = await supabase.from('projects').insert(projectData).select().single();
        if (error) throw error;
        setProjects(prev => [...prev, {...data, members:[]}]);
        toast({ title: "Proje Oluşturuldu" });
    };

    const updateProject = async (id, updates) => {
        const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
        if (error) throw error;
        setProjects(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
        toast({ title: "Proje Güncellendi" });
    };

    const deleteProject = async (id) => {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) throw error;
        setProjects(prev => prev.filter(p => p.id !== id));
        toast({ title: "Proje Silindi" });
    };

    const addTask = async (taskData) => {
        const { data, error } = await supabase.from('tasks').insert(taskData).select().single();
        if (error) throw error;
        setTasks(prev => [...prev, data]);
        toast({ title: "Görev Oluşturuldu" });
    };

    const updateTask = async (id, updates) => {
        const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
        if (error) throw error;
        setTasks(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
        toast({ title: "Görev Güncellendi" });
    };

    const deleteTask = async (id) => {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) throw error;
        setTasks(prev => prev.filter(t => t.id !== id));
        toast({ title: "Görev Silindi" });
    };
    
    const addTaskComment = async (commentData) => {
        const { data, error } = await supabase.from('task_comments').insert({ ...commentData, user_id: user.id }).select().single();
        if (error) throw error;
        await fetchData();
        toast({ title: "Yorum Eklendi" });
    };

    const addUser = async (userData) => {
        const { email, password, name, role, title } = userData;
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role,
              title
            }
          }
        });
        if (authError) throw authError;
        await fetchData();
        toast({ title: "Kullanıcı Oluşturuldu" });
        return authData;
    };

    const updateUser = async (id, updates) => {
        const { data, error } = await supabase.from('profiles').update(updates).eq('id', id).select('*, roles(id, name)').single();
        if (error) throw error;
        setUsers(prev => prev.map(u => u.id === id ? {...u, ...data, role: data.roles.id, role_name: data.roles.name} : u));
        toast({ title: "Kullanıcı Güncellendi" });
    };
    
    const deleteUser = async (userId) => {
        const { error } = await supabase.rpc('delete_user', { user_id_to_delete: userId });
        if (error) throw error;
        setUsers(prev => prev.filter(u => u.id !== userId));
        toast({ title: "Kullanıcı Silindi" });
    };
    
    const addRole = async (role) => {
        const { data, error } = await supabase.from('roles').insert(role).select().single();
        if(error) throw error;
        setRoles(prev => [...prev, data]);
        toast({title: "Rol Oluşturuldu"});
    };
    
    const updateRole = async (id, updates) => {
        const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select().single();
        if(error) throw error;
        setRoles(prev => prev.map(r => r.id === id ? data : r));
        toast({ title: "Rol Güncellendi" });
    };
    
    const deleteRole = async (id) => {
        const { error } = await supabase.from('roles').delete().eq('id', id);
        if (error) throw error;
        setRoles(prev => prev.filter(r => r.id !== id));
        toast({ title: "Rol Silindi" });
    };
    
    const addNotification = async (notification) => {
        const { error } = await supabase.from('notifications').insert(notification);
        if (error) throw error;
    };

    const markNotificationAsRead = async (id) => {
        const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
        if (error) throw error;
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const updateAppSettings = async (settings) => {
        const { error } = await supabase.from('app_settings').update(settings).eq('id', appSettings.id);
        if (error) throw error;
        setAppSettings(prev => ({...prev, ...settings}));
        toast({ title: "Ayarlar Güncellendi" });
    };
    
    const value = {
        loading,
        projects, addProject, updateProject, deleteProject,
        tasks, addTask, updateTask, deleteTask, addTaskComment,
        users, addUser, updateUser, deleteUser,
        roles, addRole, updateRole, deleteRole,
        auditLogs, addAuditLog,
        notifications, addNotification, markNotificationAsRead,
        appSettings, updateAppSettings,
        fetchData
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
