import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Search, 
  Filter, 
  Download, 
  Shield, 
  User, 
  Calendar, 
  Globe, 
  Monitor,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const AuditLog = () => {
  const { auditLogs, profiles } = useData();
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

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

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.action.includes(filterAction);
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      switch (filterDate) {
        case 'today':
          matchesDate = logDate.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = logDate >= monthAgo;
          break;
      }
    }
    
    return matchesSearch && matchesAction && matchesDate;
  });

  const handleExportLogs = () => {
    toast({
      title: "Kayıtları Dışa Aktar",
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
  };

  const getUserName = (userId) => {
    const user = profiles.find(u => u.id === userId);
    return user ? user.name : 'Bilinmeyen Kullanıcı';
  };

  const getActionIcon = (action) => {
    if (action.includes('login')) return <User className="w-4 h-4 text-green-400" />;
    if (action.includes('logout')) return <XCircle className="w-4 h-4 text-gray-400" />;
    if (action.includes('created')) return <CheckCircle className="w-4 h-4 text-blue-400" />;
    if (action.includes('deleted')) return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (action.includes('updated') || action.includes('edited')) return <Info className="w-4 h-4 text-yellow-400" />;
    return <Shield className="w-4 h-4 text-purple-400" />;
  };

  const getActionColor = (action) => {
    if (action.includes('login')) return 'text-green-400';
    if (action.includes('logout')) return 'text-gray-400';
    if (action.includes('created')) return 'text-blue-400';
    if (action.includes('deleted')) return 'text-red-400';
    if (action.includes('updated') || action.includes('edited')) return 'text-yellow-400';
    return 'text-purple-400';
  };

  const getActionText = (action) => {
    const actionMap = {
      'user_login': 'Kullanıcı Girişi',
      'user_logout': 'Kullanıcı Çıkışı',
      'project_created': 'Proje Oluşturuldu',
      'project_updated': 'Proje Güncellendi',
      'project_deleted': 'Proje Silindi',
      'task_created': 'Görev Oluşturuldu',
      'task_updated': 'Görev Güncellendi',
      'task_deleted': 'Görev Silindi',
      'user_created': 'Kullanıcı Eklendi',
      'user_updated': 'Kullanıcı Güncellendi',
      'user_deleted': 'Kullanıcı Silindi',
      'role_created': 'Rol Oluşturuldu',
      'role_updated': 'Rol Güncellendi',
      'role_deleted': 'Rol Silindi'
    };
    return actionMap[action] || action;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('tr-TR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <>
      <Helmet>
        <title>Güvenlik Kayıtları - Rbb Work Station</title>
        <meta name="description" content="Sistem güvenlik kayıtlarını görüntüleyin ve analiz edin. Kullanıcı aktivitelerini takip edin." />
      </Helmet>

      <div className="space-y-6">
        {/* Başlık ve Eylemler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Güvenlik Kayıtları</h1>
            <p className="text-gray-400 mt-1">Sistem aktivitelerini ve güvenlik olaylarını takip edin</p>
          </div>
          
          <Button
            onClick={handleExportLogs}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Kayıtları Dışa Aktar
          </Button>
        </motion.div>

        {/* Arama ve Filtreler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 gap-4 w-full lg:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Kayıtlarda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">Tüm İşlemler</option>
                <option value="login">Giriş/Çıkış</option>
                <option value="project">Proje İşlemleri</option>
                <option value="task">Görev İşlemleri</option>
                <option value="user">Kullanıcı İşlemleri</option>
                <option value="role">Rol İşlemleri</option>
              </select>

              <select
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">Tüm Tarihler</option>
                <option value="today">Bugün</option>
                <option value="week">Son 7 Gün</option>
                <option value="month">Son 30 Gün</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* İstatistikler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">{auditLogs.length}</h3>
            <p className="text-gray-400 text-sm">Toplam Kayıt</p>
          </div>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {auditLogs.filter(log => log.action.includes('login')).length}
            </h3>
            <p className="text-gray-400 text-sm">Giriş İşlemi</p>
          </div>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {auditLogs.filter(log => log.action.includes('deleted')).length}
            </h3>
            <p className="text-gray-400 text-sm">Silme İşlemi</p>
          </div>

          <div className="glass-effect rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white">
              {auditLogs.filter(log => 
                new Date(log.timestamp).toDateString() === new Date().toDateString()
              ).length}
            </h3>
            <p className="text-gray-400 text-sm">Bugünkü İşlem</p>
          </div>
        </motion.div>

        {/* Kayıt Listesi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="space-y-4">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="audit-log-item"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className={`font-medium ${getActionColor(log.action)}`}>
                            {getActionText(log.action)}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">
                            {log.action}
                          </span>
                        </div>
                        
                        <p className="text-white text-sm mb-2">{log.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{getUserName(log.userId)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(log.timestamp)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Monitor className="w-3 h-3" />
                            <span className="truncate max-w-32">{log.userAgent}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Kayıt Bulunamadı</h3>
                <p className="text-gray-400">
                  {searchQuery || filterAction !== 'all' || filterDate !== 'all'
                    ? 'Arama kriterlerinize uygun kayıt bulunamadı.'
                    : 'Henüz hiç güvenlik kaydı oluşturulmamış.'
                  }
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Güvenlik Bilgisi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Güvenlik Kayıtları Hakkında</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>• Tüm kullanıcı aktiviteleri otomatik olarak kaydedilir ve şifrelenir.</p>
                <p>• Kayıtlar 90 gün boyunca saklanır ve ardından güvenli bir şekilde silinir.</p>
                <p>• Kritik güvenlik olayları anında bildirim gönderir.</p>
                <p>• Kayıtlar değiştirilemez ve silinmez (immutable).</p>
                <p>• GDPR ve diğer veri koruma düzenlemelerine uygun olarak işlenir.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuditLog;