import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

const priorityOrder = { high: 3, medium: 2, low: 1 };

const sortTasks = (tasks) => {
  return tasks.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }
    const dateA = a.due_date ? new Date(a.due_date) : 0;
    const dateB = b.due_date ? new Date(b.due_date) : 0;
    return dateA - dateB;
  });
};

export const DataProvider = ({ children }) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (table, setter, errorMessage) => {
    try {
      const { data, error } = await supabase.from(table).select('*');
      if (error) throw error;
      if (table === 'tasks') {
        const { data: assignees, error: assigneesError } = await supabase.from('task_assignees').select('*');
        if (assigneesError) throw assigneesError;
        
        const tasksWithAssignees = data.map(task => {
          const taskAssignees = assignees.filter(a => a.task_id === task.id).map(a => a.user_id);
          return { ...task, assignedTo: taskAssignees };
        });
        setter(sortTasks(tasksWithAssignees));
      } else {
        setter(data);
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Veri Yükleme Hatası',
        description: `${errorMessage}: ${error.message}`,
      });
    }
  }, [toast]);

  const loadInitialData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    await Promise.all([
      fetchData('projects', setProjects, 'Projeler yüklenemedi'),
      fetchData('tasks', setTasks, 'Görevler yüklenemedi'),
      fetchData('users', setUsers, 'Kullanıcılar yüklenemedi'),
      fetchData('roles', setRoles, 'Roller yüklenemedi'),
      fetchData('audit_logs', setAuditLogs, 'Güvenlik kayıtları yüklenemedi'),
      fetchData('notifications', setNotifications, 'Bildirimler yüklenemedi'),
    ]);
    setLoading(false);
  }, [user, fetchData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const addProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert({
        name: projectData.name,
        description: projectData.description,
        created_by: profile.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Hata", description: "Proje oluşturulamadı: " + error.message, variant: "destructive" });
      return;
    }

    const { error: memberError } = await supabase
      .from('project_members')
      .insert({ project_id: data.id, user_id: profile.id });

    if (memberError) {
      toast({ title: "Hata", description: "Proje üyesi eklenemedi: " + memberError.message, variant: "destructive" });
      return;
    }
    
    setProjects(prev => [...prev, data]);
    toast({ title: "Proje Oluşturuldu", description: `${data.name} projesi başarıyla oluşturuldu.` });
  };
  
  const updateProject = async (id, updates) => {
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().single();
    if(error){ toast({title: "Hata", description: "Proje güncellenemedi: " + error.message, variant: "destructive"}); return; }
    setProjects(prev => prev.map(p => p.id === id ? data : p));
    toast({ title: "Proje Güncellendi", description: "Proje bilgileri başarıyla güncellendi." });
  };
  
  const deleteProject = async (id) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if(error){ toast({title: "Hata", description: "Proje silinemedi: " + error.message, variant: "destructive"}); return; }
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.project_id !== id));
    toast({ title: "Proje Silindi", description: "Proje başarıyla silindi." });
  };

  const addTask = async (taskData) => {
    const { assignedTo, ...rest } = taskData;
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...rest, created_by: profile.id, project_id: taskData.projectId, due_date: taskData.dueDate })
      .select()
      .single();
    
    if (error) {
       toast({ title: "Hata", description: "Görev oluşturulamadı: " + error.message, variant: "destructive" });
       return;
    }

    const assigneePromises = assignedTo.map(userId => 
      supabase.from('task_assignees').insert({ task_id: data.id, user_id: userId })
    );
    const results = await Promise.all(assigneePromises);
    const assignError = results.find(r => r.error);

    if (assignError) {
       toast({ title: "Hata", description: "Göreve üye atanamadı: " + assignError.error.message, variant: "destructive" });
       await supabase.from('tasks').delete().eq('id', data.id);
       return;
    }
    
    const newTaskWithAssignees = { ...data, assignedTo };
    setTasks(prev => sortTasks([...prev, newTaskWithAssignees]));
    toast({ title: "Görev Oluşturuldu", description: `${data.title} görevi başarıyla oluşturuldu.` });
  };

  const updateTask = async (id, updates) => {
    const { assignedTo, ...taskUpdates } = updates;
    const { data, error } = await supabase.from('tasks').update(taskUpdates).eq('id', id).select().single();
    if(error){ toast({title: "Hata", description: "Görev güncellenemedi: " + error.message, variant: "destructive"}); return; }
    
    let finalAssignees = tasks.find(t => t.id === id)?.assignedTo || [];

    if (assignedTo) {
      await supabase.from('task_assignees').delete().eq('task_id', id);
      const assigneePromises = assignedTo.map(userId => 
        supabase.from('task_assignees').insert({ task_id: id, user_id: userId })
      );
      await Promise.all(assigneePromises);
      finalAssignees = assignedTo;
    }

    const updatedTask = { ...data, assignedTo: finalAssignees };
    setTasks(prev => sortTasks(prev.map(t => t.id === id ? updatedTask : t)));
    toast({ title: "Görev Güncellendi", description: "Görev bilgileri başarıyla güncellendi." });
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if(error){ toast({title: "Hata", description: "Görev silinemedi: " + error.message, variant: "destructive"}); return; }
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({ title: "Görev Silindi", description: "Görev başarıyla silindi." });
  };
  
  const addUser = async (userData) => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
            data: {
                name: userData.name,
            }
        }
    });

    if (authError) {
        toast({ title: "Kullanıcı Oluşturma Hatası", description: authError.message, variant: "destructive" });
        return;
    }

    if (authData.user) {
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update({ role: userData.role, name: userData.name, title: userData.title })
            .eq('auth_id', authData.user.id)
            .select()
            .single();

        if (updateError) {
            toast({ title: "Kullanıcı Güncelleme Hatası", description: updateError.message, variant: "destructive" });
            return;
        }

        setUsers(prev => [...prev, updatedUser]);
        toast({ title: "Kullanıcı Eklendi", description: `${updatedUser.name} başarıyla sisteme eklendi.` });
    }
  };

  const updateUser = async (id, updates) => {
    const { password, ...userUpdates } = updates;
    const { data, error } = await supabase.from('users').update(userUpdates).eq('id', id).select().single();
    if(error){ toast({title: "Hata", description: "Kullanıcı güncellenemedi: " + error.message, variant: "destructive"}); return; }
    
    if(password){
        const { error: passError } = await supabase.auth.admin.updateUserById(data.auth_id, { password });
        if(passError) { toast({title: "Hata", description: "Şifre güncellenemedi: " + passError.message, variant: "destructive"}); }
    }

    setUsers(prev => prev.map(u => u.id === id ? data : u));
    toast({ title: "Kullanıcı Güncellendi", description: "Kullanıcı bilgileri başarıyla güncellendi." });
  };

  const deleteUser = async (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (!userToDelete) return;
    const { error } = await supabase.auth.admin.deleteUser(userToDelete.auth_id);
    if(error){ toast({title: "Hata", description: "Kullanıcı silinemedi: " + error.message, variant: "destructive"}); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({ title: "Kullanıcı Silindi", description: "Kullanıcı başarıyla sistemden kaldırıldı." });
  };

  const addRole = async (roleData) => {
      const { data, error } = await supabase.from('roles').insert(roleData).select().single();
      if(error){ toast({title: "Hata", description: "Rol oluşturulamadı: " + error.message, variant: "destructive"}); return; }
      setRoles(prev => [...prev, data]);
      toast({ title: "Rol Oluşturuldu", description: `${data.name} rolü başarıyla oluşturuldu.` });
  };

  const updateRole = async (id, updates) => {
      const { data, error } = await supabase.from('roles').update(updates).eq('id', id).select().single();
      if(error){ toast({title: "Hata", description: "Rol güncellenemedi: " + error.message, variant: "destructive"}); return; }
      setRoles(prev => prev.map(r => r.id === id ? data : r));
      toast({ title: "Rol Güncellendi", description: "Rol bilgileri başarıyla güncellendi." });
  };

  const deleteRole = async (id) => {
      const { error } = await supabase.from('roles').delete().eq('id', id);
      if(error){ toast({title: "Hata", description: "Rol silinemedi: " + error.message, variant: "destructive"}); return; }
      setRoles(prev => prev.filter(r => r.id !== id));
      toast({ title: "Rol Silindi", description: "Rol başarıyla silindi." });
  };

  const markAllNotificationsAsRead = async () => {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile.id);
    if(!error) {
      setNotifications(prev => prev.map(n => ({...n, is_read: true})));
      toast({ title: "Bildirimler", description: "Tüm bildirimler okundu olarak işaretlendi." });
    }
  };

  const value = {
    projects, tasks, users, roles, auditLogs, notifications, loading,
    addProject, updateProject, deleteProject,
    addTask, updateTask, deleteTask,
    addUser, updateUser, deleteUser,
    addRole, updateRole, deleteRole,
    markAllNotificationsAsRead
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};
