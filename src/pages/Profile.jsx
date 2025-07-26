import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Edit, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { toast } from '@/components/ui/use-toast';
import { ProfileInfoCard } from '@/components/profile/ProfileInfoCard';
import { PasswordCard } from '@/components/profile/PasswordCard';
import { SecuritySettingsCard } from '@/components/profile/SecuritySettingsCard';

const Profile = () => {
  const { user, updateUserMetadata } = useAuth();
  const { updateUser } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    title: user?.title || ''
  });

  const handleSaveProfile = async () => {
    try {
      await updateUser(user.id, { name: formData.name, title: formData.title });
      await updateUserMetadata({ name: formData.name, title: formData.title });
      toast({
        title: "Profil Güncellendi",
        description: "Profil bilgileriniz başarıyla kaydedildi.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Hata",
        description: `Profil güncellenirken bir hata oluştu: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleCancelEdit = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      title: user?.title || ''
    });
    setIsEditing(false);
  }

  return (
    <>
      <Helmet>
        <title>Profil - Rbb Work Station</title>
        <meta name="description" content="Profil bilgilerinizi görüntüleyin ve düzenleyin. Güvenlik ayarlarınızı yönetin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Profilim</h1>
            <p className="text-gray-400 mt-1">Hesap bilgilerinizi ve güvenlik ayarlarınızı yönetin</p>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 mr-2" /> İptal
                </Button>
                <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-blue-500 to-purple-600">
                  <Save className="w-4 h-4 mr-2" /> Kaydet
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" /> Düzenle
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            <ProfileInfoCard
              user={user}
              isEditing={isEditing}
              formData={formData}
              setFormData={setFormData}
            />
            <PasswordCard />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <SecuritySettingsCard />
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Profile;
