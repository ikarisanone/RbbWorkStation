import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { User, Mail, Shield, Briefcase, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/giris');
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Profilim - Proje Kalkanı</title>
        <meta name="description" content="Kullanıcı profil bilgilerinizi görüntüleyin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Profilim</h1>
          <p className="text-gray-400 mt-1">Kişisel bilgilerinizi ve hesap detaylarınızı görüntüleyin.</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-8"
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-5xl font-bold text-white">{user.name.charAt(0)}</span>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-white">{user.name}</h2>
              <p className="text-lg text-purple-400">{user.title}</p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">E-posta</p>
                <p className="font-medium text-white">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Rol</p>
                <p className="font-medium text-white capitalize">{user.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-8"
        >
          <h3 className="text-xl font-bold text-white mb-4">Hesap İşlemleri</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Çıkış Yap
            </Button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Profile;