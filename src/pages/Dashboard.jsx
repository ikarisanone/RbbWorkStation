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
import { useDialog } from '@/contexts/DialogContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { projects, tasks, users } = useData();
  const { user, hasPermission } = useAuth();
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  const myTasks = tasks.filter(task => task.assigned_to_id === user?.id);
  const completedTasks = myTasks.filter(task => task.status === 'done');
  const inProgressTasks = myTasks.filter(task => task.status === 'progress' || task.status === 'review');

  const stats = [
    {
      title: 'Toplam Proje',
      value: projects.length,
      icon: FolderOpen,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Tamamlanan Görevlerim',
      value: completedTasks.length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Devam Eden Görevlerim',
      value: inProgressTasks.length,
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Aktif Kullanıcı',
      value: users.filter(u => u.status === 'active').length,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
    }
  ];

  const recentTasks = myTasks
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  const upcomingDeadlines = myTasks
    .filter(task => task.status !== 'done' && task.due_date)
    .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
    .slice(0, 5);
    
  const handleCreateTask = () => {
    if (hasPermission('create_task')) {
      openDialog('newTaskDialog');
    }
  };
  
  const handleCreateProject = () => {
    if (hasPermission('create_project')) {
      openDialog('newProjectDialog');
    }
  };


  return (
    <>
      <Helmet>
        <title>Panelim - Rbb Work Station</title>
        <meta name="description" content="Rbb Work Station ana panel sayfası. Görevlerinizi ve projelerinizi takip edin." />
      </Helmet>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Hoş geldin, {user?.name}! 👋
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
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  <div key={task.id} className="task-card rounded-lg p-4 bg-white/5 cursor-pointer" onClick={() => openDialog('editTaskDialog', { taskId: task.id })}>
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
                      <span>Son tarih: {task.due_date ? new Date(task.due_date).toLocaleDateString('tr-TR') : 'N/A'}</span>
                      <span className={`px-2 py-1 rounded priority-${task.priority}`}>
                        {task.priority === 'high' ? 'Yüksek' :
                         task.priority === 'medium' ? 'Orta' : 'Düşük'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Henüz size atanmış görev yok.</p>
                </div>
              )}
            </div>
          </motion.div>

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
                  const daysLeft = Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                  const isOverdue = daysLeft < 0;
                  const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                  
                  return (
                    <div key={task.id} className="task-card rounded-lg p-4 bg-white/5 cursor-pointer" onClick={() => openDialog('editTaskDialog', { taskId: task.id })}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-white truncate">{task.title}</h3>
                        {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">
                          {new Date(task.due_date).toLocaleDateString('tr-TR')}
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
      </div>
    </>
  );
};

export default Dashboard;
