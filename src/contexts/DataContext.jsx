import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = () => {
    // Demo verilerini yükle
    const demoProjects = [
      {
        id: '1',
        name: 'E-Ticaret Platformu',
        description: 'Modern e-ticaret web sitesi geliştirme projesi',
        status: 'active',
        manager: '2',
        members: ['2', '3'],
        createdAt: new Date('2024-01-15'),
        dueDate: new Date('2024-03-15'),
        progress: 65
      },
      {
        id: '2',
        name: 'Mobil Uygulama',
        description: 'iOS ve Android mobil uygulama geliştirme',
        status: 'active',
        manager: '2',
        members: ['3'],
        createdAt: new Date('2024-02-01'),
        dueDate: new Date('2024-04-01'),
        progress: 30
      }
    ];

    const demoTasks = [
      {
        id: '1',
        title: 'Kullanıcı Arayüzü Tasarımı',
        description: 'Ana sayfa ve ürün sayfalarının tasarımı',
        projectId: '1',
        assignedTo: '3',
        status: 'done',
        priority: 'high',
        createdAt: new Date('2024-01-16'),
        dueDate: new Date('2024-01-30'),
        tags: ['tasarım', 'ui'],
        comments: [],
        files: []
      },
      {
        id: '2',
        title: 'Veritabanı Şeması',
        description: 'Ürün ve kullanıcı tablolarının oluşturulması',
        projectId: '1',
        assignedTo: '3',
        status: 'progress',
        priority: 'high',
        createdAt: new Date('2024-01-20'),
        dueDate: new Date('2024-02-05'),
        tags: ['backend', 'database'],
        comments: [],
        files: []
      },
      {
        id: '3',
        title: 'Ödeme Sistemi Entegrasyonu',
        description: 'Stripe ödeme sistemi entegrasyonu',
        projectId: '1',
        assignedTo: '2',
        status: 'todo',
        priority: 'medium',
        createdAt: new Date('2024-02-01'),
        dueDate: new Date('2024-02-20'),
        tags: ['payment', 'integration'],
        comments: [],
        files: []
      }
    ];

    const demoUsers = [
      {
        id: '1',
        name: 'Süper Admin',
        email: 'admin@projekalkan.com',
        role: 'super_admin',
        title: 'Sistem Yöneticisi',
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Proje Yöneticisi',
        email: 'yonetici@projekalkan.com',
        role: 'admin',
        title: 'Ekip Lideri',
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date('2024-01-05')
      },
      {
        id: '3',
        name: 'Ekip Üyesi',
        email: 'uye@projekalkan.com',
        role: 'member',
        title: 'Yazılım Geliştirici',
        status: 'active',
        lastLogin: new Date(),
        createdAt: new Date('2024-01-10')
      }
    ];

    const demoRoles = [
      {
        id: 'super_admin',
        name: 'Süper Admin',
        description: 'Tüm sistem yetkilerine sahip ana yönetici',
        permissions: ['all'],
        isSystem: true
      },
      {
        id: 'admin',
        name: 'Yönetici',
        description: 'Proje yönetimi ve ekip liderliği yetkileri',
        permissions: ['create_project', 'edit_project', 'assign_users', 'create_task', 'edit_task', 'assign_task', 'change_status', 'add_file', 'comment', 'view_reports'],
        isSystem: true
      },
      {
        id: 'member',
        name: 'Ekip Üyesi',
        description: 'Standart kullanıcı yetkileri',
        permissions: ['create_task', 'edit_task', 'change_status', 'add_file', 'comment'],
        isSystem: true
      },
      {
        id: 'guest',
        name: 'Misafir',
        description: 'Sadece okuma yetkisi',
        permissions: ['view_only'],
        isSystem: true
      }
    ];

    const demoAuditLogs = [
      {
        id: '1',
        userId: '1',
        action: 'user_login',
        description: 'Sisteme giriş yapıldı',
        timestamp: new Date(),
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0.0.0'
      },
      {
        id: '2',
        userId: '2',
        action: 'project_created',
        description: 'E-Ticaret Platformu projesi oluşturuldu',
        timestamp: new Date(Date.now() - 3600000),
        ipAddress: '192.168.1.2',
        userAgent: 'Firefox/121.0.0.0'
      }
    ];

    setProjects(demoProjects);
    setTasks(demoTasks);
    setUsers(demoUsers);
    setRoles(demoRoles);
    setAuditLogs(demoAuditLogs);
  };

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
      progress: 0
    };
    setProjects(prev => [...prev, newProject]);
    toast({
      title: "Proje Oluşturuldu",
      description: `${project.name} projesi başarıyla oluşturuldu.`,
    });
  };

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    toast({
      title: "Proje Güncellendi",
      description: "Proje bilgileri başarıyla güncellendi.",
    });
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setTasks(prev => prev.filter(t => t.projectId !== id));
    toast({
      title: "Proje Silindi",
      description: "Proje ve tüm görevleri başarıyla silindi.",
    });
  };

  const addTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date(),
      comments: [],
      files: []
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Görev Oluşturuldu",
      description: `${task.title} görevi başarıyla oluşturuldu.`,
    });
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    toast({
      title: "Görev Güncellendi",
      description: "Görev bilgileri başarıyla güncellendi.",
    });
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    toast({
      title: "Görev Silindi",
      description: "Görev başarıyla silindi.",
    });
  };

  const addUser = (user) => {
    const newUser = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'active'
    };
    setUsers(prev => [...prev, newUser]);
    toast({
      title: "Kullanıcı Eklendi",
      description: `${user.name} başarıyla sisteme eklendi.`,
    });
  };

  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    toast({
      title: "Kullanıcı Güncellendi",
      description: "Kullanıcı bilgileri başarıyla güncellendi.",
    });
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(u => u.id !== id));
    toast({
      title: "Kullanıcı Silindi",
      description: "Kullanıcı başarıyla sistemden kaldırıldı.",
    });
  };

  const addRole = (role) => {
    const newRole = {
      ...role,
      id: Date.now().toString(),
      isSystem: false
    };
    setRoles(prev => [...prev, newRole]);
    toast({
      title: "Rol Oluşturuldu",
      description: `${role.name} rolü başarıyla oluşturuldu.`,
    });
  };

  const updateRole = (id, updates) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
    toast({
      title: "Rol Güncellendi",
      description: "Rol bilgileri başarıyla güncellendi.",
    });
  };

  const deleteRole = (id) => {
    setRoles(prev => prev.filter(r => r.id !== id));
    toast({
      title: "Rol Silindi",
      description: "Rol başarıyla silindi.",
    });
  };

  const addAuditLog = (log) => {
    const newLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  const value = {
    projects,
    tasks,
    users,
    roles,
    auditLogs,
    addProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    addUser,
    updateUser,
    deleteUser,
    addRole,
    updateRole,
    deleteRole,
    addAuditLog
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};