import React from 'react';
import { Link } from 'react-router-dom';

const MyProjects = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
        <p>No projects yet.</p>
        <Link to="/customer/projects/create" className="text-blue-600 hover:underline mt-2 inline-block">
          Create your first project
        </Link>
      </div>
    </div>
  );
};

export default MyProjects;