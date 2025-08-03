import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageSquare, Paperclip, User, Send, Flag, UserPlus, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';

const TaskDetailModal = ({ task, isOpen, onClose, onUpdateTask }) => {
  const { user, hasPermission } = useAuth();
  const { users } = useData();
  const [newComment, setNewComment] = useState('');
  const [currentStatus, setCurrentStatus] = useState(task.status);
  const [currentPriority, setCurrentPriority] = useState(task.priority);
  const [assignedUsers, setAssignedUsers] = useState(task.assignedTo || []);

  if (!isOpen) return null;

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;

    const comment = {
      id: Date.now().toString(),
      userId: user.id,
      text: newComment,
      timestamp: new Date(),
    };

    const updatedTask = {
      ...task,
      comments: [...(task.comments || []), comment],
    };
    onUpdateTask(task.id, { comments: updatedTask.comments });
    setNewComment('');
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onUpdateTask(task.id, { status: newStatus });
  };

  const handlePriorityChange = (newPriority) => {
    setCurrentPriority(newPriority);
    onUpdateTask(task.id, { priority: newPriority });
  };

  const handleAssigneeChange = (userId, checked) => {
    let newAssignedUsers;
    if (checked) {
      newAssignedUsers = [...assignedUsers, userId];
    } else {
      newAssignedUsers = assignedUsers.filter(id => id !== userId);
    }
    setAssignedUsers(newAssignedUsers);
    onUpdateTask(task.id, { assignedTo: newAssignedUsers });
  };

  const getUserById = (id) => users.find(u => u.id === id);

  const statusOptions = [
    { value: 'todo', label: 'Yapılacak' },
    { value: 'progress', label: 'Devam Ediyor' },
    { value: 'review', label: 'İncelemede' },
    { value: 'done', label: 'Tamamlandı' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Düşük' },
    { value: 'medium', label: 'Orta' },
    { value: 'high', label: 'Yüksek' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-effect rounded-xl p-8 max-w-3xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{task.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-4 -mr-4 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Açıklama</h3>
            <p className="text-gray-300">{task.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Durum</h3>
              <Select
                value={currentStatus}
                onValueChange={handleStatusChange}
                disabled={!hasPermission('change_status')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Durum Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Öncelik</h3>
              <Select
                value={currentPriority}
                onValueChange={handlePriorityChange}
                disabled={!hasPermission('edit_task')}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Öncelik Seçin" />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Atanan Kişiler</h3>
            <div className="flex flex-wrap gap-2 items-center">
              {assignedUsers.map(id => {
                const assignedUser = getUserById(id);
                return (
                  <div key={id} className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1">
                    <span className="text-white text-sm">{assignedUser?.name || 'Bilinmiyor'}</span>
                    {hasPermission('assign_task') && (
                      <button onClick={() => handleAssigneeChange(id, false)}>
                        <XCircle className="w-4 h-4 text-red-400 hover:text-red-300" />
                      </button>
                    )}
                  </div>
                );
              })}
              {hasPermission('assign_task') && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full w-8 h-8">
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 p-0">
                    <div className="p-4 space-y-2">
                      <h4 className="font-medium text-sm">Üye Ata</h4>
                      {users.map(u => (
                        <div key={u.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`user-${u.id}`}
                            checked={assignedUsers.includes(u.id)}
                            onCheckedChange={(checked) => handleAssigneeChange(u.id, checked)}
                          />
                          <label htmlFor={`user-${u.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {u.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Yorumlar</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {(task.comments || []).map(comment => {
                const commentUser = getUserById(comment.userId);
                return (
                  <div key={comment.id} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">{commentUser?.name.charAt(0)}</span>
                    </div>
                    <div className="bg-white/5 p-3 rounded-lg flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{commentUser?.name}</p>
                        <p className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleString('tr-TR')}</p>
                      </div>
                      <p className="text-sm text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                );
              })}
              {(!task.comments || task.comments.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-4">Henüz yorum yok.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{user?.name.charAt(0)}</span>
            </div>
            <Input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Yorum ekle..."
              className="bg-white/10 border-white/20 text-white"
              disabled={!hasPermission('comment')}
            />
            <Button type="submit" size="icon" disabled={!hasPermission('comment') || !newComment.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskDetailModal;