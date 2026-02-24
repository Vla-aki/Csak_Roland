import React from 'react';
import { Link } from 'react-router-dom';

const AvailableProjects = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Available Projects</h1>
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <p>No projects available at the moment.</p>
        <Link to="/drone" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AvailableProjects;