import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
  User,
  Palette,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ScrollArea } from '@/components/ui/scroll-area';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { notifications, markNotificationAsRead } = useData();
  const { setTheme } = useTheme();

  const unreadNotifications = notifications.filter(n => !n.isRead);

  const handleNotificationClick = (notification) => {
    markNotificationAsRead(notification.id);
    navigate(notification.link);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="header-gradient h-16 px-6 flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications.length > 0 && <span className="notification-dot"></span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Bildirimler</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-72">
            {notifications.length > 0 ? (
                notifications.map(n => (
                    <DropdownMenuItem key={n.id} onClick={() => handleNotificationClick(n)} className={`cursor-pointer ${!n.isRead ? 'font-bold' : ''}`}>
                        <div className="flex flex-col">
                            <p className="text-sm">{n.title}</p>
                            <p className="text-xs text-muted-foreground">{n.description}</p>
                        </div>
                    </DropdownMenuItem>
                ))
            ) : (
                <DropdownMenuItem disabled>Bildirim yok</DropdownMenuItem>
            )}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.name?.charAt(0)}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.email}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profil')}>
              <User className="w-4 h-4 mr-2" />
              <span>Profil</span>
            </DropdownMenuItem>
            
            <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <Palette className="w-4 h-4 mr-2" />
                    <span>Tema</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme('light')}>
                        <Sun className="mr-2 h-4 w-4" />
                        <span>Açık</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme('dark')}>
                        <Moon className="mr-2 h-4 w-4" />
                        <span>Koyu</span>
                    </DropdownMenuItem>
                </DropdownMenuSubContent>
            </DropdownMenuSub>

             <DropdownMenuItem onClick={() => navigate('/profil')}>
                <Settings className="w-4 h-4 mr-2" />
                <span>Ayarlar</span>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-400 focus:text-red-300 focus:bg-red-500/10">
              <LogOut className="w-4 h-4 mr-2" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  );
};

export default Header;