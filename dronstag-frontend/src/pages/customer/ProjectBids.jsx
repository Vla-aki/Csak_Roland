import React from 'react';
import { useParams } from 'react-router-dom';

const ProjectBids = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Project Bids #{id}</h1>
      <p>Bids list coming soon...</p>
    </div>
  );
};

export default ProjectBids;