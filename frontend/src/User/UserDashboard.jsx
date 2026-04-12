import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutUser, loadUser } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { FiUser, FiShoppingBag, FiHeart, FiSettings, FiLogOut, FiEdit2, FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiPhone, FiMail, FiChevronRight, FiSearch, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  // Edit Profile State
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
  
  // Change Password State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
    setProfileForm({ name: user?.name || '', email: user?.email || '' });
  }, [isAuthenticated, navigate, user]);

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

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!profileForm.name || !profileForm.email) {
      toast.error('Please fill all fields');
      return;
    }
    setProfileLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const res = await axios.post(`${baseUrl}/api/v1/profile/update`, profileForm, { withCredentials: true });
      if (res.data.success) {
        toast.success('Profile updated successfully');
        dispatch(loadUser());
        setIsEditing(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  // Password Change Handler
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Please fill all fields');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPasswordLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const res = await axios.post(`${baseUrl}/api/v1/password/update`, 
        { oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success('Password changed successfully');
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500 text-green-100';
      case 'Shipped': return 'bg-blue-500 text-blue-100';
      case 'Processing': return 'bg-yellow-500 text-yellow-100';
      case 'Cancelled': return 'bg-red-500 text-red-100';
      default: return 'bg-gray-500 text-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FiCheckCircle />;
      case 'Shipped': return <FiTruck />;
      case 'Processing': return <FiClock />;
      case 'Cancelled': return <FiXCircle />;
      default: return <FiPackage />;
    }
  };

  if (!user) return null;

  const tabs = [
    { id: 'orders', label: 'My Orders', icon: <FiShoppingBag /> },
    { id: 'profile', label: 'My Profile', icon: <FiUser /> },
    { id: 'settings', label: 'Settings', icon: <FiSettings /> },
  ];

  return (
    <div className="min-h-screen bg-art-black text-art-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              onClick={() => navigate('/')} 
              className="flex items-center gap-2 text-art-silver hover:text-art-gold transition-colors mb-2"
            >
              <FiArrowLeft />
              <span>Back to Home</span>
            </button>
            <h1 className="text-3xl font-serif font-bold text-art-white">My Account</h1>
            <p className="text-art-silver">Welcome back, <span className="text-art-gold">{user.name}</span>!</p>
          </div>
          <Link 
            to="/products" 
            className="hidden md:flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all"
          >
            <FiShoppingBag />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Enhanced Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20 sticky top-24">
              {/* Profile Card */}
              <div className="text-center mb-6 pb-6 border-b border-art-gold/10">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-art-gold/30 to-art-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-art-gold/30">
                    <span className="text-4xl font-bold text-art-gold">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-art-charcoal flex items-center justify-center">
                    <FiCheckCircle className="text-white text-xs" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-art-white">{user.name}</h3>
                <p className="text-art-silver text-sm">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-art-gold/10 text-art-gold text-xs rounded-full capitalize">
                  {user.role} Account
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-art-black/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-art-gold">{orders.length}</p>
                  <p className="text-art-silver text-xs">Orders</p>
                </div>
                <div className="bg-art-black/50 rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold text-art-gold">
                    {orders.filter(o => o.orderStatus === 'Delivered').length}
                  </p>
                  <p className="text-art-silver text-xs">Delivered</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-art-gold/20 to-transparent text-art-gold border-l-2 border-art-gold'
                        : 'text-art-silver hover:bg-art-black hover:text-art-gold border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {tab.icon}
                      {tab.label}
                    </div>
                    <FiChevronRight className={`transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
                <Link 
                  to="/cart" 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-art-silver hover:bg-art-black hover:text-art-gold transition-colors"
                >
                  <FiHeart />
                  My Wishlist
                </Link>
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
              <div className="space-y-4">
                {/* Search & Filter Bar */}
                <div className="bg-art-charcoal rounded-xl p-4 border border-art-gold/20">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-art-silver" />
                      <input 
                        type="text" 
                        placeholder="Search orders..." 
                        className="w-full bg-art-black border border-art-gold/20 rounded-lg pl-10 pr-4 py-3 text-art-white focus:border-art-gold focus:outline-none"
                      />
                    </div>
                    <select className="bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 text-art-white focus:border-art-gold focus:outline-none">
                      <option value="">All Status</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Orders List */}
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="w-12 h-12 border-4 border-art-gold/30 border-t-art-gold animate-spin rounded-full" />
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div 
                        key={order._id} 
                        className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20 hover:border-art-gold/40 transition-all cursor-pointer"
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          {/* Order Info */}
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`p-2 rounded-lg ${getStatusColor(order.orderStatus)}`}>
                                {getStatusIcon(order.orderStatus)}
                              </div>
                              <div>
                                <p className="text-art-gold font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                                <p className="text-art-silver text-sm flex items-center gap-2">
                                  <FiClock />
                                  {new Date(order.createdAt).toLocaleDateString('en-IN', { 
                                    day: 'numeric', 
                                    month: 'long', 
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-3 text-sm text-art-silver">
                              <span className="flex items-center gap-1">
                                <FiPackage />
                                {order.orderItems?.length} {order.orderItems?.length === 1 ? 'item' : 'items'}
                              </span>
                              <span className="w-1 h-1 bg-art-silver rounded-full"></span>
                              <span>₹{order.totalPrice?.toLocaleString('en-IN')}</span>
                            </div>
                          </div>

                          {/* Status & Action */}
                          <div className="flex items-center gap-4">
                            <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>
                            <FiChevronRight className={`text-art-silver transition-transform ${selectedOrder === order._id ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {/* Expanded Order Details */}
                        {selectedOrder === order._id && (
                          <div className="mt-6 pt-6 border-t border-art-gold/10">
                            {/* Order Items */}
                            <div className="space-y-3 mb-6">
                              {order.orderItems?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-art-black/50 rounded-lg p-3">
                                  <div className="w-16 h-16 bg-art-gold/10 rounded-lg flex items-center justify-center overflow-hidden">
                                    {item.image ? (
                                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                      <FiPackage className="text-art-gold text-2xl" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-art-white font-medium">{item.name}</p>
                                    <p className="text-art-silver text-sm">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                                  </div>
                                  <p className="text-art-gold font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>

                            {/* Order Summary */}
                            <div className="bg-art-black/30 rounded-lg p-4">
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-art-silver">Subtotal</span>
                                <span className="text-art-white">₹{order.itemPrice?.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-art-silver">Shipping</span>
                                <span className="text-art-white">₹{order.shippingPrice || 0}</span>
                              </div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-art-silver">Tax</span>
                                <span className="text-art-white">₹{order.taxPrice || 0}</span>
                              </div>
                              <div className="flex justify-between text-lg font-bold border-t border-art-gold/10 pt-2 mt-2">
                                <span className="text-art-white">Total</span>
                                <span className="text-art-gold">₹{order.totalPrice?.toLocaleString()}</span>
                              </div>
                            </div>

                            {/* Shipping Info */}
                            {order.shippingInfo && (
                              <div className="mt-4 p-4 bg-art-gold/5 rounded-lg border border-art-gold/10">
                                <p className="text-art-gold font-medium mb-2 flex items-center gap-2">
                                  <FiMapPin />
                                  Shipping Address
                                </p>
                                <p className="text-art-silver text-sm">
                                  {order.shippingInfo.address}<br />
                                  {order.shippingInfo.city}, {order.shippingInfo.state} - {order.shippingInfo.pincode}<br />
                                  {order.shippingInfo.country}<br />
                                  Phone: {order.shippingInfo.phoneNo}
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-3 mt-4">
                              <button className="flex-1 py-3 bg-art-gold/10 text-art-gold rounded-lg hover:bg-art-gold/20 transition-colors font-medium">
                                Track Order
                              </button>
                              <button className="flex-1 py-3 bg-art-gold text-art-black rounded-lg hover:bg-art-gold-dark transition-colors font-medium">
                                Buy Again
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-art-charcoal rounded-xl p-12 border border-art-gold/20 text-center">
                    <div className="w-24 h-24 bg-art-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiShoppingBag className="text-5xl text-art-gold" />
                    </div>
                    <h3 className="text-xl font-semibold text-art-white mb-2">No orders yet</h3>
                    <p className="text-art-silver mb-6">Start shopping to see your orders here</p>
                    <Link 
                      to="/products" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-art-gold to-art-gold-dark text-art-black font-semibold rounded-lg hover:shadow-lg hover:shadow-art-gold/30 transition-all"
                    >
                      <FiShoppingBag />
                      Browse Products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Header Card */}
                <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-art-white">Profile Information</h2>
                    <button className="flex items-center gap-2 px-4 py-2 bg-art-gold/10 text-art-gold rounded-lg hover:bg-art-gold/20 transition-colors">
                      <FiEdit2 />
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiUser className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Full Name</p>
                          <p className="text-art-white font-medium">{user.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiMail className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Email Address</p>
                          <p className="text-art-white font-medium">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiUser className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Account Type</p>
                          <p className="text-art-gold font-medium capitalize">{user.role}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiClock className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Member Since</p>
                          <p className="text-art-white font-medium">
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric' 
                            }) : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                          <FiCheckCircle className="text-green-500 text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Account Status</p>
                          <p className="text-green-500 font-medium flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            Active
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                  <h2 className="text-xl font-serif font-bold text-art-white mb-6">Quick Actions</h2>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Link 
                      to="/cart" 
                      className="p-4 bg-art-black/50 rounded-lg border border-art-gold/10 hover:border-art-gold/30 transition-all group"
                    >
                      <FiHeart className="text-2xl text-art-gold mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-art-white font-medium">My Wishlist</p>
                      <p className="text-art-silver text-sm">View saved items</p>
                    </Link>
                    
                    <Link 
                      to="/products" 
                      className="p-4 bg-art-black/50 rounded-lg border border-art-gold/10 hover:border-art-gold/30 transition-all group"
                    >
                      <FiShoppingBag className="text-2xl text-art-gold mb-2 group-hover:scale-110 transition-transform" />
                      <p className="text-art-white font-medium">Shop Now</p>
                      <p className="text-art-silver text-sm">Browse products</p>
                    </Link>

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Edit Profile Section */}
                <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-art-white flex items-center gap-2">
                      <FiEdit2 />
                      Edit Profile
                    </h2>
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2 px-4 py-2 bg-art-gold/10 text-art-gold rounded-lg hover:bg-art-gold/20 transition-colors"
                    >
                      {isEditing ? 'Cancel' : <><FiEdit2 /> Edit</>}
                    </button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-art-silver text-sm mb-2">Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          className="w-full bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 text-art-white focus:border-art-gold focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-art-silver text-sm mb-2">Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          className="w-full bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 text-art-white focus:border-art-gold focus:outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={profileLoading}
                        className="w-full py-3 bg-art-gold text-art-black rounded-lg hover:bg-art-gold-dark transition-colors font-medium disabled:opacity-50"
                      >
                        {profileLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </form>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiUser className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Name</p>
                          <p className="text-art-white font-medium">{user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                        <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                          <FiMail className="text-art-gold text-xl" />
                        </div>
                        <div>
                          <p className="text-art-silver text-sm">Email</p>
                          <p className="text-art-white font-medium">{user?.email}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Change Password Section */}
                <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-serif font-bold text-art-white flex items-center gap-2">
                      <FiLock />
                      Change Password
                    </h2>
                    <button 
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="flex items-center gap-2 px-4 py-2 bg-art-gold/10 text-art-gold rounded-lg hover:bg-art-gold/20 transition-colors"
                    >
                      {isChangingPassword ? 'Cancel' : <><FiLock /> Change</>}
                    </button>
                  </div>
                  
                  {isChangingPassword ? (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <label className="block text-art-silver text-sm mb-2">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.old ? 'text' : 'password'}
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            className="w-full bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 pr-12 text-art-white focus:border-art-gold focus:outline-none"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-art-silver hover:text-art-gold"
                          >
                            {showPasswords.old ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-art-silver text-sm mb-2">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 pr-12 text-art-white focus:border-art-gold focus:outline-none"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-art-silver hover:text-art-gold"
                          >
                            {showPasswords.new ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-art-silver text-sm mb-2">Confirm New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            className="w-full bg-art-black border border-art-gold/20 rounded-lg px-4 py-3 pr-12 text-art-white focus:border-art-gold focus:outline-none"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-art-silver hover:text-art-gold"
                          >
                            {showPasswords.confirm ? <FiEyeOff /> : <FiEye />}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="w-full py-3 bg-art-gold text-art-black rounded-lg hover:bg-art-gold-dark transition-colors font-medium disabled:opacity-50"
                      >
                        {passwordLoading ? 'Changing...' : 'Change Password'}
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center gap-4 p-4 bg-art-black/50 rounded-lg">
                      <div className="w-12 h-12 bg-art-gold/10 rounded-lg flex items-center justify-center">
                        <FiLock className="text-art-gold text-xl" />
                      </div>
                      <div>
                        <p className="text-art-white font-medium">Password</p>
                        <p className="text-art-silver text-sm">••••••••</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="bg-art-charcoal rounded-xl p-6 border border-art-gold/20">
                  <h2 className="text-xl font-serif font-bold text-art-white mb-6">Account Information</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between py-3 border-b border-art-gold/10">
                      <span className="text-art-silver">Account Type</span>
                      <span className="text-art-gold capitalize">{user?.role}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-art-gold/10">
                      <span className="text-art-silver">Member Since</span>
                      <span className="text-art-white">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        }) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between py-3">
                      <span className="text-art-silver">Status</span>
                      <span className="text-green-500 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                        Active
                      </span>
                    </div>
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
