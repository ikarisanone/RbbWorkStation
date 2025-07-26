import React from 'react';
import { Smartphone, Key, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const SecurityItem = ({ icon: Icon, title, description, color, onClick, buttonText }) => (
  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${color}`} />
      <div>
        <p className="text-white font-medium text-sm">{title}</p>
        <p className="text-gray-400 text-xs">{description}</p>
      </div>
    </div>
    <Button
      size="sm"
      variant="outline"
      onClick={onClick}
    >
      {buttonText}
    </Button>
  </div>
);

export const SecuritySettingsCard = () => {
  const handleFeatureClick = (featureName) => {
    toast({
      title: featureName,
      description: "🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀",
    });
  };

  return (
    <div className="glass-effect rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Güvenlik Ayarları</h2>
      <div className="space-y-4">
        <SecurityItem
          icon={Smartphone}
          title="İki Faktörlü Kimlik Doğrulama"
          description="Ekstra güvenlik katmanı"
          color="text-blue-400"
          onClick={() => handleFeatureClick("İki Faktörlü Kimlik Doğrulama")}
          buttonText="Etkinleştir"
        />
        <SecurityItem
          icon={Key}
          title="API Anahtarları"
          description="Entegrasyon anahtarları"
          color="text-yellow-400"
          onClick={() => handleFeatureClick("API Anahtarları")}
          buttonText="Yönet"
        />
        <SecurityItem
          icon={Activity}
          title="Oturum Yönetimi"
          description="Aktif oturumlar"
          color="text-green-400"
          onClick={() => handleFeatureClick("Oturum Yönetimi")}
          buttonText="Görüntüle"
        />
      </div>
    </div>
  );
};