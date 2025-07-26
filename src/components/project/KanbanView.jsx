import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, AlertCircle, Eye } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';

const TaskCard = ({ task }) => {
  const { users } = useData();
  const { openDialog } = useDialog();
  const assignedUser = users.find(u => u.id === task.assigned_to_id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`task-card rounded-lg p-4 bg-white/5 mb-3 priority-${task.priority} cursor-pointer`}
      onClick={() => openDialog('editTaskDialog', { taskId: task.id })}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-white truncate">{task.title}</h4>
      </div>
      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{task.description}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          {assignedUser && (
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">{assignedUser.name.charAt(0)}</span>
              </div>
              <span className="text-gray-300">{assignedUser.name}</span>
            </div>
          )}
        </div>
        <span>{new Date(task.due_date).toLocaleDateString('tr-TR')}</span>
      </div>
    </motion.div>
  );
};

const KanbanColumn = ({ title, tasks, icon: Icon }) => (
  <div className="kanban-column">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-gray-400" />
        <h3 className="font-semibold text-white">{title}</h3>
        <span className="bg-gray-600 text-white text-xs px-2 py-1 rounded-full">{tasks.length}</span>
      </div>
    </div>
    <div className="space-y-3">
      {tasks.map(task => <TaskCard key={task.id} task={task} />)}
      {tasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Icon className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Görev yok</p>
        </div>
      )}
    </div>
  </div>
);

const KanbanView = ({ tasks }) => {
  const getTasksByStatus = (status) => tasks.filter(task => task.status === status);

  const columns = [
    { title: 'Yapılacak', status: 'todo', icon: AlertCircle, tasks: getTasksByStatus('todo') },
    { title: 'Devam Ediyor', status: 'progress', icon: Clock, tasks: getTasksByStatus('progress') },
    { title: 'İnceleme', status: 'review', icon: Eye, tasks: getTasksByStatus('review') },
    { title: 'Tamamlandı', status: 'done', icon: CheckCircle, tasks: getTasksByStatus('done') },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {columns.map(col => (
        <KanbanColumn key={col.status} title={col.title} tasks={col.tasks} icon={col.icon} />
      ))}
    </div>
  );
};

export default KanbanView;