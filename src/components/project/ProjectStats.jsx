import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, CheckCircle, Clock, Users } from 'lucide-react';

const ProjectStats = ({ tasks, members }) => {
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'progress' || t.status === 'review').length;
  const progress = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  const stats = [
    { title: 'İlerleme', value: `${progress}%`, icon: BarChart3, color: 'from-blue-500 to-blue-600' },
    { title: 'Tamamlanan', value: doneTasks, icon: CheckCircle, color: 'from-green-500 to-green-600' },
    { title: 'Devam Eden', value: inProgressTasks, icon: Clock, color: 'from-yellow-500 to-yellow-600' },
    { title: 'Ekip Üyesi', value: members.length, icon: Users, color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass-effect rounded-xl p-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="text-center">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.title}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProjectStats;