import React from 'react';
import { CheckCircle, Plus } from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';
import { Button } from '@/components/ui/button';

const ListView = ({ tasks }) => {
  const { users } = useData();
  const { openDialog } = useDialog();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 glass-effect rounded-xl mt-4">
        <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Henüz Görev Yok</h3>
        <p className="text-gray-400 mb-6">Bu projede henüz hiç görev oluşturulmamış.</p>
        <Button
          onClick={() => openDialog('newTaskDialog', { projectId: tasks[0]?.project_id })}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          İlk Görevi Oluştur
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-effect rounded-xl p-6 mt-4">
      <div className="space-y-4">
        {tasks.map(task => {
          const assignedUser = users.find(u => u.id === task.assigned_to_id);
          return (
            <div key={task.id} className="task-card rounded-lg p-4 bg-white/5 flex items-center justify-between cursor-pointer" onClick={() => openDialog('editTaskDialog', { taskId: task.id })}>
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
                <p>{new Date(task.due_date).toLocaleDateString('tr-TR')}</p>
                <p>{assignedUser?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ListView;