import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import ProductDescriptionGenerator from '../components/ProductDescriptionGenerator';
import { 
  MdSearch, 
  MdAdd, 
  MdEdit, 
  MdDelete, 
  MdVisibility,
  MdInventory,
  MdCategory,
  MdAttachMoney,
  MdLocalShipping,
  MdStar,
  MdClose
} from 'react-icons/md';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ search: '', category: '', stock: '', sort: '-createdAt', page: 1 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', category: '', images: []
  });

  const categories = ['laptop', 'mobile', 'television', 'fruits', 'glass', 'camera', 'headphone', 'clothing', 'accessories'];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.category) params.append('category', filters.category);
      if (filters.stock) params.append('stock', filters.stock);
      if (filters.sort) params.append('sort', filters.sort);
      params.append('page', filters.page);
      params.append('limit', 15);

      const res = await axios.get(`${baseUrl}/api/v1/admin/products?${params}`, { withCredentials: true });
      setProducts(res.data.products || []);
      setPagination({
        page: res.data.currentPage || 1,
        totalPages: res.data.totalPages || 1,
        total: res.data.productCount || 0
      });
    } catch {
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('category', formData.category);
      formData.images.forEach(img => formDataToSend.append('images', img));

      if (editingProduct) {
        await axios.put(`${baseUrl}/api/v1/admin/product/${editingProduct._id}`, formDataToSend, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product updated successfully');
      } else {
        await axios.post(`${baseUrl}/api/v1/admin/product/create`, formDataToSend, {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Product created successfully');
      }
      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [] });
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: []
    });
    setShowModal(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      await axios.delete(`${baseUrl}/api/v1/admin/product/${id}`, { withCredentials: true });
      toast.success('Product deleted');
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [] });
    setShowModal(true);
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
    if (stock < 10) return { label: 'Low Stock', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    return { label: 'In Stock', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-serif font-bold">Products Management</h1>
          <button
            onClick={openCreateModal}
            className="bg-[var(--accent-gold)] px-4 py-2 rounded-lg hover:bg-[var(--accent-gold)]/80 transition-colors flex items-center gap-2"
          >
            <MdAdd /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-6 border border-[var(--accent-gold)]/20">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-[var(--bg-primary)] px-4 py-2 pl-10 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value, page: 1 })}
              className="bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select
              value={filters.stock}
              onChange={(e) => setFilters({ ...filters, stock: e.target.value, page: 1 })}
              className="bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
            >
              <option value="">All Stock</option>
              <option value="out">Out of Stock</option>
              <option value="low">Low Stock</option>
              <option value="available">In Stock</option>
            </select>
            <select
              value={filters.sort}
              onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
            >
              <option value="-createdAt">Newest First</option>
              <option value="createdAt">Oldest First</option>
              <option value="-price">Price: High to Low</option>
              <option value="price">Price: Low to High</option>
              <option value="-stock">Stock: High to Low</option>
              <option value="stock">Stock: Low to High</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] animate-spin rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Products Table */}
            <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--accent-gold)]/20">
              <table className="w-full">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Product</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Category</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Price</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Stock</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Rating</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Created</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => {
                    const stockStatus = getStockStatus(product.stock);
                    return (
                      <tr key={product._id} className="border-b border-[var(--accent-gold)]/10 hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images?.[0]?.url || '/placeholder.png'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{product.description?.substring(0, 50)}...</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs bg-[var(--bg-primary)] border border-[var(--accent-gold)]/20 capitalize">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-green-400 font-bold">₹{product.price?.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs border ${stockStatus.class}`}>
                            {stockStatus.label} ({product.stock})
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <MdStar className="text-yellow-400" />
                            <span>{product.ratings?.toFixed(1) || '0.0'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                          {new Date(product.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleView(product)}
                              className="text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80 p-1"
                              title="View Details"
                            >
                              <MdVisibility />
                            </button>
                            <button
                              onClick={() => handleEdit(product)}
                              className="text-blue-400 hover:text-blue-300 p-1"
                              title="Edit"
                            >
                              <MdEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id)}
                              className="text-red-400 hover:text-red-300 p-1"
                              title="Delete"
                            >
                              <MdDelete />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-10 text-[var(--text-secondary)]">No products found</div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setFilters({ ...filters, page })}
                    className={`px-4 py-2 rounded transition-colors ${
                      pagination.page === page 
                        ? 'bg-[var(--accent-gold)] text-[var(--bg-primary)]' 
                        : 'bg-[var(--bg-secondary)] hover:bg-[var(--accent-gold)]/20'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--accent-gold)]/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">Product Details</h2>
              <button onClick={() => setSelectedProduct(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              {/* Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {selectedProduct.images?.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img?.url || '/placeholder.png'} 
                    alt={`${selectedProduct.name} ${idx + 1}`}
                    className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                  />
                ))}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Name</p>
                  <p className="font-semibold">{selectedProduct.name}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Category</p>
                  <p className="capitalize">{selectedProduct.category}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Price</p>
                  <p className="text-green-400 font-bold text-lg">₹{selectedProduct.price?.toLocaleString()}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Stock</p>
                  <span className={`px-2 py-1 rounded text-xs border ${getStockStatus(selectedProduct.stock).class}`}>
                    {getStockStatus(selectedProduct.stock).label} ({selectedProduct.stock})
                  </span>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Rating</p>
                  <div className="flex items-center gap-1">
                    <MdStar className="text-yellow-400" />
                    <span>{selectedProduct.ratings?.toFixed(1) || '0.0'}</span>
                    <span className="text-[var(--text-secondary)]">({selectedProduct.numOfReviews || 0} reviews)</span>
                  </div>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Created</p>
                  <p>{new Date(selectedProduct.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-[var(--text-secondary)] text-sm mb-2">Description</p>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">{selectedProduct.description}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-[var(--accent-gold)]/20">
                <button
                  onClick={() => { setSelectedProduct(null); handleEdit(selectedProduct); }}
                  className="flex-1 bg-[var(--accent-gold)] py-2 rounded-lg hover:bg-[var(--accent-gold)]/80 transition-colors"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => { setSelectedProduct(null); handleDelete(selectedProduct._id); }}
                  className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-[var(--accent-gold)]/20">
            <h2 className="text-2xl font-serif font-bold mb-4">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <ProductDescriptionGenerator onUseDescription={(desc) => setFormData({ ...formData, description: desc })} />
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <label className="block text-sm mb-1">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Description</label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  required 
                  rows={3} 
                  className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Price</label>
                  <input 
                    type="number" 
                    name="price" 
                    value={formData.price} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Stock</label>
                  <input 
                    type="number" 
                    name="stock" 
                    value={formData.stock} 
                    onChange={handleInputChange} 
                    required 
                    className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Category</label>
                <select 
                  name="category" 
                  value={formData.category} 
                  onChange={handleInputChange} 
                  required 
                  className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Images</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} 
                  className="w-full bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none" 
                />
                {editingProduct && <p className="text-xs text-[var(--text-secondary)] mt-1">Leave empty to keep existing images</p>}
              </div>
              <div className="flex gap-4 mt-6">
                <button 
                  type="submit" 
                  className="flex-1 bg-[var(--accent-gold)] px-6 py-2 rounded-lg hover:bg-[var(--accent-gold)]/80 transition-colors"
                >
                  {editingProduct ? 'Update' : 'Create'}
                </button>
                <button 
                  type="button" 
                  onClick={() => { setShowModal(false); setEditingProduct(null); }} 
                  className="flex-1 bg-[var(--bg-primary)] px-6 py-2 rounded-lg hover:bg-[var(--bg-primary)]/80 border border-[var(--accent-gold)]/20 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;