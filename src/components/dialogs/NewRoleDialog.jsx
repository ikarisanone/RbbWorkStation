
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
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';

const availablePermissions = [
    { id: 'create_project', name: 'Proje Oluşturma', description: 'Yeni proje oluşturabilir' },
    { id: 'edit_project', name: 'Proje Düzenleme', description: 'Mevcut projeleri düzenleyebilir' },
    { id: 'delete_project', name: 'Proje Silme', description: 'Projeleri silebilir' },
    { id: 'assign_users', name: 'Kullanıcı Atama', description: 'Projelere kullanıcı atayabilir' },
    { id: 'create_task', name: 'Görev Oluşturma', description: 'Yeni görev oluşturabilir' },
    { id: 'edit_task', name: 'Görev Düzenleme', description: 'Mevcut görevleri düzenleyebilir' },
    { id: 'delete_task', name: 'Görev Silme', description: 'Görevleri silebilir' },
    { id: 'assign_task', name: 'Görev Atama', description: 'Başkalarına görev atayabilir' },
    { id: 'change_status', name: 'Durum Değiştirme', description: 'Görev durumunu değiştirebilir' },
    { id: 'add_file', name: 'Dosya Ekleme', description: 'Görevlere dosya ekleyebilir' },
    { id: 'comment', name: 'Yorum Yapma', description: 'Görevlere yorum yapabilir' },
    { id: 'view_reports', name: 'Rapor Görüntüleme', description: 'Raporları görüntüleyebilir' },
    { id: 'manage_users', name: 'Kullanıcı Yönetimi', description: 'Kullanıcıları yönetebilir' },
    { id: 'manage_roles', name: 'Rol Yönetimi', description: 'Rolleri yönetebilir' },
    { id: 'view_audit_logs', name: 'Güvenlik Kayıtları', description: 'Güvenlik kayıtlarını görüntüleyebilir' }
];

export const NewRoleDialog = () => {
  const { addRole } = useData();
  const { dialogs, closeDialog } = useDialog();
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm({
    defaultValues: { permissions: [] }
  });

  const dialogState = dialogs.find(d => d.id === 'newRoleDialog');

  const onSubmit = async (data) => {
    await addRole({
      id: data.id.toLowerCase().replace(/\s+/g, '_'),
      ...data
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog('newRoleDialog');
  };

  if (!dialogState) return null;

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle>Yeni Rol Oluştur</DialogTitle>
          <DialogDescription>Yeni bir kullanıcı rolü ve yetkilerini tanımlayın.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Rol Adı</Label>
              <Input id="name" {...register('name', { required: 'Rol adı zorunludur' })} />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="id">Rol ID</Label>
              <Input id="id" {...register('id', { required: 'Rol ID zorunludur' })} placeholder="ornek_rol_id" />
              {errors.id && <p className="text-red-500 text-xs">{errors.id.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" {...register('description')} />
          </div>
          <div className="space-y-2">
            <Label>Yetkiler</Label>
            <Controller
              name="permissions"
              control={control}
              render={({ field }) => (
                <div className="permission-grid">
                  {availablePermissions.map(p => (
                    <div key={p.id} className="permission-card">
                      <Label className="flex items-start gap-3 cursor-pointer">
                        <Checkbox
                          checked={field.value?.includes(p.id)}
                          onCheckedChange={(checked) => {
                            const updatedPermissions = checked
                              ? [...field.value, p.id]
                              : field.value.filter(val => val !== p.id);
                            field.onChange(updatedPermissions);
                          }}
                        />
                        <div>
                          <span className="font-medium text-white text-sm">{p.name}</span>
                          <p className="text-gray-400 text-xs">{p.description}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            />
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
