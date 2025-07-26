
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
import { Checkbox } from '@/components/ui/checkbox';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';
import { Lock } from 'lucide-react';

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

export const EditRoleDialog = () => {
  const { updateRole } = useData();
  const { dialogs, closeDialog } = useDialog();
  
  const dialogState = dialogs.find(d => d.id === 'editRoleDialog');
  const role = dialogState?.props?.role;

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description,
        permissions: role.permissions || [],
      });
    }
  }, [role, reset]);

  const onSubmit = async (data) => {
    await updateRole(role.id, data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog('editRoleDialog');
  };

  if (!dialogState || !role) return null;

  const isSystemRole = role.is_system || role.permissions.includes('all');

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl glass-effect">
        <DialogHeader>
          <DialogTitle>Rolü Düzenle</DialogTitle>
          <DialogDescription>{role.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
          <div className="space-y-2">
            <Label htmlFor="name">Rol Adı</Label>
            <Input id="name" {...register('name', { required: 'Rol adı zorunludur' })} disabled={isSystemRole} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" {...register('description')} disabled={isSystemRole} />
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
                      <Label className={`flex items-start gap-3 ${isSystemRole ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                        <Checkbox
                          checked={field.value?.includes(p.id)}
                          disabled={isSystemRole}
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
          {isSystemRole && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-400 font-medium">Sistem Rolü</p>
              </div>
              <p className="text-yellow-200 text-sm mt-1">
                Bu rol sistem tarafından korunmaktadır ve düzenlenemez.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600" disabled={isSystemRole}>Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
