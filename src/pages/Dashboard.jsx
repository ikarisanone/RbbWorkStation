import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  Users, 
  TrendingUp,
  AlertTriangle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { projects, tasks, profiles } = useData();
  const { user } = useAuth();

  // Supabase user için isim yoksa email göster
  const userDisplayName = user?.user_metadata?.name || user?.email || user?.id || 'Kullanıcı';

  // İstatistikler
  const myTasks = tasks.filter(task => task.assignedTo === user?.id);
  const completedTasks = myTasks.filter(task => task.status === 'done');
  const pendingTasks = myTasks.filter(task => task.status === 'todo');
  const inProgressTasks = myTasks.filter(task => task.status === 'progress');
  const overdueTasks = myTasks.filter(task => 
    task.status !== 'done' && new Date(task.dueDate) < new Date()
  );

  const stats = [
    {
      title: 'Toplam Projeler',
      value: projects.length,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
      change: '+12%'
    },
    {
      title: 'Tamamlanan Görevler',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+8%'
    },
    {
      title: 'Devam Eden Görevler',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
      change: '+5%'
    },
    {
      title: 'Aktif Kullanıcılar',
      value: profiles.filter(u => u.status === 'active').length,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+3%'
    }
  ];

  const recentTasks = myTasks
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcomingDeadlines = myTasks
    .filter(task => task.status !== 'done')
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  return (
    <>
      <Helmet>
        <title>Panelim - Rbb Work Station</title>
        <meta name="description" content="Rbb Work Station ana panel sayfası. Görevlerinizi ve projelerinizi takip edin." />
      </Helmet>

      <div className="space-y-6">
        {/* Hoş Geldin Mesajı */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hoş geldin, {userDisplayName}! 👋
              </h1>
              <p className="text-gray-400">
                Bugün {myTasks.length} görevin var. Harika iş çıkarıyorsun!
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Son Görevler */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Son Görevlerim</h2>
              <CheckCircle className="w-5 h-5 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div key={task.id} className="task-card rounded-lg p-4 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white truncate">{task.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium status-${task.status}`}>
                        {task.status === 'todo' ? 'Yapılacak' :
                         task.status === 'progress' ? 'Devam Ediyor' :
                         task.status === 'review' ? 'İnceleme' : 'Tamamlandı'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Son tarih: {new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
                      <span className={`priority-${task.priority} px-2 py-1 rounded`}>
                        {task.priority === 'high' ? 'Yüksek' :
                         task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Henüz görev yok</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Yaklaşan Son Tarihler */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Yaklaşan Son Tarihler</h2>
              <Calendar className="w-5 h-5 text-yellow-400" />
            </div>
            
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? (
                upcomingDeadlines.map((task) => {
                  const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysLeft < 0;
                  const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                  
                  return (
                    <div key={task.id} className="task-card rounded-lg p-4 bg-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white truncate">{task.title}</h3>
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(task.dueDate).toLocaleDateString('tr-TR')}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isOverdue ? 'bg-red-500/20 text-red-400' :
                          isUrgent ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {isOverdue ? `${Math.abs(daysLeft)} gün gecikti` :
                           daysLeft === 0 ? 'Bugün' :
                           daysLeft === 1 ? 'Yarın' :
                           `${daysLeft} gün kaldı`}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Yaklaşan son tarih yok</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Hızlı Eylemler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Hızlı Eylemler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-lg hover:from-blue-500/30 hover:to-blue-600/30 transition-all duration-300">
              <FolderOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">Yeni Proje</p>
              <p className="text-gray-400 text-sm">Proje oluştur</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-lg hover:from-green-500/30 hover:to-green-600/30 transition-all duration-300">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Yeni Görev</p>
              <p className="text-gray-400 text-sm">Görev ekle</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-lg hover:from-purple-500/30 hover:to-purple-600/30 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
              <p className="text-white font-medium">Raporlar</p>
              <p className="text-gray-400 text-sm">İstatistikleri gör</p>
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Dashboard;