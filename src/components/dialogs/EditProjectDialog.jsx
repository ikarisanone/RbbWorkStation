import React, { useEffect } from 'react';
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
import { useDialog } from '@/contexts/DialogContext';
import { toast } from '@/components/ui/use-toast';
import { Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const EditProjectDialog = () => {
  const { users, updateProject, deleteProject } = useData();
  const { dialogs, closeDialog } = useDialog();
  const navigate = useNavigate();
  
  const dialogState = dialogs.find(d => d.id === 'editProjectDialog');
  const project = dialogState?.props?.project;

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        description: project.description,
        manager_id: project.manager_id,
        status: project.status,
        due_date: project.due_date ? new Date(project.due_date).toISOString().split('T')[0] : '',
        members: project.members || [],
      });
    }
  }, [project, reset]);

  const onSubmit = async (data) => {
    await updateProject(project.id, data);
    handleClose();
  };

  const handleDelete = async () => {
    await deleteProject(project.id);
    toast({ title: "Proje Silindi", description: `${project.name} projesi başarıyla silindi.` });
    handleClose();
    navigate('/projeler');
  };

  const handleClose = () => {
    reset();
    closeDialog('editProjectDialog');
  };

  if (!dialogState || !project) return null;

  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'super_admin');

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle>Proje Düzenle</DialogTitle>
          <DialogDescription>{project.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="name">Proje Adı</Label>
            <Input id="name" {...register('name', { required: 'Proje adı zorunludur' })} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Proje Yöneticisi</Label>
              <Controller name="manager_id" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{adminUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                </Select>
              )} />
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="paused">Duraklatıldı</SelectItem>
                    <SelectItem value="completed">Tamamlandı</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Ekip Üyeleri</Label>
            <Controller name="members" control={control} render={({ field }) => (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 rounded-md border max-h-48 overflow-y-auto">
                {users.map(u => (
                  <Label key={u.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                    <input type="checkbox" value={u.id} checked={field.value?.includes(u.id)}
                      onChange={(e) => {
                        const selected = field.value || [];
                        if (e.target.checked) field.onChange([...selected, u.id]);
                        else field.onChange(selected.filter(id => id !== u.id));
                      }}
                      className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span>{u.name}</span>
                  </Label>
                ))}
              </div>
            )} />
          </div>
          <DialogFooter className="pt-4 flex justify-between w-full">
            <Button type="button" variant="destructive" onClick={handleDelete}><Trash2 className="w-4 h-4 mr-2" /> Sil</Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Kaydet</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};