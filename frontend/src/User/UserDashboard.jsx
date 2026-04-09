import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutUser } from '../redux/userSlice';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit2 } from 'react-icons/fi';

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const res = await axios.get(`${baseUrl}/api/v1/orders/user`, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
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

  if (!user) return null;

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <FiShoppingBag /> },
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
  ];

  return (
    <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-art-white">My Account</h1>
          <p className="text-art-silver">Welcome back, {user.name}!</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-art-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-art-gold">{user.name?.charAt(0).toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-semibold text-art-white">{user.name}</h3>
                <p className="text-art-silver text-sm">{user.email}</p>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-art-gold text-art-black font-semibold'
                        : 'text-art-silver hover:bg-art-black hover:text-art-gold'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <FiLogOut />
                  Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                <h2 className="text-xl font-serif font-bold text-art-white mb-6">My Orders</h2>
                
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-10 h-10 border-4 border-art-gold/30 border-t-art-gold animate-spin rounded-full" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="bg-art-black rounded-lg p-4 border border-art-gold/10">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-art-gold font-semibold">Order #{order._id.slice(-8)}</p>
                            <p className="text-art-silver text-sm">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded text-xs text-white ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-art-silver text-sm">
                            {order.orderItems?.length} {order.orderItems?.length === 1 ? 'item' : 'items'}
                          </div>
                          <div className="text-art-gold font-bold">₹{order.totalPrice?.toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FiShoppingBag className="text-5xl text-art-silver mx-auto mb-4" />
                    <p className="text-art-silver mb-4">No orders yet</p>
                    <Link to="/products" className="text-art-gold hover:underline">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                <h2 className="text-xl font-serif font-bold text-art-white mb-6">Profile Information</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-art-gold/10">
                    <span className="text-art-silver">Name</span>
                    <span className="text-art-white">{user.name}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-art-gold/10">
                    <span className="text-art-silver">Email</span>
                    <span className="text-art-white">{user.email}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-art-gold/10">
                    <span className="text-art-silver">Role</span>
                    <span className="text-art-gold capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="text-art-silver">Joined</span>
                    <span className="text-art-white">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;