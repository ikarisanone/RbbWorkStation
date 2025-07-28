import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Shield, 
  Edit, 
  Trash2, 
  Settings,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const RoleManagement = () => {
  const { roles, users } = useData();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  // Sadece süper admin erişebilir
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2>
          <p className="text-gray-400">Bu sayfaya sadece Süper Admin erişebilir.</p>
        </div>
      </div>
    );
  }

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const availablePermissions = [
    { id: 'create_project', name: 'Proje Oluşturma', description: 'Yeni proje oluşturabilir' },
    { id: 'edit_project', name: 'Proje Düzenleme', description: 'Mevcut projeleri düzenleyebilir' },
    { id: 'delete_project', name: 'Proje Silme', description: 'Projeleri silebilir' },
    { id: 'assign_users', name: 'Kullanıcı Atama', description: 'Projelere kullanıcı atayabilir' },
    { id: 'create_task', name: 'Görev Oluşturma', description: 'Yeni görev oluşturabilir' },
    { id: 'edit_task', name: 'Görev Düzenleme', description: 'Mevcut görevleri düzenleyebilir' },
    { id: 'delete_task', name: 'Görev Silme', description: 'Görevleri silebilir' },
    { id: 'assign_task', name: 'Görev Atama', description: 'Başkalarına görev atayabilir' },
    { id: 'change_status', name: 'Durum Değiştirme', description: 'Görev durumunu değiştirebilir' },
    { id: 'add_file', name: 'Dosya Ekleme', description: 'Görevlere dosya ekleyebilir' },
    { id: 'comment', name: 'Yorum Yapma', description: 'Görevlere yorum yapabilir' },
    { id: 'view_reports', name: 'Rapor Görüntüleme', description: 'Raporları görüntüleyebilir' },
    { id: 'manage_users', name: 'Kullanıcı Yönetimi', description: 'Kullanıcıları yönetebilir' },
    { id: 'manage_roles', name: 'Rol Yönetimi', description: 'Rolleri yönetebilir' },
    { id: 'view_audit_logs', name: 'Güvenlik Kayıtları', description: 'Güvenlik kayıtlarını görüntüleyebilir' }
  ];

  const handleCreateRole = () => {
    toast({
      title: "Yeni Rol",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
  };

  const handleEditRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    setSelectedRole(role);
  };

  const handleDeleteRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (role?.isSystem) {
      toast({
        title: "İşlem Hatası",
        description: "Sistem rolleri silinemez.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Rol Sil",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
  };

  const getUserCountByRole = (roleId) => {
    return users.filter(user => user.role === roleId).length;
  };

  const getRoleColor = (roleId) => {
    switch (roleId) {
      case 'super_admin': return 'role-super-admin';
      case 'admin': return 'role-admin';
      case 'member': return 'role-member';
      case 'guest': return 'role-guest';
      default: return 'role-guest';
    }
  };

  const hasPermission = (role, permission) => {
    if (role.permissions.includes('all')) return true;
    return role.permissions.includes(permission);
  };

  return (
    <>
      <Helmet>
        <title>Rol Yönetimi - Proje Kalkanı</title>
        <meta name="description" content="Sistem rollerini ve yetkilerini yönetin. Özelleştirilebilir rol sistemi." />
      </Helmet>

      <div className="space-y-6">
        {/* Başlık ve Eylemler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Rol Yönetimi</h1>
            <p className="text-gray-400 mt-1">Sistem rollerini ve yetkilerini yönetin</p>
          </div>
          
          <Button
            onClick={handleCreateRole}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Rol Oluştur
          </Button>
        </motion.div>

        {/* Arama */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rol ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
            />
          </div>
        </motion.div>

        {/* Rol Listesi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredRoles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{role.name}</h3>
                    <p className="text-gray-400 text-sm">{role.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {role.isSystem && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Lock className="w-4 h-4" />
                      <span className="text-xs">Sistem</span>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRole(role.id)}
                    className="w-8 h-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!role.isSystem && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteRole(role.id)}
                      className="w-8 h-8 text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`role-badge ${getRoleColor(role.id)}`}>
                    {role.name}
                  </span>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{getUserCountByRole(role.id)} kullanıcı</span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Yetkiler:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.slice(0, 6).map(permission => (
                      <div key={permission.id} className="flex items-center gap-2">
                        {hasPermission(role, permission.id) ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-xs text-gray-400">{permission.name}</span>
                      </div>
                    ))}
                  </div>
                  {role.permissions.includes('all') && (
                    <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-xs font-medium">✨ Tüm Yetkiler</p>
                    </div>
                  )}
                  {availablePermissions.length > 6 && (
                    <p className="text-xs text-gray-500 mt-2">
                      +{availablePermissions.length - 6} yetki daha...
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Rol Düzenleme Modal (Basit Gösterim) */}
        {selectedRole && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedRole(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="glass-effect rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Rol Düzenle: {selectedRole.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedRole(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rol Adı
                  </label>
                  <Input
                    value={selectedRole.name}
                    disabled={selectedRole.isSystem}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <Input
                    value={selectedRole.description}
                    disabled={selectedRole.isSystem}
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Yetkiler</h3>
                  <div className="permission-grid">
                    {availablePermissions.map(permission => (
                      <div key={permission.id} className="permission-card">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={hasPermission(selectedRole, permission.id)}
                            disabled={selectedRole.isSystem || selectedRole.permissions.includes('all')}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium text-white text-sm">{permission.name}</p>
                            <p className="text-gray-400 text-xs">{permission.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRole.isSystem && (
                  <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Lock className="w-5 h-5 text-yellow-400" />
                      <p className="text-yellow-400 font-medium">Sistem Rolü</p>
                    </div>
                    <p className="text-yellow-200 text-sm mt-1">
                      Bu rol sistem tarafından korunmaktadır ve düzenlenemez.
                    </p>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedRole(null)}
                  >
                    İptal
                  </Button>
                  <Button
                    disabled={selectedRole.isSystem}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    onClick={() => {
                      toast({
                        title: "Rol Güncelle",
                        description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
                      });
                      setSelectedRole(null);
                    }}
                  >
                    Kaydet
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {filteredRoles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-effect rounded-xl p-12 text-center"
          >
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Rol Bulunamadı</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery 
                ? 'Arama kriterlerinize uygun rol bulunamadı.'
                : 'Henüz hiç özel rol oluşturulmamış.'
              }
            </p>
            <Button
              onClick={handleCreateRole}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              İlk Rolünüzü Oluşturun
            </Button>
          </motion.div>
        )}
      </div>
    </>
  );
};

export default RoleManagement;