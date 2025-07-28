import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Edit, 
  Save, 
  X, 
  Eye, 
  EyeOff,
  Lock,
  Smartphone,
  Key,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profil Güncellendi",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Şifre Değiştirildi",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleEnable2FA = () => {
    toast({
      title: "İki Faktörlü Kimlik Doğrulama",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'super_admin': return 'Süper Admin';
      case 'admin': return 'Yönetici';
      case 'member': return 'Ekip Üyesi';
      case 'guest': return 'Misafir';
      default: return 'Bilinmiyor';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'role-super-admin';
      case 'admin': return 'role-admin';
      case 'member': return 'role-member';
      case 'guest': return 'role-guest';
      default: return 'role-guest';
    }
  };

  return (
    <>
      <Helmet>
        <title>Profil - Proje Kalkanı</title>
        <meta name="description" content="Profil bilgilerinizi görüntüleyin ve düzenleyin. Güvenlik ayarlarınızı yönetin." />
      </Helmet>

      <div className="space-y-6">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Profil</h1>
            <p className="text-gray-400 mt-1">Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profil Bilgileri */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Temel Bilgiler */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Temel Bilgiler</h2>
                <Button
                  variant={isEditing ? "outline" : "ghost"}
                  size="icon"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </Button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">{user?.name?.charAt(0)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ad Soyad
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{user?.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      E-posta Adresi
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{user?.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unvan
                    </label>
                    {isEditing ? (
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{user?.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Rol
                    </label>
                    <span className={`role-badge ${getRoleColor(user?.role)}`}>
                      {getRoleName(user?.role)}
                    </span>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleSaveProfile}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Kaydet
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Şifre Değiştirme */}
            <div className="glass-effect rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Şifre Güvenliği</h2>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Şifre Değiştir
                </Button>
              </div>

              {showPasswordForm && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <div className="relative">
                      <Input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      İptal
                    </Button>
                    <Button
                      onClick={handleChangePassword}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                    >
                      Şifreyi Değiştir
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h3 className="text-blue-300 font-medium mb-2">Güçlü Şifre Önerileri</h3>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• En az 8 karakter uzunluğunda olmalı</li>
                  <li>• Büyük ve küçük harf içermeli</li>
                  <li>• En az bir rakam içermeli</li>
                  <li>• Özel karakter (!@#$%^&*) içermeli</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Yan Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Hesap İstatistikleri */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Hesap İstatistikleri</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400 text-sm">Üyelik Tarihi</span>
                  </div>
                  <span className="text-white text-sm">15 Ocak 2024</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-400" />
                    <span className="text-gray-400 text-sm">Son Giriş</span>
                  </div>
                  <span className="text-white text-sm">Bugün</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span className="text-gray-400 text-sm">Güvenlik Skoru</span>
                  </div>
                  <span className="text-green-400 text-sm font-medium">Yüksek</span>
                </div>
              </div>
            </div>

            {/* Güvenlik Ayarları */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Güvenlik Ayarları</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium text-sm">İki Faktörlü Kimlik Doğrulama</p>
                      <p className="text-gray-400 text-xs">Ekstra güvenlik katmanı</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleEnable2FA}
                  >
                    Etkinleştir
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium text-sm">API Anahtarları</p>
                      <p className="text-gray-400 text-xs">Entegrasyon anahtarları</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({
                      title: "API Anahtarları",
                      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
                    })}
                  >
                    Yönet
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Activity className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-white font-medium text-sm">Oturum Yönetimi</p>
                      <p className="text-gray-400 text-xs">Aktif oturumlar</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({
                      title: "Oturum Yönetimi",
                      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
                    })}
                  >
                    Görüntüle
                  </Button>
                </div>
              </div>
            </div>

            {/* Bildirim Tercihleri */}
            <div className="glass-effect rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">Bildirim Tercihleri</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">E-posta Bildirimleri</span>
                  <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Görev Bildirimleri</span>
                  <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">Güvenlik Uyarıları</span>
                  <button className="w-10 h-6 bg-blue-500 rounded-full relative">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;