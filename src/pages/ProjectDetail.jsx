import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { 
  ArrowLeft, 
  Plus, 
  Settings,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDialog } from '@/contexts/DialogContext';
import ProjectHeader from '@/components/project/ProjectHeader';
import ProjectStats from '@/components/project/ProjectStats';
import ProjectTeam from '@/components/project/ProjectTeam';
import KanbanView from '@/components/project/KanbanView';
import ListView from '@/components/project/ListView';
import CalendarView from '@/components/project/CalendarView';
import TimelineView from '@/components/project/TimelineView';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, users, loading } = useData();
  const { hasPermission } = useAuth();
  const { openDialog } = useDialog();

  const project = projects.find(p => p.id === projectId);
  const projectTasks = tasks.filter(t => t.project_id === projectId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Proje Bulunamadı</h2>
          <p className="text-gray-400 mb-4">Aradığınız proje mevcut değil veya erişim yetkiniz yok.</p>
          <Link to="/projeler">
            <Button>Projelere Dön</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddTask = () => {
    if (hasPermission('create_task')) {
      openDialog('newTaskDialog', { projectId: project.id });
    }
  };

  const handleProjectSettings = () => {
    if (hasPermission('edit_project')) {
      openDialog('editProjectDialog', { project });
    }
  };

  return (
    <>
      <Helmet>
        <title>{project.name} - Rbb Work Station</title>
        <meta name="description" content={`${project.name} proje detayları. Görevleri görüntüleyin ve yönetin.`} />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projeler')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <ProjectHeader project={project} />
          </div>
          
          <div className="flex items-center gap-2">
            {hasPermission('create_task') && (
              <Button
                onClick={handleAddTask}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Görev Ekle
              </Button>
            )}
            {hasPermission('edit_project') && (
              <Button onClick={handleProjectSettings} variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Ayarlar
              </Button>
            )}
          </div>
        </motion.div>

        <ProjectStats tasks={projectTasks} members={project.members} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="kanban" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="kanban">Kanban</TabsTrigger>
              <TabsTrigger value="list">Liste</TabsTrigger>
              <TabsTrigger value="calendar">Takvim</TabsTrigger>
              <TabsTrigger value="timeline">Zaman Çizelgesi</TabsTrigger>
            </TabsList>
            <TabsContent value="kanban">
              <KanbanView tasks={projectTasks} />
            </TabsContent>
            <TabsContent value="list">
              <ListView tasks={projectTasks} />
            </TabsContent>
            <TabsContent value="calendar">
              <CalendarView tasks={projectTasks} />
            </TabsContent>
            <TabsContent value="timeline">
              <TimelineView tasks={projectTasks} project={project} />
            </TabsContent>
          </Tabs>
        </motion.div>

        <ProjectTeam project={project} users={users} />
      </div>
    </>
  );
};

export default ProjectDetail;