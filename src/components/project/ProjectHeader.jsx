import React from 'react';

const ProjectHeader = ({ project }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white">{project.name}</h1>
      <p className="text-gray-400 mt-1">{project.description}</p>
    </div>
  );
};

export default ProjectHeader;