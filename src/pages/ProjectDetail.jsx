import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Users, 
  BarChart3, 
  Settings,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ProjectDetail = () => {
  const { id } = useParams();
  const { projects, tasks, users } = useData();
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState('kanban');

  const project = projects.find(p => p.id === id);
  const projectTasks = tasks.filter(t => t.projectId === id);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-400 mb-4">Aradığınız proje mevcut değil.</p>
          <Link to="/projeler">
            <Button>Projelere Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getProjectManager = (managerId) => {
    return users.find(user => user.id === managerId);
  };

  const getProjectMembers = (memberIds) => {
    return memberIds.map(id => users.find(user => user.id === id)).filter(Boolean);
  };

  const getTasksByStatus = (status) => {
    return projectTasks.filter(task => task.status === status);
  };

  const todoTasks = getTasksByStatus('todo');
  const progressTasks = getTasksByStatus('progress');
  const reviewTasks = getTasksByStatus('review');
  const doneTasks = getTasksByStatus('done');

  const handleAddTask = () => {
    if (hasPermission('create_task')) {
      toast({
        title: "Yeni Görev",
        description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
      });
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Görev oluşturma yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const handleProjectSettings = () => {
    if (hasPermission('edit_project')) {
      toast({
        title: "Proje Ayarları",
        description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
      });
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Proje düzenleme yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const TaskCard = ({ task }) => {
    const assignedUser = users.find(u => u.id === task.assignedTo);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`task-card rounded-lg p-4 bg-white/5 mb-3 priority-${task.priority}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-white truncate">{task.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>
            {task.priority === 'high' ? 'Yüksek' :
             task.priority === 'medium' ? 'Orta' : 'Düşük'}
          </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {assignedUser && (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">{assignedUser.name.charAt(0)}</span>
                </div>
                <span>{assignedUser.name}</span>
              </div>
            )}
          </div>
          <span>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
        </div>
      </motion.div>
    );
  };

  const KanbanColumn = ({ title, tasks, status, icon: Icon }) => (
    <div className="kanban-column">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-gray-400" />
          <h3 className="font-semibold text-white">{title}</h3>
          <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Görev yok</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{project.name} - Proje Kalkanı</title>
        <meta name="description" content={`${project.name} proje detayları. Görevleri görüntüleyin ve yönetin.`} />
      </Helmet>

      <div className="space-y-6">
        {/* Başlık ve Navigasyon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link to="/projeler">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-gray-400 mt-1">{project.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddTask}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Görev Ekle
            </Button>
            <Button
              onClick={handleProjectSettings}
              variant="outline"
            >
              <Settings className="w-4 h-4 mr-2" />
              Ayarlar
            </Button>
          </div>
        </motion.div>

        {/* Proje Bilgileri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{project.progress}%</p>
              <p className="text-gray-400 text-sm">İlerleme</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{doneTasks.length}</p>
              <p className="text-gray-400 text-sm">Tamamlanan</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{progressTasks.length + reviewTasks.length}</p>
              <p className="text-gray-400 text-sm">Devam Eden</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{getProjectMembers(project.members).length}</p>
              <p className="text-gray-400 text-sm">Ekip Üyesi</p>
            </div>
          </div>
        </motion.div>

        {/* Proje Detayları */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="kanban" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white/10">
                <TabsTrigger value="kanban" className="flex items-center gap-2">
                  <Grid3X3 className="w-4 h-4" />
                  Kanban
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Liste
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Takvim
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Zaman Çizelgesi
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="kanban">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KanbanColumn
                  title="Yapılacak"
                  tasks={todoTasks}
                  status="todo"
                  icon={AlertCircle}
                />
                <KanbanColumn
                  title="Devam Ediyor"
                  tasks={progressTasks}
                  status="progress"
                  icon={Clock}
                />
                <KanbanColumn
                  title="İnceleme"
                  tasks={reviewTasks}
                  status="review"
                  icon={Eye}
                />
                <KanbanColumn
                  title="Tamamlandı"
                  tasks={doneTasks}
                  status="done"
                  icon={CheckCircle}
                />
              </div>
            </TabsContent>

            <TabsContent value="list">
              <div className="glass-effect rounded-xl p-6">
                <div className="space-y-4">
                  {projectTasks.length > 0 ? (
                    projectTasks.map(task => (
                      <div key={task.id} className="task-card rounded-lg p-4 bg-white/5 flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-medium text-white">{task.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium status-${task.status}`}>
                              {task.status === 'todo' ? 'Yapılacak' :
                               task.status === 'progress' ? 'Devam Ediyor' :
                               task.status === 'review' ? 'İnceleme' : 'Tamamlandı'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>
                              {task.priority === 'high' ? 'Yüksek' :
                               task.priority === 'medium' ? 'Orta' : 'Düşük'}
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{task.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-400">
                          <p>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</p>
                          <p>{users.find(u => u.id === task.assignedTo)?.name}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-white mb-2">Henüz Görev Yok</h3>
                      <p className="text-gray-400 mb-6">Bu projede henüz hiç görev oluşturulmamış.</p>
                      <Button
                        onClick={handleAddTask}
                        className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        İlk Görevi Oluştur
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="calendar">
              <div className="glass-effect rounded-xl p-6">
                <div className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Takvim Görünümü</h3>
                  <p className="text-gray-400">🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="glass-effect rounded-xl p-6">
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Zaman Çizelgesi</h3>
                  <p className="text-gray-400">🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Ekip Üyeleri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6">Proje Ekibi</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Proje Yöneticisi */}
            {getProjectManager(project.manager) && (
              <div className="bg-white/5 rounded-lg p-4 border border-blue-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {getProjectManager(project.manager).name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{getProjectManager(project.manager).name}</p>
                    <p className="text-sm text-gray-400">{getProjectManager(project.manager).title}</p>
                    <span className="role-badge role-admin">Proje Yöneticisi</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Ekip Üyeleri */}
            {getProjectMembers(project.members).map(member => (
              <div key={member.id} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{member.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-gray-400">{member.title}</p>
                    <span className={`role-badge role-${member.role?.replace('_', '-')}`}>
                      {member.role === 'admin' ? 'Yönetici' : 'Ekip Üyesi'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProjectDetail;