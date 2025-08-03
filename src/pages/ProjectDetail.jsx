import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { format } from "date-fns";
import { 
  ArrowLeft, 
  Plus, 
  Calendar as CalendarIcon, 
  Users, 
  BarChart3, 
  Settings,
  Grid3X3,
  List,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  AlertTriangle,
  Trash2,
  Flag,
  UserPlus,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import TaskDetailModal from '@/components/TaskDetailModal';
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, users, addTask, updateTask, updateProject, deleteProject } = useData();
  const { user, hasPermission } = useAuth();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [newTaskData, setNewTaskData] = useState({ title: '', description: '', assignedTo: [], dueDate: null, priority: 'medium' });
  const [projectSettingsData, setProjectSettingsData] = useState(null);

  const project = projects.find(p => p.id === id);

  React.useEffect(() => {
    if (project) {
      setProjectSettingsData({ name: project.name, description: project.description });
    }
  }, [project]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-400 mb-4">Aradığınız proje mevcut değil.</p>
          <Link to="/projeler"><Button>Projelere Dön</Button></Link>
        </div>
      </div>
    );
  }

  const projectTasks = tasks.filter(t => t.projectId === id);
  const todoTasks = projectTasks.filter(task => task.status === 'todo');
  const progressTasks = projectTasks.filter(task => task.status === 'progress');
  const reviewTasks = projectTasks.filter(task => task.status === 'review');
  const doneTasks = projectTasks.filter(task => task.status === 'done');

  const handleAddTaskClick = () => {
    if (hasPermission('create_task')) {
      setAddTaskModalOpen(true);
    } else {
      toast({ title: "Yetki Hatası", description: "Görev oluşturma yetkiniz bulunmamaktadır.", variant: "destructive" });
    }
  };

  const handleSaveNewTask = () => {
    if (!newTaskData.title.trim() || newTaskData.assignedTo.length === 0 || !newTaskData.dueDate) {
      toast({ title: "Hata", description: "Görev başlığı, atanan kişi ve son tarih boş olamaz.", variant: "destructive" });
      return;
    }
    addTask({ ...newTaskData, projectId: project.id, status: 'todo', createdBy: user.id });
    setNewTaskData({ title: '', description: '', assignedTo: [], dueDate: null, priority: 'medium' });
    setAddTaskModalOpen(false);
  };

  const handleProjectSettingsClick = () => {
    if (hasPermission('edit_project')) {
      setSettingsModalOpen(true);
    } else {
      toast({ title: "Yetki Hatası", description: "Proje ayarlarını düzenleme yetkiniz bulunmamaktadır.", variant: "destructive" });
    }
  };

  const handleSaveProjectSettings = () => {
    updateProject(project.id, projectSettingsData);
    setSettingsModalOpen(false);
  };

  const handleDeleteProjectClick = () => {
    if (hasPermission('delete_project')) {
      deleteProject(project.id);
      toast({ title: "Proje Silindi", description: `${project.name} projesi başarıyla silindi.` });
      navigate('/projeler');
    } else {
      toast({ title: "Yetki Hatası", description: "Proje silme yetkiniz bulunmamaktadır.", variant: "destructive" });
    }
  };
  
  const handleAssigneeChange = (userId, checked) => {
    setNewTaskData(prev => {
      const newAssignedTo = checked
        ? [...prev.assignedTo, userId]
        : prev.assignedTo.filter(id => id !== userId);
      return { ...prev, assignedTo: newAssignedTo };
    });
  };

  const TaskCard = ({ task }) => {
    const assignedUser = users.find(u => u.id === task.assignedTo[0]);
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`task-card rounded-lg p-4 bg-white/5 mb-3 priority-${task.priority} cursor-pointer`} onClick={() => setSelectedTask(task)}>
        <h4 className="font-medium text-white truncate mb-2">{task.title}</h4>
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          {assignedUser && (
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center"><span className="text-white text-xs">{assignedUser.name.charAt(0)}</span></div>
              <span>{assignedUser.name} {task.assignedTo.length > 1 && `+${task.assignedTo.length - 1}`}</span>
            </div>
          )}
          <span>{new Date(task.dueDate).toLocaleDateString('tr-TR')}</span>
        </div>
      </motion.div>
    );
  };

  const KanbanColumn = ({ title, tasks, icon: Icon }) => (
    <div className="kanban-column"><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Icon className="w-5 h-5 text-gray-400" /><h3 className="font-semibold text-white">{title}</h3><span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">{tasks.length}</span></div></div><div className="space-y-3">{tasks.map(task => (<TaskCard key={task.id} task={task} />))}{tasks.length === 0 && (<div className="text-center py-8 text-gray-400"><Icon className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm">Görev yok</p></div>)}</div></div>
  );

  return (
    <>
      <Helmet><title>{project.name} - Proje Kalkanı</title></Helmet>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/projeler"><Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button></Link>
            <div><h1 className="text-3xl font-bold text-white">{project.name}</h1><p className="text-gray-400 mt-1">{project.description}</p></div>
          </div>
          <div className="flex items-center gap-2">
            {hasPermission('create_task') && <Button onClick={handleAddTaskClick} className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"><Plus className="w-4 h-4 mr-2" />Görev Ekle</Button>}
            {hasPermission('edit_project') && <Button onClick={handleProjectSettingsClick} variant="outline"><Settings className="w-4 h-4 mr-2" />Ayarlar</Button>}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-effect rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center"><div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-2"><AlertTriangle className="w-6 h-6 text-white" /></div><p className="text-2xl font-bold text-white">{todoTasks.length}</p><p className="text-gray-400 text-sm">Yapılacak Görev</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mx-auto mb-2"><CheckCircle className="w-6 h-6 text-white" /></div><p className="text-2xl font-bold text-white">{doneTasks.length}</p><p className="text-gray-400 text-sm">Tamamlanan</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Clock className="w-6 h-6 text-white" /></div><p className="text-2xl font-bold text-white">{progressTasks.length + reviewTasks.length}</p><p className="text-gray-400 text-sm">Devam Eden</p></div>
            <div className="text-center"><div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2"><Users className="w-6 h-6 text-white" /></div><p className="text-2xl font-bold text-white">{project.members.length}</p><p className="text-gray-400 text-sm">Ekip Üyesi</p></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="kanban" className="space-y-6">
            <TabsList className="bg-white/10">
              <TabsTrigger value="kanban" className="flex items-center gap-2"><Grid3X3 className="w-4 h-4" />Kanban</TabsTrigger>
              <TabsTrigger value="list" className="flex items-center gap-2"><List className="w-4 h-4" />Liste</TabsTrigger>
              <TabsTrigger value="calendar" className="flex items-center gap-2"><CalendarIcon className="w-4 h-4" />Takvim</TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2"><BarChart3 className="w-4 h-4" />Zaman Çizelgesi</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><KanbanColumn title="Yapılacak" tasks={todoTasks} icon={AlertCircle} /><KanbanColumn title="Devam Ediyor" tasks={progressTasks} icon={Clock} /><KanbanColumn title="İnceleme" tasks={reviewTasks} icon={Eye} /><KanbanColumn title="Tamamlandı" tasks={doneTasks} icon={CheckCircle} /></div></TabsContent>
            <TabsContent value="list"><div className="glass-effect rounded-xl p-6"><div className="overflow-x-auto"><table className="w-full"><thead><tr className="border-b border-white/10"><th className="text-left py-4 px-2 text-gray-400 font-medium">Görev</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Atanan</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Son Tarih</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Durum</th><th className="text-left py-4 px-2 text-gray-400 font-medium">Öncelik</th></tr></thead><tbody>{projectTasks.map(task => (<tr key={task.id} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setSelectedTask(task)}><td className="py-4 px-2 text-white">{task.title}</td><td className="py-4 px-2 text-gray-300">{task.assignedTo.map(id => users.find(u => u.id === id)?.name).join(', ') || 'Bilinmiyor'}</td><td className="py-4 px-2 text-gray-300">{new Date(task.dueDate).toLocaleDateString('tr-TR')}</td><td className="py-4 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium status-${task.status}`}>{task.status}</span></td><td className="py-4 px-2"><span className={`px-2 py-1 rounded-full text-xs font-medium priority-${task.priority}`}>{task.priority}</span></td></tr>))}</tbody></table></div></div></TabsContent>
            <TabsContent value="calendar"><div className="glass-effect rounded-xl p-6 text-center py-12"><CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">Takvim Görünümü Aktif!</h3><p className="text-gray-400">Görevleriniz takvim üzerinde görüntülenecek.</p></div></TabsContent>
            <TabsContent value="timeline"><div className="glass-effect rounded-xl p-6 text-center py-12"><BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">Zaman Çizelgesi Aktif!</h3><p className="text-gray-400">Proje zaman çizelgesi burada yer alacak.</p></div></TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {selectedTask && <TaskDetailModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} onUpdateTask={updateTask} />}

      <Dialog open={isAddTaskModalOpen} onOpenChange={setAddTaskModalOpen}>
        <DialogContent className="glass-effect"><DialogHeader><DialogTitle>Yeni Görev Ekle</DialogTitle><DialogDescription>Projeniz için yeni bir görev oluşturun.</DialogDescription></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="title">Görev Başlığı</Label><Input id="title" value={newTaskData.title} onChange={(e) => setNewTaskData({...newTaskData, title: e.target.value})} /></div>
            <div className="grid gap-2"><Label htmlFor="description">Açıklama</Label><Textarea id="description" value={newTaskData.description} onChange={(e) => setNewTaskData({...newTaskData, description: e.target.value})} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2"><Label htmlFor="priority">Öncelik</Label><select value={newTaskData.priority} onChange={(e) => setNewTaskData({...newTaskData, priority: e.target.value})} className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white"><option value="low">Düşük</option><option value="medium">Orta</option><option value="high">Yüksek</option></select></div>
              <div className="grid gap-2"><Label htmlFor="dueDate">Son Tarih</Label><Popover><PopoverTrigger asChild><Button variant={"outline"} className={cn("justify-start text-left font-normal w-full", !newTaskData.dueDate && "text-muted-foreground")}><CalendarIcon className="mr-2 h-4 w-4" />{newTaskData.dueDate ? format(newTaskData.dueDate, "PPP") : <span>Tarih seçin</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={newTaskData.dueDate} onSelect={(date) => setNewTaskData({...newTaskData, dueDate: date})} initialFocus /></PopoverContent></Popover></div>
            </div>
            <div className="grid gap-2"><Label>Üye Ata</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <UserPlus className="mr-2 h-4 w-4" />
                    {newTaskData.assignedTo.length > 0 ? `${newTaskData.assignedTo.length} üye seçildi` : "Üye seçin"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <div className="p-4 space-y-2">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center space-x-2">
                        <Checkbox id={`assign-${u.id}`} checked={newTaskData.assignedTo.includes(u.id)} onCheckedChange={(checked) => handleAssigneeChange(u.id, checked)} />
                        <label htmlFor={`assign-${u.id}`} className="text-sm font-medium leading-none">{u.name}</label>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2"><Label>Oluşturan</Label><p className="text-sm text-gray-300">{user.name} ({new Date().toLocaleDateString('tr-TR')})</p></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddTaskModalOpen(false)}>İptal</Button><Button onClick={handleSaveNewTask}>Kaydet</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSettingsModalOpen} onOpenChange={setSettingsModalOpen}>
        <DialogContent className="glass-effect"><DialogHeader><DialogTitle>Proje Ayarları</DialogTitle><DialogDescription>Proje bilgilerini düzenleyin veya projeyi silin.</DialogDescription></DialogHeader>
          {projectSettingsData && <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label htmlFor="name">Proje Adı</Label><Input id="name" value={projectSettingsData.name} onChange={(e) => setProjectSettingsData({...projectSettingsData, name: e.target.value})} /></div>
            <div className="grid gap-2"><Label htmlFor="description">Açıklama</Label><Textarea id="description" value={projectSettingsData.description} onChange={(e) => setProjectSettingsData({...projectSettingsData, description: e.target.value})} /></div>
          </div>}
          <DialogFooter className="justify-between">
            {hasPermission('delete_project') ? <Button variant="destructive" onClick={handleDeleteProjectClick}><Trash2 className="w-4 h-4 mr-2" />Projeyi Sil</Button> : <div></div>}
            <div><Button variant="outline" onClick={() => setSettingsModalOpen(false)}>İptal</Button><Button onClick={handleSaveProjectSettings} className="ml-2">Kaydet</Button></div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectDetail;