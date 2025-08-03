import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, Shield, Edit, Trash2, Lock, CheckCircle, XCircle, Users, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const RoleManagement = () => {
  const { roles, users, addRole, updateRole, deleteRole } = useData();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewRoleModalOpen, setNewRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [newRoleData, setNewRoleData] = useState({ name: '', description: '', baseRole: 'member', permissions: [] });

  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center"><Shield className="w-16 h-16 text-red-400 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2><p className="text-gray-400">Bu sayfaya sadece Süper Admin erişebilir.</p></div>
      </div>
    );
  }

  const filteredRoles = roles.filter(role => role.name.toLowerCase().includes(searchQuery.toLowerCase()) || role.description.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleOpenEditModal = (role) => {
    setEditingRole({ ...role });
    setIsModalOpen(true);
  };
  
  const handleOpenNewModal = () => {
    setNewRoleData({ name: '', description: '', baseRole: 'member', permissions: roles.find(r => r.id === 'member')?.permissions || [] });
    setNewRoleModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!editingRole.name.trim()) {
      toast({ title: "Hata", description: "Rol adı boş olamaz.", variant: "destructive" });
      return;
    }
    updateRole(editingRole.id, editingRole);
    setIsModalOpen(false);
    setEditingRole(null);
  };

  const handleSaveNewRole = () => {
    if (!newRoleData.name.trim()) {
      toast({ title: "Hata", description: "Rol adı boş olamaz.", variant: "destructive" });
      return;
    }
    const basePermissions = roles.find(r => r.id === newRoleData.baseRole)?.permissions || [];
    addRole({ ...newRoleData, permissions: basePermissions });
    setNewRoleModalOpen(false);
  };

  const handleDeleteRole = (role) => {
    if (role.isSystem) {
      toast({ title: "İşlem Hatası", description: "Sistem rolleri silinemez.", variant: "destructive" });
      return;
    }
    deleteRole(role.id);
  };

  const handleNewRoleBaseChange = (baseRole) => {
    setNewRoleData(prev => ({ ...prev, baseRole }));
  };

  const handleEditingRoleBaseChange = (baseRole) => {
    setEditingRole(prev => ({ ...prev, baseRole }));
  };

  const getUserCountByRole = (roleId) => users.filter(user => user.role === roleId).length;
  
  const getRoleColor = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return 'role-guest';
    if (role.isSystem) {
      return { super_admin: 'role-super-admin', admin: 'role-admin', member: 'role-member', guest: 'role-guest' }[roleId];
    }
    return { admin: 'role-admin', member: 'role-member' }[role.baseRole] || 'role-guest';
  };

  const hasPermission = (role, permission) => role.permissions.includes('all') || role.permissions.includes(permission);

  return (
    <>
      <Helmet><title>Rol Yönetimi - Proje Kalkanı</title><meta name="description" content="Sistem rollerini ve yetkilerini yönetin." /></Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-bold text-white">Rol Yönetimi</h1><p className="text-gray-400 mt-1">Sistem rollerini ve yetkilerini yönetin</p></div>
          <Button onClick={handleOpenNewModal} className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"><Plus className="w-4 h-4 mr-2" />Yeni Rol Oluştur</Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-6">
          <div className="relative"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="text" placeholder="Rol ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400" /></div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRoles.map((role, index) => (
            <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-effect rounded-xl p-6 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center"><Shield className="w-6 h-6 text-white" /></div>
                  <div><h3 className="text-xl font-bold text-white">{role.name}</h3><p className="text-gray-400 text-sm">{role.description}</p></div>
                </div>
                <div className="flex items-center gap-2">
                  {role.isSystem && <div className="flex items-center gap-1 text-yellow-400"><Lock className="w-4 h-4" /><span className="text-xs">Sistem</span></div>}
                  <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(role)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>
                  {!role.isSystem && <Button variant="ghost" size="icon" onClick={() => handleDeleteRole(role)} className="w-8 h-8 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between"><span className={`role-badge ${getRoleColor(role.id)}`}>{role.name}</span><div className="flex items-center gap-2 text-sm text-gray-400"><Users className="w-4 h-4" /><span>{getUserCountByRole(role.id)} kullanıcı</span></div></div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-3">Yetkiler:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {availablePermissions.slice(0, 6).map(p => (<div key={p.id} className="flex items-center gap-2">{hasPermission(role, p.id) ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />}<span className="text-xs text-gray-400">{p.name}</span></div>))}
                  </div>
                  {role.permissions.includes('all') && <div className="mt-2 p-2 bg-green-500/20 border border-green-500/30 rounded-lg"><p className="text-green-400 text-xs font-medium">✨ Tüm Yetkiler</p></div>}
                  {availablePermissions.length > 6 && !role.permissions.includes('all') && role.permissions.length > 6 && <p className="text-xs text-gray-500 mt-2">+{role.permissions.length - 6} yetki daha...</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      <Dialog open={isNewRoleModalOpen} onOpenChange={setNewRoleModalOpen}>
        <DialogContent className="glass-effect"><DialogHeader><DialogTitle>Yeni Rol Oluştur</DialogTitle><DialogDescription>Yeni bir kullanıcı rolü oluşturun.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label htmlFor="new-role-name">Rol Adı</Label><Input id="new-role-name" value={newRoleData.name} onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })} /></div>
            <div><Label htmlFor="new-role-desc">Açıklama</Label><Textarea id="new-role-desc" value={newRoleData.description} onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })} /></div>
            <div><Label htmlFor="base-role">Temel Rol</Label>
              <Select value={newRoleData.baseRole} onValueChange={handleNewRoleBaseChange}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Yönetici</SelectItem>
                  <SelectItem value="member">Ekip Üyesi</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-2">Bu rol, seçilen temel rolün yetkileriyle başlar. Yetkileri düzenleme ekranından özelleştirebilirsiniz.</p>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setNewRoleModalOpen(false)}>İptal</Button><Button onClick={handleSaveNewRole}>Oluştur</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-effect max-w-md"><DialogHeader><DialogTitle>Rolü Düzenle</DialogTitle><DialogDescription>Rol bilgilerini ve temel rol etiketini güncelleyin.</DialogDescription></DialogHeader>
          {editingRole && <div className="space-y-6 py-4">
            <div><Label htmlFor="role-name">Rol Adı</Label><Input id="role-name" value={editingRole.name} onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })} disabled={editingRole.isSystem} /></div>
            <div><Label htmlFor="role-desc">Açıklama</Label><Textarea id="role-desc" value={editingRole.description} onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })} disabled={editingRole.isSystem} /></div>
            <div>
              <Label htmlFor="edit-base-role">Temel Rol Etiketi</Label>
              <Select value={editingRole.baseRole} onValueChange={handleEditingRoleBaseChange} disabled={editingRole.isSystem}>
                <SelectTrigger id="edit-base-role">
                  <SelectValue placeholder="Temel rol seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Yönetici</SelectItem>
                  <SelectItem value="member">Ekip Üyesi</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400 mt-2">Bu etiket, rolün temel davranışını ve varsayılan izinlerini belirler.</p>
            </div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button><Button onClick={handleSaveRole} disabled={editingRole?.isSystem}>Kaydet</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RoleManagement;