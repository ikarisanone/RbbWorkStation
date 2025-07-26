
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
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
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (session) => {
    if (session?.user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`*, roles(*)`)
        .eq('id', session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        setUser(null);
      } else {
        setUser(profile);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    const getSessionAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      await fetchUserProfile(session);
      setLoading(false);
    };

    getSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        await fetchUserProfile(session);
        if (_event === 'SIGNED_IN') {
          setLoading(false);
        }
        if (_event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast({ title: "Giriş Hatası", description: error.message, variant: "destructive" });
      throw error;
    }
    toast({ title: "Giriş Başarılı!", description: `Hoş geldiniz!` });
    return data;
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Çıkış Hatası", description: error.message, variant: "destructive" });
    } else {
      setUser(null);
      setSession(null);
      toast({ title: "Çıkış Yapıldı", description: "Güvenle çıkış yaptınız." });
    }
  };
  
  const updateUserMetadata = async (metadata) => {
     const { data, error } = await supabase.from('profiles').update(metadata).eq('id', user.id).select('*, roles(*)').single();
      if(error){
          toast({ title: "Hata", description: `Profil güncellenemedi: ${error.message}`, variant: "destructive"});
          return;
      }
      setUser(data);
      toast({ title: "Başarılı", description: "Profil bilgileriniz güncellendi."});
  };

  const updatePassword = async (newPassword) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Hata", description: `Şifre güncellenemedi: ${error.message}`, variant: "destructive" });
    } else {
      toast({ title: "Başarılı", description: "Şifreniz başarıyla güncellendi." });
    }
  };

  const hasPermission = (permission) => {
    if (!user || !user.roles || !user.roles.permissions) return false;
    if (user.roles.permissions.includes('all')) return true;
    return user.roles.permissions.includes(permission);
  };

  const value = {
    session,
    user,
    login,
    logout,
    hasPermission,
    loading,
    updateUserMetadata,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
