import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Calendar,
  Users,
  MoreVertical,
  Settings,
  Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Projects = () => {
  const { projects, users, addProject, deleteProject } = useData();
  const { user, hasPermission } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddProjectModalOpen, setAddProjectModalOpen] = useState(false);
  const [newProjectData, setNewProjectData] = useState({ name: '', description: '' });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProjectClick = () => {
    if (hasPermission('create_project')) {
      setAddProjectModalOpen(true);
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Proje oluşturma yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const handleSaveNewProject = () => {
    if (!newProjectData.name.trim()) {
      toast({ title: "Hata", description: "Proje adı boş olamaz.", variant: "destructive" });
      return;
    }
    addProject({
      name: newProjectData.name,
      description: newProjectData.description,
      manager: user.id,
      members: [user.id],
      status: 'active',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 1 ay sonrası
    });
    setNewProjectData({ name: '', description: '' });
    setAddProjectModalOpen(false);
  };

  const handleProjectSettings = (projectId) => {
    if (hasPermission('edit_project')) {
      navigate(`/projeler/${projectId}`);
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Proje ayarlarına erişim yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = (projectId) => {
    if (hasPermission('delete_project')) {
      deleteProject(projectId);
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Proje silme yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const getProjectManager = (managerId) => {
    return users.find(user => user.id === managerId)?.name || 'Bilinmiyor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'paused': return 'Duraklatıldı';
      case 'completed': return 'Tamamlandı';
      default: return 'Bilinmiyor';
    }
  };

  return (
    <>
      <Helmet>
        <title>Projeler - Proje Kalkanı</title>
        <meta name="description" content="Tüm projelerinizi görüntüleyin ve yönetin. Proje durumlarını takip edin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Projeler</h1>
            <p className="text-gray-400 mt-1">Tüm projelerinizi görüntüleyin ve yönetin</p>
          </div>
          
          {hasPermission('create_project') && (
            <Button
              onClick={handleCreateProjectClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Proje
            </Button>
          )}
        </motion.div>

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
                  placeholder="Proje ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="paused">Duraklatıldı</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.length > 0 ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white truncate">{project.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                        {hasPermission('edit_project') && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="w-8 h-8">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleProjectSettings(project.id)}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Ayarlar</span>
                              </DropdownMenuItem>
                              {hasPermission('delete_project') && (
                                <DropdownMenuItem onClick={() => handleDeleteProject(project.id)} className="text-red-400">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  <span>Sil</span>
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">İlerleme</span>
                        <span className="text-white font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{project.members.length} üye</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.dueDate).toLocaleDateString('tr-TR')}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <p className="text-xs text-gray-400 mb-2">Proje Yöneticisi</p>
                        <p className="text-white font-medium">{getProjectManager(project.manager)}</p>
                      </div>
                    </div>
                  </div>

                  <div className={viewMode === 'grid' ? 'mt-4 pt-4 border-t border-white/10' : 'ml-6'}>
                    <Link to={`/projeler/${project.id}`} className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center block">
                      {viewMode === 'grid' ? 'Projeyi Görüntüle' : 'Detaylar'}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-effect rounded-xl p-12 text-center">
              <h3 className="text-xl font-bold text-white mb-2">Proje Bulunamadı</h3>
              <p className="text-gray-400 mb-6">Arama kriterlerinize uygun proje bulunamadı veya henüz proje oluşturulmadı.</p>
              {hasPermission('create_project') && (
                <Button onClick={handleCreateProjectClick} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Projenizi Oluşturun
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      <Dialog open={isAddProjectModalOpen} onOpenChange={setAddProjectModalOpen}>
        <DialogContent className="glass-effect">
          <DialogHeader>
            <DialogTitle>Yeni Proje Oluştur</DialogTitle>
            <DialogDescription>
              Projeniz için gerekli bilgileri girin.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Proje Adı</Label>
              <Input id="name" value={newProjectData.name} onChange={(e) => setNewProjectData({...newProjectData, name: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" value={newProjectData.description} onChange={(e) => setNewProjectData({...newProjectData, description: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label>Oluşturan</Label>
              <p className="text-sm text-gray-300">{user.name} ({new Date().toLocaleDateString('tr-TR')})</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProjectModalOpen(false)}>İptal</Button>
            <Button onClick={handleSaveNewProject}>Kaydet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Projects;