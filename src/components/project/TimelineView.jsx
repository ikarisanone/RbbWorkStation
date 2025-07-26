import React from 'react';
import { BarChart3 } from 'lucide-react';

const TimelineView = ({ tasks, project }) => {
  return (
    <div className="glass-effect rounded-xl p-6 mt-4">
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Zaman Çizelgesi</h3>
        <p className="text-gray-400">🚧 Bu özellik henüz uygulanmadı—ama merak etme! Bir sonraki istekte talep edebilirsin! 🚀</p>
      </div>
    </div>
  );
};

export default TimelineView;