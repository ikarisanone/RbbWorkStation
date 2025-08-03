import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Bell, CheckCheck, Settings, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useData } from '@/contexts/DataContext';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
  const { notifications, markAllNotificationsAsRead } = useData();

  return (
    <>
      <Helmet>
        <title>Bildirimler - Proje Kalkanı</title>
        <meta name="description" content="Uygulama bildirimlerinizi görüntüleyin." />
      </Helmet>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Bildirimler</h1>
            <p className="text-gray-400 mt-1">Son aktiviteleri ve güncellemeleri buradan takip edin.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={markAllNotificationsAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tümünü Okundu İşaretle
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6"
        >
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map(notif => (
                <Link to={notif.link} key={notif.id}>
                  <div
                    className={`p-4 rounded-lg flex items-start gap-4 transition-colors hover:bg-white/10 ${
                      notif.read ? 'bg-white/5' : 'bg-blue-500/20 border border-blue-500/30'
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Bell className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notif.timestamp).toLocaleString('tr-TR')}
                      </p>
                    </div>
                    {!notif.read && (
                      <div className="w-2.5 h-2.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Bildirim Yok</h3>
                <p className="text-gray-400">Henüz yeni bir bildiriminiz yok.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default NotificationsPage;