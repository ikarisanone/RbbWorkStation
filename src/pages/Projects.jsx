import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Users,
  Calendar,
  FolderOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDialog } from '@/contexts/DialogContext';

const Projects = () => {
  const { projects, users } = useData();
  const { hasPermission } = useAuth();
  const { openDialog } = useDialog();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleCreateProject = () => {
    if (hasPermission('create_project')) {
      openDialog('newProjectDialog');
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
  
  const ProjectCard = ({ project, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="glass-effect rounded-xl p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300"
        onClick={() => navigate(`/projeler/${project.id}`)}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white truncate hover:underline">{project.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {getStatusText(project.status)}
            </span>
        </div>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{project.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">İlerleme</span>
            <span className="text-white font-medium">{project.progress || 0}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress || 0}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{project.members.length} üye</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{project.due_date ? new Date(project.due_date).toLocaleDateString('tr-TR') : 'N/A'}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-1">Proje Yöneticisi</p>
            <p className="text-white font-medium text-sm">{getProjectManager(project.manager_id)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <Helmet>
        <title>Projeler - Rbb Work Station</title>
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
              onClick={handleCreateProject}
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
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Proje ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 w-full"
              />
            </div>
            
            <div className="flex gap-4 w-full lg:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-md text-white w-full"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="paused">Duraklatıldı</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredProjects.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-effect rounded-xl p-12 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-10 h-10 text-white" />
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
