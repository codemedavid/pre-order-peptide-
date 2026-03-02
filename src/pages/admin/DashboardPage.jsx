import { useOrders } from '../../context/OrderContext';
import { useSessions } from '../../context/SessionContext';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { Link } from 'react-router-dom';
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    ArrowRight,
    TrendingUp,
} from 'lucide-react';

const DashboardPage = () => {
    const { orders } = useOrders();
    const { sessions, activeSession } = useSessions();
    const { products } = useProducts();

    const totalRevenue = orders
        .filter(o => o.paymentStatus === 'paid')
        .reduce((sum, o) => sum + o.total, 0);

    const pendingPayments = orders.filter(o => o.paymentStatus === 'pending').length;
    const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                        Welcome back! Here's what's happening.
                    </p>
                </div>
                {activeSession && (
                    <span className="badge badge-success" style={{ fontSize: '0.8125rem', padding: '6px 14px' }}>
                        Session Active: {activeSession.name}
                    </span>
                )}
            </div>

            {/* Stats */}
            <div className="stats-grid" style={{ marginBottom: '32px' }}>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">
                        <Package size={24} />
                    </div>
                    <div className="stat-content">
                        <h4>Products</h4>
                        <div className="stat-value">{products.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-green">
                        <ShoppingCart size={24} />
                    </div>
                    <div className="stat-content">
                        <h4>Total Orders</h4>
                        <div className="stat-value">{orders.length}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-orange">
                        <Clock size={24} />
                    </div>
                    <div className="stat-content">
                        <h4>Pending Payments</h4>
                        <div className="stat-value">{pendingPayments}</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon stat-icon-blue">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h4>Revenue (Paid)</h4>
                        <div className="stat-value">{formatCurrency(totalRevenue)}</div>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card-header">
                    <h3>Recent Orders</h3>
                    <Link to="/admin/orders" className="btn btn-secondary btn-sm">
                        View All <ArrowRight size={14} />
                    </Link>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="card-body">
                        <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', padding: '24px' }}>
                            No orders yet.
                        </p>
                    </div>
                ) : (
                    <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order #</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map(order => (
                                    <tr key={order.id}>
                                        <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{order.orderNumber}</td>
                                        <td>{order.customerName}</td>
                                        <td style={{ fontWeight: 500 }}>{formatCurrency(order.total)}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'Completed' ? 'badge-success' :
                                                    order.status === 'Pending Payment' ? 'badge-warning' :
                                                        order.status === 'Shipped' ? 'badge-primary' :
                                                            'badge-gray'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' :
                                                    order.paymentStatus === 'pending' ? 'badge-warning' :
                                                        'badge-danger'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>
                                            {formatDateTime(order.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;
