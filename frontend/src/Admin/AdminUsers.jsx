import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { MdSearch, MdPerson, MdEmail, MdBlock, MdDelete, MdVisibility, MdClose, MdVerified, MdWarning } from 'react-icons/md';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', blocked: '', page: 1 });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.blocked) params.append('blocked', filters.blocked);
      params.append('page', filters.page);
      params.append('limit', 15);

      const res = await axios.get(`${baseUrl}/api/v1/admin/users?${params}`, { withCredentials: true });
      setUsers(res.data.users || []);
      setPagination({
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
        total: res.data.total || 0
      });
    } catch {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleBlock = async (userId, currentlyBlocked) => {
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      const endpoint = currentlyBlocked 
        ? `${baseUrl}/api/v1/admin/user/${userId}/unblock`
        : `${baseUrl}/api/v1/admin/user/${userId}/block`;
      
      await axios.put(endpoint, {}, { withCredentials: true });
      toast.success(currentlyBlocked ? 'User unblocked' : 'User blocked');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const baseUrl = import.meta.env.VITE_SERVER_URL;
      await axios.delete(`${baseUrl}/api/v1/admin/user/${userId}`, { withCredentials: true });
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') return { label: 'Admin', class: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
    return { label: 'User', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
  };

  const getStatusBadge = (blocked) => {
    if (blocked) return { label: 'Blocked', class: 'bg-red-500/20 text-red-400 border-red-500/30' };
    return { label: 'Active', class: 'bg-green-500/20 text-green-400 border-green-500/30' };
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-6">Users Management</h1>

        {/* Filters */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-4 mb-6 border border-[var(--accent-gold)]/20">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                className="w-full bg-[var(--bg-primary)] px-4 py-2 pl-10 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
              />
            </div>
            <select
              value={filters.blocked}
              onChange={(e) => setFilters({ ...filters, blocked: e.target.value, page: 1 })}
              className="bg-[var(--bg-primary)] px-4 py-2 rounded-lg border border-[var(--accent-gold)]/20 focus:border-[var(--accent-gold)] focus:outline-none"
            >
              <option value="">All Users</option>
              <option value="false">Active</option>
              <option value="true">Blocked</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-12 h-12 border-4 border-[var(--accent-gold)]/30 border-t-[var(--accent-gold)] animate-spin rounded-full"></div>
          </div>
        ) : (
          <>
            {/* Users Table */}
            <div className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--accent-gold)]/20">
              <table className="w-full">
                <thead className="bg-[var(--bg-primary)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">User</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Email</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Role</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Joined</th>
                    <th className="px-4 py-3 text-left text-[var(--text-secondary)]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const roleBadge = getRoleBadge(user.role);
                    const statusBadge = getStatusBadge(user.blocked);
                    return (
                      <tr key={user._id} className="border-b border-[var(--accent-gold)]/10 hover:bg-[var(--bg-primary)]/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center">
                              {user.avatar?.url ? (
                                <img src={user.avatar.url} alt={user.name} className="w-full h-full rounded-full object-cover" />
                              ) : (
                                <span className="text-lg font-bold text-[var(--accent-gold)]">{user.name?.charAt(0).toUpperCase()}</span>
                              )}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs border ${roleBadge.class}`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs border ${statusBadge.class}`}>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="text-[var(--accent-gold)] hover:text-[var(--accent-gold)]/80 p-1"
                              title="View "
                            >
                              <MdVisibility />
                            </button>
                            {user.role !== 'admin' && (
                              <>
                                <button
                                  onClick={() => toggleBlock(user._id, user.blocked)}
                                  className={`p-1 ${user.blocked ? 'text-green-400 hover:text-green-300' : 'text-yellow-400 hover:text-yellow-300'}`}
                                  title={user.blocked ? 'Unblock' : 'Block'}
                                >
                                  <MdBlock />
                                </button>
                                <button
                                  onClick={() => deleteUser(user._id)}
                                  className="text-red-400 hover:text-red-300 p-1"
                                  title="Delete"
                                >
                                  <MdDelete />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {users.length === 0 && (
              <div className="text-center py-10 text-[var(--text-secondary)]">No users found</div>
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 w-full max-w-lg border border-[var(--accent-gold)]/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif font-bold">User Details</h2>
              <button onClick={() => setSelectedUser(null)} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-2xl">&times;</button>
            </div>
            
            <div className="space-y-6">
              {/* Avatar & Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center">
                  {selectedUser.avatar?.url ? (
                    <img src={selectedUser.avatar.url} alt={selectedUser.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-[var(--accent-gold)]">{selectedUser.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="text-xl font-bold">{selectedUser.name}</p>
                  <p className="text-[var(--text-secondary)]">{selectedUser.email}</p>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Role</p>
                  <span className={`px-2 py-1 rounded text-xs border ${getRoleBadge(selectedUser.role).class}`}>
                    {getRoleBadge(selectedUser.role).label}
                  </span>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Status</p>
                  <span className={`px-2 py-1 rounded text-xs border ${getStatusBadge(selectedUser.blocked).class}`}>
                    {getStatusBadge(selectedUser.blocked).label}
                  </span>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">Joined</p>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="bg-[var(--bg-primary)] p-4 rounded-lg">
                  <p className="text-[var(--text-secondary)] text-sm">User ID</p>
                  <p className="font-mono text-sm">{selectedUser._id.slice(-8)}</p>
                </div>
              </div>

              {/* Actions */}
              {selectedUser.role !== 'admin' && (
                <div className="flex gap-4 pt-4 border-t border-[var(--accent-gold)]/20">
                  <button
                    onClick={() => { toggleBlock(selectedUser._id, selectedUser.blocked); setSelectedUser(null); }}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      selectedUser.blocked 
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                        : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                    }`}
                  >
                    {selectedUser.blocked ? 'Unblock User' : 'Block User'}
                  </button>
                  <button
                    onClick={() => { deleteUser(selectedUser._id); setSelectedUser(null); }}
                    className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Delete User
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;