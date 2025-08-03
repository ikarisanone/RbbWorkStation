
import React, { useState, useMemo } from 'react';
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
  ListTodo,
  AlertCircle as TodoIcon,
  Eye
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import TaskDetailModal from '@/components/TaskDetailModal';

const Dashboard = () => {
  const { projects, tasks, users, updateTask, loading } = useData();
  const { profile } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);

  const myTasks = useMemo(() => tasks.filter(task => task.assignedTo.includes(profile?.id)), [tasks, profile]);

  const stats = useMemo(() => [
    { title: 'Toplam Projeler', value: projects.length, icon: FolderOpen, color: 'from-blue-500 to-blue-600' },
    { title: 'Tamamlanan Görevler', value: tasks.filter(t => t.status === 'tamamlandi').length, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { title: 'Devam Eden Görevler', value: tasks.filter(t => t.status === 'devam-ediyor' || t.status === 'incelemede').length, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Aktif Kullanıcılar', value: users.length, icon: Users, color: 'from-purple-500 to-purple-600' }
  ], [projects, tasks, users]);

  const recentTasks = myTasks.slice(0, 5);
  const upcomingDeadlines = myTasks.filter(task => task.status !== 'tamamlandi').slice(0, 5);
  
  let tasksToShow;
  let listTitle;

  if (profile?.role?.id === 'super_admin' || profile?.role?.id === 'admin') {
    tasksToShow = tasks.filter(task => task.status !== 'tamamlandi');
    listTitle = "Tüm Aktif Görevler";
  } else {
    tasksToShow = tasks.filter(task => task.status !== 'tamamlandi' && task.assignedTo.includes(profile?.id));
    listTitle = "Sorumlu Olduğum Görevler";
  }

  const getStatusLabel = (status) => {
    const labels = { 'yapilacak': 'Yapılacak', 'devam-ediyor': 'Devam Ediyor', 'incelemede': 'İncelemede', 'tamamlandi': 'Tamamlandı' };
    return labels[status] || status;
  };
  
  const getPriorityLabel = (priority) => {
    const labels = { 'dusuk': 'Düşük', 'orta': 'Orta', 'yuksek': 'Yüksek' };
    return labels[priority] || priority;
  }

  const TaskCategoryList = ({ title, tasks, icon: Icon }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5 text-gray-400" />
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">{tasks.length}</span>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} onClick={() => setSelectedTask(task)} className="task-card rounded-lg p-3 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors">
            <div className="flex items-center justify-between">
              <p className="font-medium text-white truncate">{task.title}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>{getPriorityLabel(task.priority)}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
              <span>{users.find(u => u.id === task.assignedTo[0])?.name || 'Bilinmiyor'}</span>
              <span>{new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const categorizedTasks = {
    'yapilacak': tasksToShow.filter(t => t.status === 'yapilacak'),
    'devam-ediyor': tasksToShow.filter(t => t.status === 'devam-ediyor'),
    'incelemede': tasksToShow.filter(t => t.status === 'incelemede'),
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Panelim - Proje Kalkanı</title>
        <meta name="description" content="Proje Kalkanı ana panel sayfası. Görevlerinizi ve projelerinizi takip edin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-effect rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Hoş geldin, {profile?.name}! 👋</h1>
              <p className="text-gray-400">Bugün {myTasks.length} görevin var. Harika iş çıkarıyorsun!</p>
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
              <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-effect rounded-xl p-6 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}><Icon className="w-6 h-6 text-white" /></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                <p className="text-gray-400 text-sm">{stat.title}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">Son Görevlerim</h2><CheckCircle className="w-5 h-5 text-blue-400" /></div>
            <div className="space-y-4">
              {recentTasks.length > 0 ? recentTasks.map((task) => (
                <div key={task.id} className="task-card rounded-lg p-4 bg-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white truncate">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium status-${task.status}`}>{getStatusLabel(task.status)}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{task.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Son tarih: {new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
                    <span className={`priority-${task.priority} px-2 py-1 rounded`}>{getPriorityLabel(task.priority)}</span>
                  </div>
                </div>
              )) : <div className="text-center py-8"><CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-400">Henüz görev yok</p></div>}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }} className="glass-effect rounded-xl p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-xl font-bold text-white">Yaklaşan Son Tarihler</h2><Calendar className="w-5 h-5 text-yellow-400" /></div>
            <div className="space-y-4">
              {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((task) => {
                const daysLeft = Math.ceil((new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24));
                const isOverdue = daysLeft < 0;
                const isUrgent = daysLeft <= 3 && daysLeft >= 0;
                return (
                  <div key={task.id} className="task-card rounded-lg p-4 bg-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white truncate">{task.title}</h3>
                      {isOverdue && <AlertTriangle className="w-4 h-4 text-red-400" />}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">{new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isOverdue ? 'bg-red-500/20 text-red-400' : isUrgent ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {isOverdue ? `${Math.abs(daysLeft)} gün gecikti` : daysLeft === 0 ? 'Bugün' : daysLeft === 1 ? 'Yarın' : `${daysLeft} gün kaldı`}
                      </span>
                    </div>
                  </div>
                );
              }) : <div className="text-center py-8"><Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-400">Yaklaşan son tarih yok</p></div>}
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-effect rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ListTodo className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">{listTitle}</h2>
          </div>
          <div className="overflow-x-auto max-h-96">
            {tasksToShow.length > 0 ? (
              <>
                <TaskCategoryList title="Yapılacak" tasks={categorizedTasks['yapilacak']} icon={TodoIcon} />
                <TaskCategoryList title="Devam Ediyor" tasks={categorizedTasks['devam-ediyor']} icon={Clock} />
                <TaskCategoryList title="İncelemede" tasks={categorizedTasks['incelemede']} icon={Eye} />
              </>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Aktif görev bulunmuyor. Harika iş!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      {selectedTask && <TaskDetailModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} onUpdateTask={updateTask} />}
    </>
  );
};

export default Dashboard;
