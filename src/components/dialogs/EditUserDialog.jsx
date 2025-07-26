
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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';

export const EditUserDialog = () => {
  const { roles, updateUser } = useData();
  const { dialogs, closeDialog } = useDialog();
  
  const dialogState = dialogs.find(d => d.id === 'editUserDialog');
  const user = dialogState?.props?.user;

  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        title: user.title,
        role: user.role,
        status: user.status,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    await updateUser(user.id, data);
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog('editUserDialog');
  };

  if (!dialogState || !user) return null;

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle>Kullanıcıyı Düzenle</DialogTitle>
          <DialogDescription>{user.email}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" {...register('name', { required: 'Ad zorunludur' })} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Unvan</Label>
            <Input id="title" {...register('title')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Rol</Label>
              <Controller name="role" control={control} rules={{ required: 'Rol seçimi zorunludur' }} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id} disabled={r.id === 'super_admin'}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              )} />
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Durum</Label>
              <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Pasif</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Kaydet</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
