// src/pages/drone/Earnings.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaCalendar, FaDownload, FaChartLine, FaCheckCircle, FaClock } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Earnings = () => {
  const [period, setPeriod] = useState('all');
  const [earnings, setEarnings] = useState({
    total: 0, pending: 0, paid: 0, thisMonth: 0, lastMonth: 0, averagePerProject: 0, projectsCompleted: 0
  });
  const [transactions, setTransactions] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/contracts`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        
        if (data.success) {
          let total = 0, pending = 0, paid = 0, thisMonth = 0;
          const now = new Date();
          
          const formattedTransactions = data.contracts.map(c => {
            const amount = Number(c.amount);
            const isPaid = c.payment_status === 'paid' || c.status === 'completed';
            
            if (isPaid) {
              paid += amount;
              total += amount;
              const d = new Date(c.created_at);
              if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
                thisMonth += amount;
              }
            } else {
              pending += amount;
            }
            
            return {
              id: c.id, project: c.projectTitle, client: c.otherPartyName,
              amount, date: new Date(c.created_at).toLocaleDateString('hu-HU'),
              status: isPaid ? 'paid' : 'pending', paymentMethod: 'Banki átutalás'
            };
          });
          
          setTransactions(formattedTransactions);
          setEarnings({
            total, pending, paid, thisMonth, lastMonth: 0,
            averagePerProject: total > 0 ? Math.round(total / data.contracts.length) : 0,
            projectsCompleted: data.contracts.filter(c => c.status === 'completed').length
          });

          setMonthlyData([
            { month: 'Jan', amount: 0 }, { month: 'Feb', amount: 0 },
            { month: 'Már', amount: thisMonth }, { month: 'Ápr', amount: 0 },
            { month: 'Máj', amount: 0 }, { month: 'Jún', amount: 0 }
          ]);
        }
      } catch (error) {
        console.error('Hiba a bevételek lekérésekor:', error);
      }
    };
    fetchEarnings();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'paid':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-xs rounded-full flex items-center gap-1"><FaCheckCircle /> Kifizetve</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-xs rounded-full flex items-center gap-1"><FaClock /> Függőben</span>;
      default:
        return null;
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (period === 'all') return true;
    if (period === 'paid') return t.status === 'paid';
    if (period === 'pending') return t.status === 'pending';
    return true;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          {/* Fejléc */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Bevételek
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Itt követheted nyomon a bevételeidet és kifizetéseidet.
            </p>
          </div>

          {/* Összegző */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes bevétel</h3>
                <FaMoneyBillWave className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnings.total} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+12% az előző hónaphoz</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Függőben lévő</h3>
                <FaClock className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnings.pending} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">3 kifizetésre vár</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kifizetve</h3>
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnings.paid} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">5 sikeres kifizetés</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ebben a hónapban</h3>
                <FaChartLine className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{earnings.thisMonth} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">+13.7% az előző hónaphoz</p>
            </div>
          </div>

          {/* Grafikon */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Havi bevételek</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg">6 hónap</button>
                <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg">12 hónap</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {monthlyData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-blue-600 dark:bg-blue-500 rounded-t-lg transition-all duration-300 hover:bg-blue-700"
                    style={{ height: `${(data.amount / 4000) * 200}px` }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{data.month}</span>
                  <span className="text-xs font-medium text-gray-900 dark:text-white">{data.amount} Ft</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tranzakciók */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tranzakciók</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    period === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Összes
                </button>
                <button
                  onClick={() => setPeriod('paid')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    period === 'paid'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Kifizetve
                </button>
                <button
                  onClick={() => setPeriod('pending')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    period === 'pending'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Függőben
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 sm:mb-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{transaction.project}</h3>
                      {getStatusBadge(transaction.status)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{transaction.client}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{transaction.amount} Ft</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{transaction.date}</p>
                    </div>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300">
                      <FaDownload />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Összesítő */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900 dark:text-white">Összesen:</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {filteredTransactions.reduce((sum, t) => sum + t.amount, 0)} Ft
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Earnings;