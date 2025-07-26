import React from 'react';
import { Calendar } from 'lucide-react';

const CalendarView = ({ tasks }) => {
  return (
    <div className="glass-effect rounded-xl p-6 mt-4">
      <div className="text-center py-12">
        <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Takvim Görünümü</h3>
        <p className="text-gray-400">🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀</p>
      </div>
    </div>
  );
};

export default CalendarView;