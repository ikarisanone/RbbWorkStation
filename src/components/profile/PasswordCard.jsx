import React, { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const PasswordInput = ({ value, onChange, show, onToggle, id, label }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-2">
      {label}
    </label>
    <div className="relative">
      <Input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        className="bg-white/10 border-white/20 text-white pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

export const PasswordCard = () => {
  const { updatePassword } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handlePasswordDataChange = (e, field) => {
    setPasswordData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleToggleShowPassword = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Hata",
        description: "Yeni şifreler eşleşmiyor.",
        variant: "destructive",
      });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Hata",
        description: "Yeni şifre en az 6 karakter olmalıdır.",
        variant: "destructive",
      });
      return;
    }
    
    await updatePassword(passwordData.newPassword);
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Şifre Güvenliği</h2>
        {!showPasswordForm && (
          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(true)}
          >
            <Lock className="w-4 h-4 mr-2" />
            Şifre Değiştir
          </Button>
        )}
      </div>

      {showPasswordForm && (
        <form onSubmit={handleChangePassword}>
          <div className="space-y-4">
            <PasswordInput
              id="newPassword"
              label="Yeni Şifre"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordDataChange(e, 'newPassword')}
              show={showPasswords.new}
              onToggle={() => handleToggleShowPassword('new')}
            />
            <PasswordInput
              id="confirmPassword"
              label="Yeni Şifre (Tekrar)"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordDataChange(e, 'confirmPassword')}
              show={showPasswords.confirm}
              onToggle={() => handleToggleShowPassword('confirm')}
            />

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowPasswordForm(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Şifreyi Değiştir
              </Button>
            </div>
          </div>
        </form>
      )}

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <h3 className="text-blue-300 font-medium mb-2">Güçlü Şifre Önerileri</h3>
        <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
          <li>En az 8 karakter uzunluğunda olmalı</li>
          <li>Büyük ve küçük harf içermeli</li>
          <li>En az bir rakam içermeli</li>
        </ul>
      </div>
    </div>
  );
};
