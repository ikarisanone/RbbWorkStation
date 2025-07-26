import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Shield, 
  Edit, 
  Trash2, 
  Lock,
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useDialog } from '@/contexts/DialogContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const RoleManagement = () => {
  const { roles, users, deleteRole } = useData();
  const { user: currentUser } = useAuth();
  const { openDialog } = useDialog();
  const [searchQuery, setSearchQuery] = useState('');

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
    (role.description && role.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateRole = () => {
    openDialog('newRoleDialog');
  };

  const handleEditRole = (role) => {
    openDialog('editRoleDialog', { role });
  };

  const handleDeleteRole = async (role) => {
    if (role.is_system) {
      toast({ title: "İşlem Hatası", description: "Sistem rolleri silinemez.", variant: "destructive" });
      return;
    }
    if (getUserCountByRole(role.id) > 0) {
      toast({ title: "İşlem Hatası", description: "Bu role atanmış kullanıcılar varken rol silinemez.", variant: "destructive" });
      return;
    }
    await deleteRole(role.id);
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

  return (
    <>
      <Helmet>
        <title>Rol Yönetimi - Rbb Work Station</title>
        <meta name="description" content="Sistem rollerini ve yetkilerini yönetin. Özelleştirilebilir rol sistemi." />
      </Helmet>

      <div className="space-y-6">
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
                  {role.is_system && (
                    <div className="flex items-center gap-1 text-yellow-400" title="Sistem Rolü">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRole(role)}
                    className="w-8 h-8"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!role.is_system && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Emin misiniz?</AlertDialogTitle>
                          <AlertDialogDescription>
                            "{role.name}" rolünü silmek üzeresiniz. Bu işlem geri alınamaz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>İptal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteRole(role)}>Sil</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default RoleManagement;