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
  MdChevronRight,
  MdConfirmationNumber
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
    { path: '/admin/coupons', icon: <MdConfirmationNumber />, label: 'Coupons' },
  ];

  return (
    <div className="bg-cream min-h-screen">
      
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-forest/20 text-forest"
      >
        {mobileMenuOpen ? <MdClose /> : <MdMenu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-screen z-40
        ${sidebarCollapsed ? 'w-20' : 'w-64'}
        bg-forest text-sage
        flex flex-col transition-all duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Logo */}
        <div className={`p-4 border-b border-sage/20 flex items-center justify-between ${sidebarCollapsed ? 'justify-center' : ''}`}>
          
          {!sidebarCollapsed ? (
            <div>
              <h1 className="text-xl font-display text-sage">Admin</h1>
              <p className="text-sage/60 text-xs">ShopFusion</p>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <span className="font-display text-sage">A</span>
            </div>
          )}

          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-1 rounded hover:bg-sage/10 text-sage"
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
                        ? 'bg-sage/20 text-sage border-l-2 border-sage'
                        : 'text-sage/60 hover:bg-sage/10 hover:text-sage'
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
        <div className={`p-3 border-t border-sage/20 ${sidebarCollapsed ? 'flex flex-col items-center' : ''}`}>
          
          <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'justify-center' : 'px-3'}`}>
            <div className="w-9 h-9 rounded-full bg-sage/20 flex items-center justify-center flex-shrink-0">
              <span className="font-bold text-sage text-sm">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>

            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-sage truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-sage/60">Admin</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 px-3 py-2 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
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
        p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto
      `}>
        {children}
      </main>

    </div>
  );
};

export default AdminLayout;