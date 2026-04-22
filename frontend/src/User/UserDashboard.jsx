import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { logoutUser, loadUser } from '../redux/userSlice';
import { toast } from 'react-toastify';
import { FiUser, FiShoppingBag, FiSettings, FiLogOut, FiEdit2, FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiMail, FiChevronRight, FiLock, FiEye, FiEyeOff, FiCreditCard, FiTrash2 } from 'react-icons/fi';

const UserDashboard = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', email: '' });
  const [profileLoading, setProfileLoading] = useState(false);
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

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const res = await axios.delete(`${baseUrl}/api/v1/admin/order/${orderId}`, { withCredentials: true });
      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

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
    <div className="min-h-screen bg-cream text-forest pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-forest/60 hover:text-forest transition-colors mb-2">
              <FiArrowLeft />
              <span>Back to Home</span>
            </button>
            <h1 className="text-3xl font-display text-forest">My Account</h1>
            <p className="text-forest/60">Welcome back, <span className="text-forest">{user.name}</span>!</p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 px-6 py-3 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all">
            <FiShoppingBag />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-corners-lg p-6 border border-forest/10 sticky top-24">
              <div className="text-center mb-6 pb-6 border-b border-forest/10">
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl font-display text-forest">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-forest">{user.name}</h3>
                <p className="text-forest/60 text-sm">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-forest/10 text-forest text-xs rounded-full capitalize">{user.role}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-olive rounded-lg p-3 text-center">
                  <p className="text-2xl font-display text-forest">{orders.length}</p>
                  <p className="text-forest/60 text-xs">Orders</p>
                </div>
                <div className="bg-olive rounded-lg p-3 text-center">
                  <p className="text-2xl font-display text-forest">{orders.filter(o => o.orderStatus === 'Delivered').length}</p>
                  <p className="text-forest/60 text-xs">Delivered</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                      activeTab === tab.id ? 'bg-forest text-cream' : 'text-forest hover:bg-olive'
                    }`}
                  >
                    <div className="flex items-center gap-3">{tab.icon}{tab.label}</div>
                    <FiChevronRight className={`transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
                  </button>
                ))}
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors">
                  <FiLogOut />Logout
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <OrdersTab 
                orders={orders} 
                loading={loading} 
                selectedOrder={selectedOrder} 
                setSelectedOrder={setSelectedOrder} 
                getStatusColor={getStatusColor} 
                getStatusIcon={getStatusIcon}
                handleCancelOrder={handleCancelOrder}
              />
            )}
            {activeTab === 'profile' && <ProfileTab user={user} />}
            {activeTab === 'settings' && (
              <SettingsTab
                user={user}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                profileForm={profileForm}
                setProfileForm={setProfileForm}
                profileLoading={profileLoading}
                handleProfileUpdate={handleProfileUpdate}
                isChangingPassword={isChangingPassword}
                setIsChangingPassword={setIsChangingPassword}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                passwordLoading={passwordLoading}
                handlePasswordChange={handlePasswordChange}
                showPasswords={showPasswords}
                setShowPasswords={setShowPasswords}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersTab = ({ orders, loading, selectedOrder, setSelectedOrder, getStatusColor, getStatusIcon, handleCancelOrder }) => {
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-forest/30 border-t-forest animate-spin rounded-full" /></div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-corners-lg p-12 border border-forest/10 text-center">
        <FiShoppingBag className="text-5xl text-forest mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-forest mb-2">No orders yet</h3>
        <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-cream font-semibold rounded-corners-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="bg-white rounded-corners-lg p-6 border border-forest/10 hover:border-forest/30 transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${getStatusColor(order.orderStatus)}`}>{getStatusIcon(order.orderStatus)}</div>
                <div>
                  <p className="text-forest font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-forest/60 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-sm text-forest/60">
                <span className="flex items-center gap-1"><FiPackage />{order.orderItems?.length} items</span>
                <span className="w-1 h-1 bg-forest/30 rounded-full"></span>
                <span className="text-forest font-semibold">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>{getStatusIcon(order.orderStatus)}{order.orderStatus}</span>
              <FiChevronRight className={`text-forest/50 transition-transform ${selectedOrder === order._id ? 'rotate-90' : ''}`} />
            </div>
          </div>

          {selectedOrder === order._id && (
            <div className="mt-6 pt-6 border-t border-forest/10">
              <h4 className="text-forest font-semibold mb-4 flex items-center gap-2"><FiPackage /> Order Items</h4>
              <div className="space-y-3 mb-6">
                {order.orderItems?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-olive rounded-lg p-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.product}`); }}>
                    <div className="w-16 h-16 bg-forest/10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {item.image ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" /> : <FiPackage className="text-forest text-2xl" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-forest font-medium truncate">{item.name}</p>
                      <p className="text-forest/60 text-sm">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                    </div>
                    <p className="text-forest font-semibold flex-shrink-0">₹{((item.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-olive rounded-lg">
                  <h4 className="text-forest font-semibold mb-3 flex items-center gap-2"><FiCreditCard /> Payment Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest/60">Method</span>
                      <span className="text-forest font-medium flex items-center gap-2">
                        {order.paymentMethod === 'COD' ? <><FiCreditCard className="text-green-500" /> Cash on Delivery</> : <><FiCreditCard className="text-blue-500" /> Online Payment</>}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest/60">Status</span>
                      <span className={order.paymentInfo?.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>{order.paymentInfo?.status || 'PENDING'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-olive rounded-lg">
                  <h4 className="text-forest font-semibold mb-3 flex items-center gap-2"><FiMapPin /> Shipping Address</h4>
                  <div className="text-sm text-forest">
                    <p>{order.shippingInfo?.address}</p>
                    <p>{order.shippingInfo?.city}, {order.shippingInfo?.state}</p>
                    <p>{order.shippingInfo?.country} - {order.shippingInfo?.pincode}</p>
                    <p className="mt-2 text-forest/60">Phone: {order.shippingInfo?.phoneNo}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={(e) => { e.stopPropagation(); navigate(`/product/${order.orderItems?.[0]?.product}`); }} className="flex-1 py-3 bg-forest/10 text-forest rounded-lg hover:bg-forest/20 transition-colors font-medium">
                  View Product
                </button>
                {order.orderStatus === 'Processing' && order.paymentMethod === 'COD' && (
                  <button onClick={(e) => { e.stopPropagation(); handleCancelOrder(order._id); }} className="flex-1 py-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors font-medium flex items-center justify-center gap-2">
                    <FiTrash2 /> Cancel Order
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ProfileTab = ({ user }) => (
  <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
    <h2 className="text-xl font-display text-forest mb-6">Profile Information</h2>
    <div className="grid md:grid-cols-2 gap-6">
      <div className="flex items-center gap-4 p-4 bg-olive rounded-lg">
        <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiUser className="text-forest text-xl" /></div>
        <div><p className="text-forest/60 text-sm">Name</p><p className="text-forest font-medium">{user.name}</p></div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-olive rounded-lg">
        <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiMail className="text-forest text-xl" /></div>
        <div><p className="text-forest/60 text-sm">Email</p><p className="text-forest font-medium">{user.email}</p></div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-olive rounded-lg">
        <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiUser className="text-forest text-xl" /></div>
        <div><p className="text-forest/60 text-sm">Account Type</p><p className="text-forest font-medium capitalize">{user.role}</p></div>
      </div>
      <div className="flex items-center gap-4 p-4 bg-olive rounded-lg">
        <div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiClock className="text-forest text-xl" /></div>
        <div><p className="text-forest/60 text-sm">Member Since</p><p className="text-forest font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A'}</p></div>
      </div>
    </div>
  </div>
);

const SettingsTab = ({ user, isEditing, setIsEditing, profileForm, setProfileForm, profileLoading, handleProfileUpdate, isChangingPassword, setIsChangingPassword, passwordForm, setPasswordForm, passwordLoading, handlePasswordChange, showPasswords, setShowPasswords }) => (
  <div className="space-y-6">
    <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-forest flex items-center gap-2"><FiEdit2 />Edit Profile</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="flex items-center gap-2 px-4 py-2 bg-forest/10 text-forest rounded-lg hover:bg-forest/20 transition-colors text-sm font-semibold">{isEditing ? 'Cancel' : 'Edit'}</button>
      </div>
      {isEditing ? (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div><label className="block text-forest/60 text-sm mb-2">Name</label><input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none" /></div>
          <div><label className="block text-forest/60 text-sm mb-2">Email</label><input type="email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 text-forest focus:border-forest focus:outline-none" /></div>
          <button type="submit" disabled={profileLoading} className="w-full py-3 bg-forest text-cream rounded-lg hover:opacity-90 transition-colors font-semibold disabled:opacity-50">{profileLoading ? 'Saving...' : 'Save Changes'}</button>
        </form>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 p-4 bg-olive rounded-lg"><div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiUser className="text-forest text-xl" /></div><div><p className="text-forest/60 text-sm">Name</p><p className="text-forest font-medium">{user?.name}</p></div></div>
          <div className="flex items-center gap-4 p-4 bg-olive rounded-lg"><div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiMail className="text-forest text-xl" /></div><div><p className="text-forest/60 text-sm">Email</p><p className="text-forest font-medium">{user?.email}</p></div></div>
        </div>
      )}
    </div>

    <div className="bg-white rounded-corners-lg p-6 border border-forest/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display text-forest flex items-center gap-2"><FiLock />Change Password</h2>
        <button onClick={() => setIsChangingPassword(!isChangingPassword)} className="flex items-center gap-2 px-4 py-2 bg-forest/10 text-forest rounded-lg hover:bg-forest/20 transition-colors text-sm font-semibold">{isChangingPassword ? 'Cancel' : 'Change'}</button>
      </div>
      {isChangingPassword ? (
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div><label className="block text-forest/60 text-sm mb-2">Current Password</label><div className="relative"><input type={showPasswords.old ? 'text' : 'password'} value={passwordForm.oldPassword} onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 pr-12 text-forest focus:border-forest focus:outline-none" /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest">{showPasswords.old ? <FiEyeOff /> : <FiEye />}</button></div></div>
          <div><label className="block text-forest/60 text-sm mb-2">New Password</label><div className="relative"><input type={showPasswords.new ? 'text' : 'password'} value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 pr-12 text-forest focus:border-forest focus:outline-none" /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest">{showPasswords.new ? <FiEyeOff /> : <FiEye />}</button></div></div>
          <div><label className="block text-forest/60 text-sm mb-2">Confirm New Password</label><div className="relative"><input type={showPasswords.confirm ? 'text' : 'password'} value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} className="w-full bg-cream border border-forest/20 rounded-lg px-4 py-3 pr-12 text-forest focus:border-forest focus:outline-none" /><button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest/50 hover:text-forest">{showPasswords.confirm ? <FiEyeOff /> : <FiEye />}</button></div></div>
          <button type="submit" disabled={passwordLoading} className="w-full py-3 bg-forest text-cream rounded-lg hover:opacity-90 transition-colors font-semibold disabled:opacity-50">{passwordLoading ? 'Changing...' : 'Change Password'}</button>
        </form>
      ) : (
        <div className="flex items-center gap-4 p-4 bg-olive rounded-lg"><div className="w-12 h-12 bg-forest/10 rounded-lg flex items-center justify-center"><FiLock className="text-forest text-xl" /></div><div><p className="text-forest font-medium">Password</p><p className="text-forest/60 text-sm">••••••••</p></div></div>
      )}
    </div>
  </div>
);

export default UserDashboard;