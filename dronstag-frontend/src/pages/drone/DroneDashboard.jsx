import React from 'react';
import { Link } from 'react-router-dom';

const DroneDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Drone Operator Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Active Bids</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Active Contracts</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Completed Jobs</p>
          <p className="text-3xl font-bold">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Total Earnings</p>
          <p className="text-3xl font-bold">$0</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <Link to="/drone/projects" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 mb-3">
            <h3 className="font-semibold">Browse Available Projects</h3>
            <p className="text-sm text-gray-600">Find new drone jobs</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DroneDashboard;