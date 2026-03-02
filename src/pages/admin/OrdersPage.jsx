import { useState } from 'react';
import { useOrders, ORDER_STATUSES } from '../../context/OrderContext';
import { useSessions } from '../../context/SessionContext';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvHelpers';
import { Eye, X, Download, Truck, Package } from 'lucide-react';

const AdminOrdersPage = () => {
    const { orders, updateStatus, addTracking } = useOrders();
    const { sessions } = useSessions();
    const [sessionFilter, setSessionFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [trackingForm, setTrackingForm] = useState({ trackingNumber: '', courier: '' });

    const filtered = orders.filter(o => {
        if (sessionFilter !== 'all' && o.sessionId !== sessionFilter) return false;
        if (statusFilter !== 'all' && o.status !== statusFilter) return false;
        return true;
    });

    const handleExport = () => {
        exportToCSV(filtered.map(o => ({
            order_number: o.orderNumber, customer: o.customerName, email: o.email, phone: o.phone,
            items: o.items.map(i => `${i.productName} (${i.variantSize}) x${i.quantity}`).join('; '),
            total: o.total, status: o.status, payment: o.paymentStatus, tracking: o.trackingNumber || '', courier: o.courier || '', date: o.createdAt,
        })), 'orders_export');
    };

    const handleTrackingSave = () => {
        if (selectedOrder && trackingForm.trackingNumber) {
            addTracking(selectedOrder.id, trackingForm.trackingNumber, trackingForm.courier);
            setSelectedOrder(prev => ({ ...prev, trackingNumber: trackingForm.trackingNumber, courier: trackingForm.courier }));
        }
    };

    return (
        <div>
            <div className="page-header">
                <h1>Orders</h1>
                <button className="btn btn-secondary btn-sm" onClick={handleExport}><Download size={16} /> Export CSV</button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ minWidth: '200px' }}>
                    <label className="form-label">Filter by Session</label>
                    <select className="form-select" value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)}>
                        <option value="all">All Sessions</option>
                        {sessions.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="form-group" style={{ minWidth: '200px' }}>
                    <label className="form-label">Filter by Status</label>
                    <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Actions</th></tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-secondary)' }}>No orders found</td></tr>
                        ) : filtered.map(order => (
                            <tr key={order.id}>
                                <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8125rem' }}>{order.orderNumber}</td>
                                <td>
                                    <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{order.email}</div>
                                </td>
                                <td style={{ fontSize: '0.8125rem' }}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                                <td style={{ fontWeight: 600 }}>{formatCurrency(order.total)}</td>
                                <td>
                                    <select className="form-select" value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                                        style={{ padding: '6px 8px', fontSize: '0.75rem', minWidth: '140px' }}>
                                        {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </td>
                                <td><span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{order.paymentStatus}</span></td>
                                <td>
                                    <button className="btn btn-ghost btn-sm" onClick={() => { setSelectedOrder(order); setTrackingForm({ trackingNumber: order.trackingNumber || '', courier: order.courier || '' }); }}>
                                        <Eye size={14} /> View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Order {selectedOrder.orderNumber}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setSelectedOrder(null)}><X size={20} /></button>
                        </div>
                        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Customer Info */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div><span className="form-label">Customer</span><div style={{ fontWeight: 500 }}>{selectedOrder.customerName}</div></div>
                                <div><span className="form-label">Email</span><div>{selectedOrder.email}</div></div>
                                <div><span className="form-label">Phone</span><div>{selectedOrder.phone}</div></div>
                                <div><span className="form-label">Date</span><div>{formatDateTime(selectedOrder.createdAt)}</div></div>
                            </div>

                            {/* Items */}
                            <div>
                                <h4 style={{ marginBottom: '12px' }}>Items</h4>
                                {selectedOrder.items.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--color-surface)', borderRadius: 'var(--radius)', marginBottom: '8px' }}>
                                        <div><div style={{ fontWeight: 500 }}>{item.productName}</div><div style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)' }}>{item.variantSize} × {item.quantity}</div></div>
                                        <div style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</div>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.125rem', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--color-border)' }}>
                                    <span>Total</span><span style={{ color: 'var(--color-primary)' }}>{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>

                            {/* Tracking */}
                            <div>
                                <h4 style={{ marginBottom: '12px' }}>Shipping & Tracking</h4>
                                <div className="form-row">
                                    <div className="form-group"><label className="form-label">Tracking Number</label><input type="text" className="form-input" value={trackingForm.trackingNumber} onChange={e => setTrackingForm(p => ({ ...p, trackingNumber: e.target.value }))} placeholder="Enter tracking number" /></div>
                                    <div className="form-group"><label className="form-label">Courier</label><input type="text" className="form-input" value={trackingForm.courier} onChange={e => setTrackingForm(p => ({ ...p, courier: e.target.value }))} placeholder="e.g., J&T, LBC" /></div>
                                </div>
                                <button className="btn btn-primary btn-sm" onClick={handleTrackingSave} style={{ marginTop: '12px' }}><Truck size={14} /> Save Tracking</button>
                            </div>

                            {selectedOrder.notes && (
                                <div><h4 style={{ marginBottom: '8px' }}>Notes</h4><p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{selectedOrder.notes}</p></div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
