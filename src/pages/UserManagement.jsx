import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Plus, Search, MoreVertical, Edit, Trash2, UserPlus, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const UserManagement = () => {
  const { users, roles, addUser, updateUser, deleteUser } = useData();
  const { user: currentUser, hasPermission } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  if (!hasPermission('manage_users') && currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center"><Shield className="w-16 h-16 text-red-400 mx-auto mb-4" /><h2 className="text-2xl font-bold text-white mb-2">Erişim Reddedildi</h2><p className="text-gray-400">Bu sayfaya erişim yetkiniz bulunmamaktadır.</p></div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => (user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.email.toLowerCase().includes(searchQuery.toLowerCase())) && (filterRole === 'all' || user.role === filterRole));

  const handleOpenModal = (user = null) => {
    setEditingUser(user ? { ...user } : { name: '', email: '', password: '', role: 'member', title: '' });
    setIsModalOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser.name.trim() || !editingUser.email.trim() || (!editingUser.id && !editingUser.password.trim())) {
      toast({ title: "Hata", description: "İsim, e-posta ve şifre alanları boş olamaz.", variant: "destructive" });
      return;
    }
    if (editingUser.id) {
      updateUser(editingUser.id, editingUser);
    } else {
      addUser(editingUser);
    }
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId) => {
    if (userId === currentUser.id) {
      toast({ title: "Hata", description: "Kendinizi silemezsiniz.", variant: "destructive" });
      return;
    }
    deleteUser(userId);
  };

  const getRoleName = (roleId) => roles.find(r => r.id === roleId)?.name || 'Bilinmiyor';
  const getRoleColor = (roleId) => ({ super_admin: 'role-super-admin', admin: 'role-admin', member: 'role-member', guest: 'role-guest' }[roleId] || 'role-guest');
  const getStatusIcon = (status) => status === 'active' ? <CheckCircle className="w-4 h-4 text-green-400" /> : <XCircle className="w-4 h-4 text-red-400" />;
  const getStatusText = (status) => status === 'active' ? 'Aktif' : 'Pasif';

  return (
    <>
      <Helmet><title>Kullanıcı Yönetimi - Proje Kalkanı</title><meta name="description" content="Sistem kullanıcılarını yönetin." /></Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div><h1 className="text-3xl font-bold text-white">Kullanıcı Yönetimi</h1><p className="text-gray-400 mt-1">Sistem kullanıcılarını yönetin ve rollerini düzenleyin</p></div>
          <Button onClick={() => handleOpenModal()} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"><UserPlus className="w-4 h-4 mr-2" />Kullanıcı Ekle</Button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /><Input type="text" placeholder="Kullanıcı ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400" /></div>
            <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"><option value="all">Tüm Roller</option>{roles.map(role => (<option key={role.id} value={role.id}>{role.name}</option>))}</select>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-effect rounded-xl p-6">
          <div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10"><th className="text-left py-4 px-2 text-gray-400 font-medium">Kullanıcı</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Rol</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Durum</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Son Giriş</th><th className="text-right py-4 px-2 text-gray-400 font-medium">İşlemler</th></tr></thead><tbody>
            {filteredUsers.map((user, index) => (
              <motion.tr key={user.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-2"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center"><span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span></div><div><p className="font-medium text-white">{user.name}</p><p className="text-sm text-gray-400">{user.email}</p></div></div></td>
                <td className="py-4 px-2"><span className={`role-badge ${getRoleColor(user.role)}`}>{getRoleName(user.role)}</span></td>
                <td className="py-4 px-2"><div className="flex items-center gap-2">{getStatusIcon(user.status)}<span className={`text-sm ${user.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>{getStatusText(user.status)}</span></div></td>
                <td className="py-4 px-2"><span className="text-sm text-gray-400">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString('tr-TR') : 'Hiç'}</span></td>
                <td className="py-4 px-2 text-right"><div className="flex items-center justify-end gap-2"><Button variant="ghost" size="icon" onClick={() => handleOpenModal(user)} className="w-8 h-8"><Edit className="w-4 h-4" /></Button>{user.id !== currentUser?.id && <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="w-8 h-8 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></Button>}</div></td>
              </motion.tr>
            ))}
          </tbody></table></div>
        </motion.div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="glass-effect">
          <DialogHeader><DialogTitle>{editingUser?.id ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</DialogTitle><DialogDescription>{editingUser?.id ? 'Kullanıcı bilgilerini güncelleyin.' : 'Yeni bir kullanıcı oluşturun ve rol atayın.'}</DialogDescription></DialogHeader>
          {editingUser && <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="name">İsim Soyisim</Label><Input id="name" value={editingUser.name} onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="email">E-posta</Label><Input id="email" type="email" value={editingUser.email} onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="title">Unvan</Label><Input id="title" value={editingUser.title} onChange={(e) => setEditingUser({ ...editingUser, title: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="password">Şifre</Label><Input id="password" type="password" placeholder={editingUser.id ? 'Değiştirmek için yeni şifre girin' : ''} onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })} /></div>
            <div className="grid gap-2"><Label htmlFor="role">Rol</Label><Select value={editingUser.role} onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}><SelectTrigger><SelectValue placeholder="Rol seçin..." /></SelectTrigger><SelectContent>{roles.filter(r => r.id !== 'super_admin').map(role => <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>)}</SelectContent></Select></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setIsModalOpen(false)}>İptal</Button><Button onClick={handleSaveUser}>Kaydet</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;