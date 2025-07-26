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
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/contexts/DataContext';
import { useDialog } from '@/contexts/DialogContext';

export const NewUserDialog = () => {
  const { addUser, roles } = useData();
  const { dialogs, closeDialog } = useDialog();
  const { register, handleSubmit, formState: { errors }, control, reset } = useForm();

  const dialogState = dialogs.find(d => d.id === 'newUserDialog');

  const onSubmit = async (data) => {
    await addUser({
      email: data.email,
      password: data.password,
      name: data.name,
      title: data.title,
      role: data.role,
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    closeDialog('newUserDialog');
  };

  if (!dialogState) return null;

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] glass-effect">
        <DialogHeader>
          <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
          <DialogDescription>Yeni bir kullanıcıyı sisteme davet edin.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" {...register('name', { required: 'Ad zorunludur' })} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" {...register('email', { required: 'E-posta zorunludur' })} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Geçici Şifre</Label>
            <Input id="password" type="password" {...register('password', { required: 'Şifre zorunludur', minLength: { value: 6, message: 'Şifre en az 6 karakter olmalı' } })} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Unvan</Label>
              <Input id="title" {...register('title')} />
            </div>
            <div className="space-y-2">
              <Label>Rol</Label>
              <Controller name="role" control={control} rules={{ required: 'Rol seçimi zorunludur' }} render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger><SelectValue placeholder="Rol seçin" /></SelectTrigger>
                  <SelectContent>{roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              )} />
              {errors.role && <p className="text-red-500 text-xs">{errors.role.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>İptal</Button>
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600">Kullanıcıyı Davet Et</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};