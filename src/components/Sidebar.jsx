import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, FolderOpen, Users, Shield, FileText, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// hasPermission fonksiyonu ekleniyor
function hasPermission(user, permission) {
  if (!user || !user.role || !permission) return false;
  if (user.role === 'super_admin') return true;
  // Kendi rol-permission kontrolünüzü buraya ekleyin
  if (user.permissions && Array.isArray(user.permissions)) {
    return user.permissions.includes(permission);
  }
  return false;
}

const Sidebar = ({
  isOpen,
  onToggle
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const menuItems = [{
    path: '/panel',
    icon: LayoutDashboard,
    label: 'Panelim',
    permission: null
  }, {
    path: '/projeler',
    icon: FolderOpen,
    label: 'Projeler',
    permission: null
  }, {
    path: '/kullanicilar',
    icon: Users,
    label: 'Kullanıcı Yönetimi',
    permission: 'manage_users'
  }, {
    path: '/roller',
    icon: Shield,
    label: 'Rol Yönetimi',
    permission: 'manage_roles'
  }, {
    path: '/guvenlik-kayitlari',
    icon: FileText,
    label: 'Güvenlik Kayıtları',
    permission: 'view_audit_logs'
  }, {
    path: '/profil',
    icon: User,
    label: 'Profil',
    permission: null
  }];
  const filteredMenuItems = menuItems.filter(item => !item.permission || hasPermission(user, item.permission) || user?.role === 'super_admin');
  return <motion.div initial={{
    width: isOpen ? 280 : 80
  }} animate={{
    width: isOpen ? 280 : 80
  }} transition={{
    duration: 0.3,
    ease: 'easeInOut'
  }} className="sidebar-nav h-full flex flex-col">
      {/* Logo ve Toggle */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          {isOpen && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Rbb Work Station</h1>
                <p className="text-xs text-gray-400">Güvenli Proje Yönetimi</p>
              </div>
            </motion.div>}
          
          <button onClick={onToggle} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            {isOpen ? <ChevronLeft className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>
        </div>
      </div>

      {/* Kullanıcı Bilgisi */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.name?.charAt(0)}
            </span>
          </div>
          {isOpen && <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          delay: 0.2
        }} className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-400 truncate">{user?.title}</p>
              <span className={`role-badge role-${user?.role?.replace('_', '-')}`}>
                {user?.role === 'super_admin' ? 'Süper Admin' : user?.role === 'admin' ? 'Yönetici' : user?.role === 'member' ? 'Üye' : 'Misafir'}
              </span>
            </motion.div>}
        </div>
      </div>

      {/* Menü */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return <li key={item.path}>
                <Link to={item.path} className={`nav-item flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-all ${isActive ? 'active' : 'text-gray-300 hover:text-white'}`}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {isOpen && <motion.span initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.1
              }}>
                      {item.label}
                    </motion.span>}
                </Link>
              </li>;
        })}
        </ul>
      </nav>
    </motion.div>;
};
export default Sidebar;