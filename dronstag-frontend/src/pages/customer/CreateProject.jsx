import React from 'react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Project</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-center text-gray-500 py-8">
          Project creation form coming soon!
        </p>
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/customer')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;