import { NavLink, Outlet, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    CalendarClock,
    CreditCard,
    ClipboardList,
    FlaskConical,
    ExternalLink,
} from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-logo">
                    <Link to="/admin">
                        <div className="header-logo-icon" style={{ width: '32px', height: '32px' }}>
                            <FlaskConical size={16} />
                        </div>
                        Pre Order Peptide Admin
                    </Link>
                </div>

                <div className="admin-nav-section">Main</div>
                <nav className="admin-sidebar-nav">
                    <NavLink to="/admin" end className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>

                    <div className="admin-nav-divider" />
                    <div className="admin-nav-section">Management</div>

                    <NavLink to="/admin/products" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <Package size={20} />
                        Products
                    </NavLink>
                    <NavLink to="/admin/sessions" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <CalendarClock size={20} />
                        Sessions
                    </NavLink>
                    <NavLink to="/admin/payments" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <CreditCard size={20} />
                        Payments
                    </NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
                        <ClipboardList size={20} />
                        Orders
                    </NavLink>
                </nav>

                <div style={{ padding: '16px 12px', marginTop: 'auto', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                    <Link
                        to="/"
                        className="admin-nav-item"
                        style={{ fontSize: '0.8125rem', color: 'var(--color-text-tertiary)' }}
                    >
                        <ExternalLink size={16} />
                        View Store
                    </Link>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
