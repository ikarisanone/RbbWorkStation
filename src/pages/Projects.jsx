import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Calendar,
  Users,
  Clock,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const Projects = () => {
  const { projects, users } = useData();
  const { hasPermission } = useAuth();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (hasPermission('create_project')) {
      toast({
        title: "Yeni Proje",
        description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
      });
    } else {
      toast({
        title: "Yetki Hatası",
        description: "Proje oluşturma yetkiniz bulunmamaktadır.",
        variant: "destructive",
      });
    }
  };

  const getProjectManager = (managerId) => {
    return users.find(user => user.id === managerId)?.name || 'Bilinmiyor';
  };

  const getProjectMembers = (memberIds) => {
    return memberIds.map(id => users.find(user => user.id === id)?.name).filter(Boolean);
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
        {/* Başlık ve Eylemler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Projeler</h1>
            <p className="text-gray-400 mt-1">Tüm projelerinizi görüntüleyin ve yönetin</p>
          </div>
          
          <Button
            onClick={handleCreateProject}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Proje
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
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Proje Listesi */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.length > 0 ? (
            <div className={viewMode === 'grid' ? 
              'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 
              'space-y-4'
            }>
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-effect rounded-xl p-6 hover:scale-105 transition-all duration-300 ${
                    viewMode === 'list' ? 'flex items-center justify-between' : ''
                  }`}
                >
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-white truncate">{project.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                        <Button variant="ghost" size="icon" className="w-8 h-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">İlerleme</span>
                        <span className="text-white font-medium">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{getProjectMembers(project.members).length} üye</span>
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

                  {viewMode === 'list' && (
                    <div className="ml-6">
                      <Link
                        to={`/projeler/${project.id}`}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                      >
                        Detaylar
                      </Link>
                    </div>
                  )}

                  {viewMode === 'grid' && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <Link
                        to={`/projeler/${project.id}`}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 text-center block"
                      >
                        Projeyi Görüntüle
                      </Link>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-effect rounded-xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Proje Bulunamadı</h3>
              <p className="text-gray-400 mb-6">
                {searchQuery || filterStatus !== 'all' 
                  ? 'Arama kriterlerinize uygun proje bulunamadı.'
                  : 'Henüz hiç proje oluşturulmamış.'
                }
              </p>
              {hasPermission('create_project') && (
                <Button
                  onClick={handleCreateProject}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  İlk Projenizi Oluşturun
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </>
  );
};

export default Projects;