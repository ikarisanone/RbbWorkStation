import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('proje_kalkani_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Demo kullanıcıları
      const demoUsers = [
        {
          id: '1',
          email: 'admin@projekalkan.com',
          password: 'Admin123!',
          name: 'Süper Admin',
          role: 'super_admin',
          title: 'Sistem Yöneticisi',
          avatar: null,
          permissions: ['all']
        },
        {
          id: '2',
          email: 'yonetici@projekalkan.com',
          password: 'Yonetici123!',
          name: 'Proje Yöneticisi',
          role: 'admin',
          title: 'Ekip Lideri',
          avatar: null,
          permissions: ['create_project', 'edit_project', 'assign_users', 'create_task', 'edit_task', 'assign_task', 'change_status', 'add_file', 'comment', 'view_reports']
        },
        {
          id: '3',
          email: 'uye@projekalkan.com',
          password: 'Uye123!',
          name: 'Ekip Üyesi',
          role: 'member',
          title: 'Yazılım Geliştirici',
          avatar: null,
          permissions: ['create_task', 'edit_task', 'change_status', 'add_file', 'comment']
        }
      ];

      const foundUser = demoUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Geçersiz e-posta veya şifre');
      }

      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;

      setUser(userWithoutPassword);
      localStorage.setItem('proje_kalkani_user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Giriş Başarılı",
        description: `Hoş geldiniz, ${userWithoutPassword.name}!`,
      });

      return userWithoutPassword;
    } catch (error) {
      toast({
        title: "Giriş Hatası",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('proje_kalkani_user');
    toast({
      title: "Çıkış Yapıldı",
      description: "Güvenle çıkış yaptınız.",
    });
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const value = {
    user,
    login,
    logout,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};