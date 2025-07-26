
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

export const NewProjectDialog = ({ dialogId }) => {
  const { addProject, users, addAuditLog } = useData();
  const { user: currentUser } = useAuth();
  const { closeDialog } = useDialog();
  
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();
  
  const onSubmit = async (data) => {
    const newProject = {
      name: data.name,
      description: data.description,
      manager_id: data.manager_id,
      due_date: data.due_date,
      members: data.members ? [...data.members, data.manager_id] : [data.manager_id]
    };
    await addProject(newProject);
    addAuditLog({
        user_id: currentUser.id,
        action: 'project_created',
        description: `"${newProject.name}" projesini oluşturdu.`,
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog(dialogId);
  };

  const adminUsers = users.filter(u => u.role === 'admin' || u.role === 'super_admin');

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle>Yeni Proje Oluştur</DialogTitle>
          <DialogDescription>
            Proje detaylarını girerek ekibinizi oluşturun.
          </DialogDescription>
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
                <Controller
                    name="manager_id"
                    control={control}
                    rules={{ required: 'Yönetici seçimi zorunludur' }}
                    render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Bir yönetici seçin" />
                            </SelectTrigger>
                            <SelectContent>
                                {adminUsers.map(u => (
                                    <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.manager_id && <p className="text-red-500 text-xs">{errors.manager_id.message}</p>}
            </div>
             <div className="space-y-2">
                <Label htmlFor="due_date">Bitiş Tarihi</Label>
                <Input id="due_date" type="date" {...register('due_date', { required: 'Bitiş tarihi zorunludur' })} />
                {errors.due_date && <p className="text-red-500 text-xs">{errors.due_date.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
              <Label>Ekip Üyeleri</Label>
               <Controller
                    name="members"
                    control={control}
                    defaultValue={[]}
                    render={({ field }) => (
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 rounded-md border max-h-48 overflow-y-auto">
                            {users.map(u => (
                                <Label key={u.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        value={u.id}
                                        checked={field.value.includes(u.id)}
                                        onChange={(e) => {
                                            const selected = field.value;
                                            if (e.target.checked) {
                                                field.onChange([...selected, u.id]);
                                            } else {
                                                field.onChange(selected.filter(id => id !== u.id));
                                            }
                                        }}
                                        className="form-checkbox h-4 w-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <span>{u.name}</span>
                                </Label>
                            ))}
                        </div>
                    )}
                />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Projeyi Oluştur</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
