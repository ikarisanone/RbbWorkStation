import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Shield, Bell, Palette, Code } from 'lucide-react';

const SettingsPage = () => {
  return (
    <>
      <Helmet>
        <title>Ayarlar - Proje Kalkanı</title>
        <meta name="description" content="Uygulama ayarlarını yönetin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
          <p className="text-gray-400 mt-1">Uygulama genelindeki ayarları yönetin.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Güvenlik Ayarları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-bold text-white">Güvenlik</h2>
            </div>
            <p className="text-gray-400">
              🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀
            </p>
          </motion.div>

          {/* Bildirim Ayarları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-bold text-white">Bildirimler</h2>
            </div>
            <p className="text-gray-400">
              🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀
            </p>
          </motion.div>

          {/* Görünüm Ayarları */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Palette className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white">Görünüm</h2>
            </div>
            <p className="text-gray-400">
              🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀
            </p>
          </motion.div>

          {/* Entegrasyonlar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-effect rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Code className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-bold text-white">Entegrasyonlar</h2>
            </div>
            <p className="text-gray-400">
              🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;