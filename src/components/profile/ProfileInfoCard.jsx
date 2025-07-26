import React from 'react';
import { User, Mail, Briefcase, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const getRoleName = (role) => {
  const roleMap = {
    super_admin: 'Süper Admin',
    admin: 'Yönetici',
    member: 'Ekip Üyesi',
    guest: 'Misafir',
  };
  return roleMap[role] || 'Bilinmiyor';
};

const getRoleColor = (role) => {
  const colorMap = {
    super_admin: 'role-super-admin',
    admin: 'role-admin',
    member: 'role-member',
    guest: 'role-guest',
  };
  return colorMap[role] || 'role-guest';
};

const InfoRow = ({ icon: Icon, label, value, isEditing, onChange, name, type = "text" }) => (
  <div className="flex items-center gap-4">
    <Icon className="w-5 h-5 text-gray-400" />
    <div className="flex-1">
      <label className="text-xs text-gray-400">{label}</label>
      {isEditing ? (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className="bg-transparent border-0 border-b-2 border-white/20 rounded-none p-0 focus:ring-0 text-white text-base"
        />
      ) : (
        <p className="text-white font-medium text-base">{value}</p>
      )}
    </div>
  </div>
);

export const ProfileInfoCard = ({ user, isEditing, formData, setFormData }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Profil Bilgileri</h2>
      </div>
      <div className="space-y-6">
        <InfoRow
          icon={User}
          label="Ad Soyad"
          value={formData.name}
          isEditing={isEditing}
          onChange={handleInputChange}
          name="name"
        />
        <InfoRow
          icon={Mail}
          label="E-posta Adresi"
          value={formData.email}
          isEditing={isEditing}
          onChange={handleInputChange}
          name="email"
          type="email"
        />
        <InfoRow
          icon={Briefcase}
          label="Unvan"
          value={formData.title}
          isEditing={isEditing}
          onChange={handleInputChange}
          name="title"
        />
        <div className="flex items-center gap-4">
          <Award className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <label className="text-xs text-gray-400">Rol</label>
            <p className={`role-badge ${getRoleColor(user?.role)} w-fit mt-1`}>
              {getRoleName(user?.role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};