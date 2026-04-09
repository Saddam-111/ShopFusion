import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete, MdLocationOn, MdPerson, MdPayment, MdLocalShipping, MdExpandMore, MdExpandLess, MdShoppingCart, MdPictureAsPdf } from 'react-icons/md';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', search: '', page: 1 });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page);
      params.append('limit', 15);

      const res = await axios.get(`${baseUrl}/api/v1/admin/orders?${params}`, { withCredentials: true });
      setOrders(res.data.orders || []);
    } catch {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      await axios.put(`${baseUrl}/api/v1/admin/order/${orderId}`, { status }, { withCredentials: true });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update order');
    }
  };

  const downloadInvoice = async (orderId) => {
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const response = await axios.get(`${baseUrl}/api/v1/order/${orderId}/invoice`, {
        withCredentials: true,
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const toggleExpand = (orderId) => {
    setExpandedOrders(prev => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Shipped': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'Cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getPaymentMethodBadge = (paymentMethod, status) => {
    if (paymentMethod === 'COD') {
      return { label: 'Cash on Delivery', class: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    }
    return { label: status === 'PAID' ? 'Paid Online' : 'Pending', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Orders Management</h1>

        {/* Filters */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-6 border border-[var(--accent-gold)]/20">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search by order ID, customer name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-[var(--bg-primary)] px-4 py-2 pl-10 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
              className="bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] animate-spin rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Orders Table */}
            <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--accent-gold)]/20">
              <table className="w-full">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Order ID</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Customer</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Products</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Total</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Payment</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Date</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => {
                    const paymentBadge = getPaymentMethodBadge(order.paymentMethod, order.paymentInfo?.status);
                    const isExpanded = expandedOrders[order._id];
                    return (
                      <React.Fragment key={order._id}>
                        <tr className="border-b border-[var(--accent-gold)]/10 hover:bg-[var(--bg-primary)]/50 transition-colors">
                          <td className="px-4 py-3 font-mono text-sm">#{order._id.slice(-8)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center text-[var(--accent-gold)]">
                                {order.user?.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{order.user?.name || 'N/A'}</p>
                                <p className="text-xs text-[var(--text-secondary)]">{order.user?.email || ''}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button 
                              onClick={() => toggleExpand(order._id)}
                              className="flex items-center gap-1 text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80 transition-colors"
                            >
                              {order.orderItems?.length || 0} items
                              {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-green-400 font-bold">₹{order.totalPrice?.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs border ${paymentBadge.class}`}>
                              {paymentBadge.label}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              className="bg-[var(--bg-primary)] text-xs px-2 py-1 rounded border border-[var(--accent-gold)]/20"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => setSelectedOrder(order)}
                              className="text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80 text-sm flex items-center gap-1"
                            >
                              <MdVisibility /> View
                            </button>
                            <button
                              onClick={() => downloadInvoice(order._id)}
                              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 ml-2"
                              title="Download Invoice"
                            >
                              <MdPictureAsPdf />
                            </button>
                          </td>
                        </tr>
                        {/* Expanded Product Details */}
                        {isExpanded && (
                          <tr className="bg-[var(--bg-primary)]/30">
                            <td colSpan={8} className="px-4 py-3">
                              <div className="flex gap-4 overflow-x-auto pb-2">
                                {order.orderItems?.map((item, idx) => (
                                  <div key={idx} className="flex-shrink-0 bg-[var(--bg-secondary)] p-3 rounded-lg border border-[var(--accent-gold)]/10 w-48">
                                    <img 
                                      src={item.image || '/placeholder.png'} 
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded mb-2"
                                    />
                                    <p className="font-medium text-sm truncate">{item.name}</p>
                                    <p className="text-xs text-[var(--text-secondary)]">Qty: {item.quantity} × ₹{item.price}</p>
                                    <p className="text-[var(--accent-gold)] font-bold text-sm">₹{(item.quantity * item.price).toLocaleString()}</p>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {orders.length === 0 && (
              <div className="text-center py-10 text-[var(--text-secondary)]">No orders found</div>
            )}
          </>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-[var(--accent-gold)]/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Order ID</p>
                  <p className="font-mono text-sm">#{selectedOrder._id.slice(-8)}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Date</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Order Status</p>
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Payment</p>
                  <span className={`px-2 py-1 rounded text-xs border ${getPaymentMethodBadge(selectedOrder.paymentMethod, selectedOrder.paymentInfo?.status).class}`}>
                    {getPaymentMethodBadge(selectedOrder.paymentMethod, selectedOrder.paymentInfo?.status).label}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MdPerson className="text-[var(--accent-gold)]" /> Customer Information
                </h3>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center text-[var(--accent-gold)] font-bold text-lg">
                      {selectedOrder.user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{selectedOrder.user?.name}</p>
                      <p className="text-sm text-[var(--text-secondary)]">{selectedOrder.user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MdLocationOn className="text-[var(--accent-gold)]" /> Shipping Address
                </h3>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="font-medium">{selectedOrder.shippingInfo?.address}</p>
                  <p className="text-[var(--text-secondary)]">
                    {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.state}, {selectedOrder.shippingInfo?.country}
                  </p>
                  <p className="text-[var(--text-secondary)]">Pincode: {selectedOrder.shippingInfo?.pincode}</p>
                  <p className="text-[var(--text-secondary)]">Phone: {selectedOrder.shippingInfo?.phoneNo}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <MdShoppingCart className="text-[var(--accent-gold)]" /> Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.orderItems?.map((item, idx) => (
                    <div key={idx} className="bg-[var(--bg-primary)] p-4 rounded-lg flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.image || '/placeholder.png'} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-[var(--text-secondary)]">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                      </div>
                      <p className="text-green-400 font-bold">₹{(item.quantity * item.price).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-[var(--accent-gold)]/20 pt-4">
                <div className="space-y-2 max-w-xs ml-auto">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Item Price</span>
                    <span>₹{selectedOrder.itemPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Tax</span>
                    <span>₹{selectedOrder.taxPrice || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Shipping</span>
                    <span>₹{selectedOrder.shippingPrice || 0}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-[var(--accent-gold)]/20">
                    <span>Total</span>
                    <span className="text-green-400">₹{selectedOrder.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
