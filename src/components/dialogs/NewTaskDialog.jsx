import React from 'react';
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

export const NewTaskDialog = ({ dialogId, projectId = null, preselectedUser = null }) => {
  const { addTask, users, projects, addAuditLog } = useData();
  const { user: currentUser } = useAuth();
  const { closeDialog } = useDialog();
  
  const { register, handleSubmit, formState: { errors }, control, watch, reset } = useForm();
  
  const selectedProjectId = watch('projectId', projectId);

  const getAssignableUsers = () => {
    if (selectedProjectId) {
        const project = projects?.find(p => p.id === selectedProjectId);
        if (project) {
            return users?.filter(u => project.members.includes(u.id)) || [];
        }
    }
    return users || [];
  };

  const onSubmit = async (data) => {
    const newTaskData = {
      title: data.title,
      description: data.description,
      project_id: data.projectId || null,
      assigned_to_id: data.assigned_to_id,
      priority: data.priority,
      due_date: data.due_date,
      status: 'todo',
    };
    
    await addTask(newTaskData);
    
    addAuditLog({
        user_id: currentUser.id,
        action: 'task_created',
        description: `"${newTaskData.title}" görevini oluşturdu.`,
    });
    
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog(dialogId);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          <DialogDescription>
            Görevin detaylarını girerek ekibinize atayın.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Görev Başlığı</Label>
            <Input id="title" {...register('title', { required: 'Başlık zorunludur' })} />
            {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          {!projectId && (
             <div className="space-y-2">
                <Label>Proje (İsteğe Bağlı)</Label>
                <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bir proje seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {(projects || []).map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Atanan Kişi</Label>
                <Controller
                    name="assigned_to_id"
                    control={control}
                    rules={{ required: 'Atanacak kişi zorunludur' }}
                    defaultValue={preselectedUser}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Birini ata" />
                            </SelectTrigger>
                            <SelectContent>
                                {getAssignableUsers().map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                 {errors.assigned_to_id && <p className="text-red-500 text-xs">{errors.assigned_to_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Öncelik</Label>
                <Controller
                    name="priority"
                    control={control}
                    rules={{ required: 'Öncelik zorunludur' }}
                    defaultValue="medium"
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Öncelik seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Düşük</SelectItem>
                                <SelectItem value="medium">Orta</SelectItem>
                                <SelectItem value="high">Yüksek</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="due_date">Bitiş Tarihi</Label>
            <Input id="due_date" type="date" {...register('due_date', { required: 'Bitiş tarihi zorunludur' })} />
             {errors.due_date && <p className="text-red-500 text-xs">{errors.due_date.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Oluştur</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};