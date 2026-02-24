import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
        <Link to="/customer/projects/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Post New Project
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Active Projects</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Bids</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Completed</p>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <p className="text-gray-500 text-center py-8">No projects yet. Click "Post New Project" to get started!</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;