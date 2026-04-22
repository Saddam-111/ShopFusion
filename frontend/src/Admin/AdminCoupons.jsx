import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiCalendar, FiPercent, FiDollarSign, FiTruck, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon, clearAdminCouponState } from "../redux/adminCouponSlice";

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, loading, error, success } = useSelector((state) => state.adminCoupon);
  
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minCartValue: "",
    maxDiscount: "",
    expiryDate: "",
    usageLimit: "",
    userUsageLimit: 1,
    allowMultiple: false
  });

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        dispatch(clearAdminCouponState());
      }, 3000);
    }
  }, [success, dispatch]);

  const handleOpenModal = (coupon = null) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minCartValue: coupon.minCartValue || "",
        maxDiscount: coupon.maxDiscount || "",
        expiryDate: coupon.expiryDate ? coupon.expiryDate.split("T")[0] : "",
        usageLimit: coupon.usageLimit || "",
        userUsageLimit: coupon.userUsageLimit || 1,
        allowMultiple: coupon.allowMultiple || false
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minCartValue: "",
        maxDiscount: "",
        expiryDate: "",
        usageLimit: "",
        userUsageLimit: 1,
        allowMultiple: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const couponData = {
      ...formData,
      discountValue: Number(formData.discountValue),
      minCartValue: formData.minCartValue ? Number(formData.minCartValue) : 0,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      expiryDate: formData.expiryDate,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : null,
      userUsageLimit: Number(formData.userUsageLimit)
    };

    if (editingCoupon) {
      dispatch(updateCoupon({ id: editingCoupon._id, couponData }));
    } else {
      dispatch(createCoupon(couponData));
    }
    
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      dispatch(deleteCoupon(id));
    }
  };

  const handleToggleActive = (coupon) => {
    dispatch(updateCoupon({ 
      id: coupon._id, 
      couponData: { isActive: !coupon.isActive } 
    }));
  };

  const getDiscountIcon = (type) => {
    switch (type) {
      case "percentage": return <FiPercent className="text-blue-400" />;
      case "flat": return <FiDollarSign className="text-green-400" />;
      case "free_shipping": return <FiTruck className="text-purple-400" />;
      default: return <FiTag />;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const isExpired = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display text-forest">Coupons</h2>
          <p className="text-forest/60">Manage discount coupons</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all"
        >
          <FiPlus /> Create Coupon
        </button>
      </div>

      {success && (
        <div className="p-3 bg-green-500/20 border border-green-500/40 text-green-600 rounded-lg flex items-center gap-2">
          <FiCheckCircle /> {success}
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/40 text-red-500 rounded-lg flex items-center gap-2">
          <FiAlertCircle /> {error}
        </div>
      )}

      <div className="bg-white rounded-corners-lg border border-forest/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-cream border-b border-forest/10">
              <tr>
                <th className="text-left p-4 text-forest/60 font-medium">Code</th>
                <th className="text-left p-4 text-forest/60 font-medium">Discount</th>
                <th className="text-left p-4 text-forest/60 font-medium">Min Cart</th>
                <th className="text-left p-4 text-forest/60 font-medium">Usage</th>
                <th className="text-left p-4 text-forest/60 font-medium">Expires</th>
                <th className="text-left p-4 text-forest/60 font-medium">Status</th>
                <th className="text-right p-4 text-forest/60 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-forest/60">
                    Loading...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-forest/60">
                    No coupons found. Create your first coupon!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon._id} className="border-b border-forest/10 hover:bg-cream/50 transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-semibold text-forest">{coupon.code}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getDiscountIcon(coupon.discountType)}
                        <span>
                          {coupon.discountType === "percentage" 
                            ? `${coupon.discountValue}%`
                            : coupon.discountType === "flat"
                            ? `₹${coupon.discountValue}`
                            : "Free Shipping"}
                        </span>
                        {coupon.maxDiscount && coupon.discountType === "percentage" && (
                          <span className="text-xs text-forest/60">(max ₹{coupon.maxDiscount})</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-forest/60">
                      {coupon.minCartValue > 0 ? `₹${coupon.minCartValue}` : "-"}
                    </td>
                    <td className="p-4 text-forest/60">
                      {coupon.usedCount || 0}
                      {coupon.usageLimit ? ` / ${coupon.usageLimit}` : " / ∞"}
                    </td>
                    <td className="p-4">
                      <span className={isExpired(coupon.expiryDate) ? "text-red-500" : "text-forest/60"}>
                        {formatDate(coupon.expiryDate)}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleActive(coupon)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm ${
                          coupon.isActive 
                            ? "bg-green-500/20 text-green-600" 
                            : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {coupon.isActive ? <FiCheckCircle size={14} /> : <FiXCircle size={14} />}
                        {coupon.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(coupon)}
                          className="p-2 text-forest/60 hover:text-forest transition-colors"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id)}
                          className="p-2 text-forest/60 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-corners-lg border border-forest/10 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-forest/10">
              <h3 className="text-xl font-display text-forest">
                {editingCoupon ? "Edit Coupon" : "Create Coupon"}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-forest/60 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                  placeholder="e.g., SAVE20"
                  required
                  disabled={editingCoupon}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-forest/60 mb-1">Discount Type *</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    required
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-forest/60 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    placeholder={formData.discountType === "free_shipping" ? "0" : "10"}
                    required={formData.discountType !== "free_shipping"}
                    disabled={formData.discountType === "free_shipping"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-forest/60 mb-1">Min Cart Value</label>
                  <input
                    type="number"
                    value={formData.minCartValue}
                    onChange={(e) => setFormData({ ...formData, minCartValue: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm text-forest/60 mb-1">Max Discount</label>
                  <input
                    type="number"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    placeholder="For % only"
                    disabled={formData.discountType !== "percentage"}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-forest/60 mb-1">Expiry Date *</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-forest/60 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                    placeholder="Unlimited"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-forest/60 mb-1">Per User Usage Limit</label>
                <input
                  type="number"
                  value={formData.userUsageLimit}
                  onChange={(e) => setFormData({ ...formData, userUsageLimit: e.target.value })}
                  className="w-full px-4 py-2 bg-cream border border-forest/20 text-forest rounded-corners-lg focus:outline-none focus:border-forest"
                  min="1"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="allowMultiple"
                  checked={formData.allowMultiple}
                  onChange={(e) => setFormData({ ...formData, allowMultiple: e.target.checked })}
                  className="w-4 h-4 accent-forest"
                />
                <label htmlFor="allowMultiple" className="text-sm text-forest/60">
                  Allow multiple coupons
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-forest/20 text-forest/60 rounded-corners-lg hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-forest text-cream font-semibold rounded-corners-lg hover:shadow-float transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : editingCoupon ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;