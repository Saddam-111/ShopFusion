
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  MdDashboard, 
  MdInventory, 
  MdShoppingCart, 
  MdPeople, 
  MdLogout,
  MdMenu,
  MdClose,
  MdChevronLeft,
  MdChevronRight
} from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/userSlice';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', icon: <MdDashboard />, label: 'Dashboard', end: true },
    { path: '/admin/products', icon: <MdInventory />, label: 'Products' },
    { path: '/admin/orders', icon: <MdShoppingCart />, label: 'Orders' },
    { path: '/admin/users', icon: <MdPeople />, label: 'Users' },
  ];

  return (
    <div className="bg-[var(--bg-primary)] min-h-screen">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--bg-secondary)] rounded-lg border border-[var(--accent-gold)]/20 text-[var(--text-primary)]"
      >
        {mobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen z-40
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        bg-[var(--bg-secondary)] border-r border-[var(--accent-gold)]/20
        flex flex-col transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className={`p-4 border-b border-[var(--accent-gold)]/20 flex items-center justify-between ${sidebarCollapsed ? 'justify-center' : ''}`}>
          
          {!sidebarCollapsed ? (
            <div>
              <h1 className="text-xl font-serif font-bold text-[var(--accent-gold)]">Admin</h1>
              <p className="text-[var(--text-secondary)] text-xs">ShopFusion</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center">
              <span className="font-bold text-[var(--accent-gold)]">A</span>
            </div>
          )}

          {/* Toggle Button */}
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1 rounded hover:bg-[var(--bg-primary)] text-[var(--text-secondary)]"
          >
            {sidebarCollapsed ? <MdChevronRight /> : <MdChevronLeft />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] border-l-2 border-[var(--accent-gold)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] hover:text-[var(--text-primary)]'
                    } ${sidebarCollapsed ? 'justify-center' : ''}`
                  }
                >
                  <span className="text-xl">{item.icon}</span>
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className={`p-3 border-t border-[var(--accent-gold)]/20 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          
          <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : 'px-3'}`}>
            <div className="w-9 h-9 rounded-full bg-[var(--accent-gold)]/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-[var(--accent-gold)] text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">Admin</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-3 py-2 w-full text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <MdLogout />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={`
        min-h-screen transition-all duration-300 ease-in-out
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
      `}>
        <div className="p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
};

export default AdminLayout;

