import React from 'react';
import { motion } from 'framer-motion';

const ProjectTeam = ({ project, users }) => {
  const getProjectManager = (managerId) => users.find(user => user.id === managerId);
  const getProjectMembers = (memberIds) => memberIds.map(id => users.find(user => user.id === id)).filter(Boolean);

  const manager = getProjectManager(project.manager_id);
  const members = getProjectMembers(project.members);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-effect rounded-xl p-6"
    >
      <h2 className="text-xl font-bold text-white mb-6">Proje Ekibi</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {manager && (
          <div className="bg-white/5 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{manager.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-white">{manager.name}</p>
                <p className="text-sm text-gray-400">{manager.title}</p>
                <span className="role-badge role-admin">Proje Yöneticisi</span>
              </div>
            </div>
          </div>
        )}
        {members.map(member => (
          <div key={member.id} className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">{member.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-medium text-white">{member.name}</p>
                <p className="text-sm text-gray-400">{member.title}</p>
                <span className={`role-badge role-${member.role?.replace('_', '-')}`}>
                  {member.role === 'admin' ? 'Yönetici' : 'Ekip Üyesi'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectTeam;