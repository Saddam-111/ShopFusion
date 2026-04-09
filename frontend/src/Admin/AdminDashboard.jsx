import React, { useEffect, useState, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MdInventory, MdPeople, MdShoppingCart, MdTrendingUp, MdWarning, MdCheck, MdLocalShipping, MdVisibility } from 'react-icons/md';
import axios from 'axios';

const COLORS = ['#d4af37', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [mostViewed, setMostViewed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timePeriod, setTimePeriod] = useState('weekly');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_SERVER_URL;

      const [statsRes, revenueRes, topProductsRes, recentOrdersRes, lowStockRes, mostViewedRes] = await Promise.all([
        axios.get(`${baseUrl}/api/v1/admin/dashboard/stats`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/v1/admin/dashboard/revenue?period=${timePeriod}`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/v1/admin/dashboard/top-products`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/v1/admin/dashboard/recent-orders`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/v1/admin/dashboard/low-stock?threshold=10`, { withCredentials: true }),
        axios.get(`${baseUrl}/api/v1/admin/dashboard/most-viewed`, { withCredentials: true })
      ]);

      setStats(statsRes.data.stats || statsRes.data);
      setRevenueData(revenueRes.data.revenueData || []);
      setTopProducts(topProductsRes.data.topProducts || []);
      setRecentOrders(recentOrdersRes.data.orders || []);
      setLowStock(lowStockRes.data.products || []);
      setMostViewed(mostViewedRes.data.products || []);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [timePeriod]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      await axios.put(`${baseUrl}/api/v1/admin/order/${orderId}`, 
        { status },
        { withCredentials: true }
      );
      fetchDashboardData();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Shipped': return 'bg-blue-500';
      case 'Processing': return 'bg-yellow-500';
      case 'Cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="w-16 h-16 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] animate-spin rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardData();
            }}
            className="bg-[var(--accent-gold)] text-[var(--bg-primary)] px-4 py-2 rounded hover:bg-[var(--accent-gold)]/80"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8 text-[var(--text-primary)]">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats?.totalRevenue?.toLocaleString()}</p>
              </div>
              <MdTrendingUp className="text-3xl text-green-500" />
            </div>
            <p className="text-green-400 text-sm mt-2">+₹{stats?.todayRevenue?.toLocaleString()} today</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{stats?.totalOrders}</p>
              </div>
              <MdShoppingCart className="text-3xl text-[var(--accent-gold)]" />
            </div>
            <p className="text-[var(--accent-gold)] text-sm mt-2">{stats?.pendingOrders} pending</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Products</p>
                <p className="text-2xl font-bold">{stats?.totalProducts}</p>
              </div>
              <MdInventory className="text-3xl text-purple-500" />
            </div>
            <p className="text-yellow-400 text-sm mt-2">{lowStock.length} low stock</p>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--text-secondary)] text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats?.totalUsers}</p>
              </div>
              <MdPeople className="text-3xl text-orange-500" />
            </div>
            <p className="text-green-400 text-sm mt-2">{stats?.deliveredOrders} delivered</p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-8 border border-[var(--accent-gold)]/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Revenue Overview</h2>
            <select 
              value={timePeriod} 
              onChange={(e) => setTimePeriod(e.target.value)}
              className="bg-[var(--bg-primary)] text-[var(--text-primary)] px-4 py-2 rounded border border-[var(--accent-gold)]/20"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="_id" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Line type="monotone" dataKey="revenue" stroke="#d4af37" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Top Selling Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[var(--bg-primary)] rounded border border-[var(--accent-gold)]/10">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-[var(--accent-gold)]">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">{product.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{product.totalSold} sold</p>
                    </div>
                  </div>
                  <p className="text-green-400 font-bold">₹{product.revenue?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
            <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Recent Orders</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentOrders.map((order) => (
                <div key={order._id} className="p-3 bg-[var(--bg-primary)] rounded border border-[var(--accent-gold)]/10">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{order.user?.name}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-green-400 font-bold">₹{order.totalPrice?.toLocaleString()}</p>
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm px-2 py-1 rounded border border-[var(--accent-gold)]/20"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20">
          <div className="flex items-center gap-2 mb-4">
            <MdWarning className="text-yellow-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Low Stock Alerts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {lowStock.map((product) => (
              <div key={product._id} className="bg-[var(--bg-primary)] p-4 rounded border border-yellow-500/30">
                <p className="font-medium text-[var(--text-primary)]">{product.name}</p>
                <p className="text-sm text-[var(--text-secondary)]">{product.category}</p>
                <p className="text-red-400 font-bold mt-2">Stock: {product.stock}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Most Viewed Products */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--accent-gold)]/20 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <MdVisibility className="text-blue-500" />
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Most Viewed Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mostViewed.slice(0, 8).map((product) => (
              <div key={product._id} className="bg-[var(--bg-primary)] p-4 rounded border border-blue-500/30">
                <div className="flex items-center gap-2">
                  <img 
                    src={product.images?.[0]?.url || '/placeholder.png'} 
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-[var(--text-primary)] text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{product.category}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-green-400 text-sm">₹{product.price?.toLocaleString()}</span>
                  <span className="text-blue-400 text-sm flex items-center gap-1">
                    <MdVisibility /> {product.viewCount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;