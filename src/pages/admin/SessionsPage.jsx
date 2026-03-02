import { useState } from 'react';
import { useSessions } from '../../context/SessionContext';
import { useOrders } from '../../context/OrderContext';
import { formatDate, formatDateTime, formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvHelpers';
import {
    Plus,
    Pencil,
    Trash2,
    X,
    Play,
    Pause,
    Square,
    Download,
    FileText,
} from 'lucide-react';

const AdminSessionsPage = () => {
    const { sessions, addSession, updateSession, deleteSession, updateStatus } = useSessions();
    const { orders, getOrdersBySession } = useOrders();
    const [showModal, setShowModal] = useState(false);
    const [editSession, setEditSession] = useState(null);

    const emptyForm = {
        name: '',
        startDate: '',
        endDate: '',
        maxOrdersPerCustomer: '',
        minimumOrderGoal: '',
    };

    const [form, setForm] = useState(emptyForm);

    const openAdd = () => {
        setEditSession(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (session) => {
        setEditSession(session);
        setForm({
            name: session.name,
            startDate: session.startDate ? session.startDate.slice(0, 16) : '',
            endDate: session.endDate ? session.endDate.slice(0, 16) : '',
            maxOrdersPerCustomer: session.rules?.maxOrdersPerCustomer || '',
            minimumOrderGoal: session.rules?.minimumOrderGoal || '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const sessionData = {
            name: form.name,
            startDate: new Date(form.startDate).toISOString(),
            endDate: new Date(form.endDate).toISOString(),
            rules: {
                maxOrdersPerCustomer: form.maxOrdersPerCustomer ? Number(form.maxOrdersPerCustomer) : null,
                minimumOrderGoal: form.minimumOrderGoal ? Number(form.minimumOrderGoal) : null,
            },
        };

        if (editSession) {
            updateSession({ ...editSession, ...sessionData });
        } else {
            addSession(sessionData);
        }
        setShowModal(false);
    };

    const getStatusActions = (session) => {
        switch (session.status) {
            case 'draft':
                return (
                    <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateStatus(session.id, 'active')}
                    >
                        <Play size={14} /> Activate
                    </button>
                );
            case 'active':
                return (
                    <button
                        className="btn btn-danger btn-sm"
                        onClick={() => updateStatus(session.id, 'closed')}
                    >
                        <Square size={14} /> Close
                    </button>
                );
            case 'closed':
                return (
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => updateStatus(session.id, 'draft')}
                    >
                        Reset to Draft
                    </button>
                );
            default:
                return null;
        }
    };

    const exportSessionOrders = (session) => {
        const sessionOrders = getOrdersBySession(session.id);
        const rows = sessionOrders.map(o => ({
            order_number: o.orderNumber,
            customer: o.customerName,
            email: o.email,
            phone: o.phone,
            items: o.items.map(i => `${i.productName} (${i.variantSize}) x${i.quantity}`).join('; '),
            total: o.total,
            status: o.status,
            payment_status: o.paymentStatus,
            date: o.createdAt,
        }));
        exportToCSV(rows, `session_orders_${session.name.replace(/\s+/g, '_')}`);
    };

    const exportSKUSummary = (session) => {
        const sessionOrders = getOrdersBySession(session.id);
        const skuMap = {};
        sessionOrders.forEach(o => {
            o.items.forEach(item => {
                const key = `${item.productName} - ${item.variantSize}`;
                if (!skuMap[key]) skuMap[key] = { product: item.productName, variant: item.variantSize, totalQty: 0, totalRevenue: 0 };
                skuMap[key].totalQty += item.quantity;
                skuMap[key].totalRevenue += item.price * item.quantity;
            });
        });
        exportToCSV(Object.values(skuMap), `sku_summary_${session.name.replace(/\s+/g, '_')}`);
    };

    return (
        <div>
            <div className="page-header">
                <h1>Sessions</h1>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>
                    <Plus size={16} /> Create Session
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {sessions.length === 0 ? (
                    <div className="empty-state">
                        <h3>No sessions yet</h3>
                        <p>Create your first group-buy session to get started.</p>
                    </div>
                ) : (
                    sessions.map(session => {
                        const sessionOrders = getOrdersBySession(session.id);
                        const sessionRevenue = sessionOrders.reduce((sum, o) => sum + o.total, 0);

                        return (
                            <div key={session.id} className="card">
                                <div className="card-header">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <h3>{session.name}</h3>
                                        <span className={`status-badge status-${session.status}`}>
                                            <span className="status-dot"></span>
                                            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        {getStatusActions(session)}
                                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(session)} title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => {
                                                if (confirm('Delete this session?')) deleteSession(session.id);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                                        </button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', marginBottom: '20px' }}>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Start Date</div>
                                            <div style={{ fontWeight: 500 }}>{formatDateTime(session.startDate)}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>End Date</div>
                                            <div style={{ fontWeight: 500 }}>{formatDateTime(session.endDate)}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Orders</div>
                                            <div style={{ fontWeight: 500 }}>{sessionOrders.length}</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>Revenue</div>
                                            <div style={{ fontWeight: 500 }}>{formatCurrency(sessionRevenue)}</div>
                                        </div>
                                    </div>

                                    {session.rules && (
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                            {session.rules.maxOrdersPerCustomer && (
                                                <span className="badge badge-gray">
                                                    Max {session.rules.maxOrdersPerCustomer} orders/customer
                                                </span>
                                            )}
                                            {session.rules.minimumOrderGoal && (
                                                <span className="badge badge-gray">
                                                    Min goal: {formatCurrency(session.rules.minimumOrderGoal)}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn btn-secondary btn-sm" onClick={() => exportSessionOrders(session)}>
                                            <Download size={14} /> Orders List
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={() => exportSKUSummary(session)}>
                                            <FileText size={14} /> SKU Summary
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editSession ? 'Edit Session' : 'Create Session'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group">
                                    <label className="form-label">Session Name *</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={form.name}
                                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        placeholder="e.g., March 2026 Group Buy"
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Start Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            className="form-input"
                                            value={form.startDate}
                                            onChange={(e) => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">End Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            className="form-input"
                                            value={form.endDate}
                                            onChange={(e) => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Max Orders per Customer</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={form.maxOrdersPerCustomer}
                                            onChange={(e) => setForm(prev => ({ ...prev, maxOrdersPerCustomer: e.target.value }))}
                                            placeholder="Optional"
                                            min="1"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Minimum Order Goal (₱)</label>
                                        <input
                                            type="number"
                                            className="form-input"
                                            value={form.minimumOrderGoal}
                                            onChange={(e) => setForm(prev => ({ ...prev, minimumOrderGoal: e.target.value }))}
                                            placeholder="Optional"
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editSession ? 'Save Changes' : 'Create Session'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSessionsPage;
