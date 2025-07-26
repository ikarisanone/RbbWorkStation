import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useAuth } from '@/contexts/AuthContext';
import { useDialog } from '@/contexts/DialogContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Paperclip, Send, Trash2 } from 'lucide-react';

export const EditTaskDialog = () => {
  const { tasks, users, projects, updateTask, deleteTask, addTaskComment } = useData();
  const { user: currentUser, hasPermission } = useAuth();
  const { dialogs, closeDialog } = useDialog();
  
  const dialogState = dialogs.find(d => d.id === 'editTaskDialog');
  const taskId = dialogState?.props?.taskId;
  const task = tasks.find(t => t.id === taskId);

  const { register, handleSubmit, formState: { errors }, control, reset, setValue } = useForm();
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        project_id: task.project_id,
        assigned_to_id: task.assigned_to_id,
        priority: task.priority,
        status: task.status,
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      });
    }
  }, [task, reset]);

  const getAssignableUsers = () => {
    if (task?.project_id) {
        const project = projects.find(p => p.id === task.project_id);
        if (project) {
            return users.filter(u => project.members.includes(u.id));
        }
    }
    return users;
  };

  const onSubmit = async (data) => {
    await updateTask(taskId, data);
    handleClose();
  };

  const handleDelete = async () => {
    await deleteTask(taskId);
    handleClose();
  };

  const handleAddComment = async () => {
    if (newComment.trim() === '') return;
    await addTaskComment({
      task_id: taskId,
      user_id: currentUser.id,
      text: newComment,
    });
    setNewComment('');
  };

  const handleClose = () => {
    reset();
    closeDialog('editTaskDialog');
  };

  if (!dialogState || !task) return null;

  const canEdit = hasPermission('edit_task');
  const canDelete = hasPermission('delete_task');

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle>Görevi Düzenle</DialogTitle>
          <DialogDescription>{task.title}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-h-[70vh]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 md:col-span-2 overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="title">Görev Başlığı</Label>
              <Input id="title" {...register('title', { required: 'Başlık zorunludur' })} disabled={!canEdit} />
              {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <Textarea id="description" {...register('description')} disabled={!canEdit} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Atanan Kişi</Label>
                <Controller name="assigned_to_id" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!canEdit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{getAssignableUsers().map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-2">
                <Label>Durum</Label>
                <Controller name="status" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!hasPermission('change_status')}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todo">Yapılacak</SelectItem>
                      <SelectItem value="progress">Devam Ediyor</SelectItem>
                      <SelectItem value="review">İnceleme</SelectItem>
                      <SelectItem value="done">Tamamlandı</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Öncelik</Label>
                <Controller name="priority" control={control} render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!canEdit}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Düşük</SelectItem>
                      <SelectItem value="medium">Orta</SelectItem>
                      <SelectItem value="high">Yüksek</SelectItem>
                    </SelectContent>
                  </Select>
                )} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Bitiş Tarihi</Label>
                <Input id="due_date" type="date" {...register('due_date')} disabled={!canEdit} />
              </div>
            </div>
            <DialogFooter className="pt-4">
              {canDelete && <Button type="button" variant="destructive" onClick={handleDelete}>Görevi Sil</Button>}
              {canEdit && <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Kaydet</Button>}
            </DialogFooter>
          </form>
          <div className="space-y-4 py-4 flex flex-col">
            <h3 className="font-semibold">Yorumlar</h3>
            <ScrollArea className="flex-grow h-0 pr-4">
              {task.task_comments?.length > 0 ? task.task_comments.map(comment => {
                const commentUser = users.find(u => u.id === comment.user_id);
                return (
                  <div key={comment.id} className="mb-4 text-sm">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{commentUser?.name}</p>
                      <p className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleString('tr-TR')}</p>
                    </div>
                    <p className="bg-white/5 p-2 rounded-md">{comment.text}</p>
                  </div>
                )
              }) : <p className="text-sm text-gray-400">Henüz yorum yok.</p>}
            </ScrollArea>
            {hasPermission('comment') && (
              <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                <Input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Yorum ekle..." />
                <Button size="icon" onClick={handleAddComment}><Send className="w-4 h-4" /></Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};