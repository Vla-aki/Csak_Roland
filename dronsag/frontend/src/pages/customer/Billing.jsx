import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaDownload, FaChartBar, FaCheckCircle, FaClock, FaFileInvoiceDollar } from 'react-icons/fa';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';

const Billing = () => {
  const [period, setPeriod] = useState('all');
  const [billingStats, setBillingStats] = useState({
    total: 0, pending: 0, paid: 0, thisMonth: 0, lastMonth: 0, pendingCount: 0, paidCount: 0, monthPercent: '0%'
  });
  const [transactions, setTransactions] = useState([]);
  const [allMonthlyData, setAllMonthlyData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/contracts`, { headers: { 'Authorization': `Bearer ${token}` } });
        const data = await res.json();
        
        if (data.success) {
          const monthNames = ['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec'];
          const now = new Date();
          const last12Months = [];
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            last12Months.push({ month: monthNames[d.getMonth()], year: d.getFullYear(), monthNum: d.getMonth(), amount: 0 });
          }

          let total = 0, pending = 0, paid = 0;
          let thisMonth = 0, lastMonth = 0;
          let pendingCount = 0, paidCount = 0;

          const currentMonth = now.getMonth();
          const currentYear = now.getFullYear();
          const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const lastMonthNum = lastMonthDate.getMonth();
          const lastMonthYear = lastMonthDate.getFullYear();
          
          const formattedTransactions = data.contracts.map(c => {
            const amount = Number(c.amount);
            const isPaid = c.payment_status === 'paid' || c.status === 'completed';
            const date = new Date(c.completed_at || c.created_at);
            
            if (isPaid) {
              paid += amount;
              total += amount;
              paidCount++;
              
              if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                thisMonth += amount;
              } else if (date.getMonth() === lastMonthNum && date.getFullYear() === lastMonthYear) {
                lastMonth += amount;
              }

              const chartItem = last12Months.find(m => m.monthNum === date.getMonth() && m.year === date.getFullYear());
              if (chartItem) chartItem.amount += amount;
            } else {
              pending += amount;
              pendingCount++;
            }
            
            return {
              id: c.id, project: c.projectTitle, pilot: c.otherPartyName,
              amount, date: date.toLocaleDateString('hu-HU'),
              status: isPaid ? 'paid' : 'pending'
            };
          });
          
          const calcPercent = (curr, prev) => {
            if (prev === 0) return curr > 0 ? '+100%' : '0%';
            const diff = ((curr - prev) / prev) * 100;
            return (diff > 0 ? '+' : '') + diff.toFixed(1) + '%';
          };

          setTransactions(formattedTransactions);
          setBillingStats({
            total, pending, paid, thisMonth, lastMonth,
            pendingCount, paidCount, monthPercent: calcPercent(thisMonth, lastMonth)
          });
          setAllMonthlyData(last12Months);
        }
      } catch (error) {
        console.error('Hiba a kiadások lekérésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const displayedMonthlyData = allMonthlyData.slice(-chartPeriod);
  const filteredTransactions = transactions.filter(t => period === 'all' || t.status === period);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-700 flex flex-col">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 flex-1">
        <div className="container mx-auto max-w-7xl">
          
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-all duration-700">
              Kiadások és Számlázás
            </h1>
            <p className="text-gray-600 dark:text-gray-400 transition-all duration-700">
              Itt követheted nyomon az elköltött összegeket és a letétben lévő fizetéseket.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Összes kiadás</h3>
                <FaFileInvoiceDollar className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{billingStats.total.toLocaleString('hu-HU')} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Teljes kifizetett összeg</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Függőben (Letét)</h3>
                <FaClock className="text-yellow-600 dark:text-yellow-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{billingStats.pending.toLocaleString('hu-HU')} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{billingStats.pendingCount} aktív projekt letétje</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kifizetve</h3>
                <FaCheckCircle className="text-green-600 dark:text-green-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{billingStats.paid.toLocaleString('hu-HU')} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{billingStats.paidCount} sikeres kifizetés</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ebben a hónapban</h3>
                <FaChartBar className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{billingStats.thisMonth.toLocaleString('hu-HU')} Ft</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{billingStats.monthPercent} az előző hónaphoz</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8 transition-all duration-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Havi kiadások</h2>
              <div className="flex gap-2">
                <button onClick={() => setChartPeriod(6)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${chartPeriod === 6 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>6 hónap</button>
                <button onClick={() => setChartPeriod(12)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${chartPeriod === 12 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>12 hónap</button>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {displayedMonthlyData.map((data, index) => {
                const maxAmount = Math.max(...displayedMonthlyData.map(d => d.amount), 10000);
                const heightPx = Math.max((data.amount / maxAmount) * 200, 4);
                return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full bg-blue-600 dark:bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-700" style={{ height: `${heightPx}px` }} title={`${data.amount.toLocaleString('hu-HU')} Ft`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{data.month}</span>
                  <span className="text-[10px] sm:text-xs font-medium text-gray-900 dark:text-white">{data.amount > 0 ? (data.amount > 999999 ? (data.amount/1000000).toFixed(1)+'M' : (data.amount/1000).toFixed(0)+'k') : '0'}</span>
                </div>
              )})}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 transition-all duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Tranzakciók története</h2>
              <div className="flex gap-2">
                <button onClick={() => setPeriod('all')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Összes</button>
                <button onClick={() => setPeriod('paid')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'paid' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Kifizetve</button>
                <button onClick={() => setPeriod('pending')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>Függőben</button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredTransactions.map((t) => (
                <div key={t.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{t.project}</h3>
                      {t.status === 'paid' ? <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 text-[10px] rounded-full uppercase font-bold">Kifizetve</span> : <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400 text-[10px] rounded-full uppercase font-bold">Letétben</span>}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pilóta: {t.pilot}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900 dark:text-white">{t.amount.toLocaleString('hu-HU')} Ft</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t.date}</p>
                    </div>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"><FaDownload /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Billing;