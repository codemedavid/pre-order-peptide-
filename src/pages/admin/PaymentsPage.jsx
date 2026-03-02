import { useState } from 'react';
import { usePayments } from '../../context/PaymentContext';
import { useOrders } from '../../context/OrderContext';
import { formatCurrency } from '../../utils/formatters';
import { exportToCSV } from '../../utils/csvHelpers';
import { Plus, Pencil, Trash2, X, Save, Download, Eye, CreditCard } from 'lucide-react';

const AdminPaymentsPage = () => {
    const { methods, rules, addMethod, updateMethod, deleteMethod, toggleMethod, updateRules } = usePayments();
    const { orders, updatePaymentStatus } = useOrders();
    const [showMethodModal, setShowMethodModal] = useState(false);
    const [editMethod, setEditMethod] = useState(null);
    const [paymentFilter, setPaymentFilter] = useState('all');
    const [showProof, setShowProof] = useState(null);
    const [methodForm, setMethodForm] = useState({ name: '', type: 'bank', details: '' });
    const [rulesForm, setRulesForm] = useState({ ...rules });

    const openAddMethod = () => { setEditMethod(null); setMethodForm({ name: '', type: 'bank', details: '' }); setShowMethodModal(true); };
    const openEditMethod = (m) => { setEditMethod(m); setMethodForm({ name: m.name, type: m.type, details: m.details }); setShowMethodModal(true); };

    const handleMethodSubmit = (e) => {
        e.preventDefault();
        editMethod ? updateMethod({ ...editMethod, ...methodForm }) : addMethod({ ...methodForm, enabled: true });
        setShowMethodModal(false);
    };

    const handleRulesSave = () => { updateRules(rulesForm); alert('Payment rules updated!'); };

    const filteredOrders = orders.filter(o => paymentFilter === 'all' || o.paymentStatus === paymentFilter);
    const paidTotal = orders.filter(o => o.paymentStatus === 'paid').reduce((s, o) => s + o.total, 0);
    const pendingTotal = orders.filter(o => o.paymentStatus === 'pending').reduce((s, o) => s + o.total, 0);

    const handleExportPaid = () => {
        exportToCSV(orders.filter(o => o.paymentStatus === 'paid').map(o => ({
            order_number: o.orderNumber, customer: o.customerName, email: o.email, total: o.total, date: o.createdAt,
        })), 'paid_orders');
    };

    return (
        <div>
            <h1 style={{ marginBottom: '32px' }}>Payments</h1>

            {/* Payment Rules */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>Payment Rules</h3>
                    <button className="btn btn-primary btn-sm" onClick={handleRulesSave}><Save size={14} /> Save Rules</button>
                </div>
                <div className="card-body">
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">Payment Requirement</label>
                            <label className="toggle" style={{ marginTop: '8px' }}>
                                <input type="checkbox" checked={rulesForm.fullPaymentRequired} onChange={(e) => setRulesForm(prev => ({ ...prev, fullPaymentRequired: e.target.checked }))} />
                                <span className="toggle-slider"></span>
                                <span style={{ marginLeft: '12px', fontSize: '0.875rem' }}>Full payment required</span>
                            </label>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Auto-cancel after (hours)</label>
                            <input type="number" className="form-input" value={rulesForm.autoCancelHours} onChange={(e) => setRulesForm(prev => ({ ...prev, autoCancelHours: Number(e.target.value) }))} min="0" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Payment Methods */}
            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="card-header">
                    <h3>Payment Methods</h3>
                    <button className="btn btn-primary btn-sm" onClick={openAddMethod}><Plus size={14} /> Add Method</button>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {methods.map(method => (
                        <div key={method.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: 'var(--radius)', border: '1px solid var(--color-border)', opacity: method.enabled ? 1 : 0.6 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}><CreditCard size={20} /></div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{method.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{method.type === 'bank' ? 'Bank Transfer' : method.type === 'ewallet' ? 'E-Wallet' : 'Card'}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label className="toggle"><input type="checkbox" checked={method.enabled} onChange={() => toggleMethod(method.id)} /><span className="toggle-slider"></span></label>
                                <button className="btn btn-ghost btn-icon" onClick={() => openEditMethod(method)}><Pencil size={16} /></button>
                                <button className="btn btn-ghost btn-icon" onClick={() => { if (confirm('Delete?')) deleteMethod(method.id); }}><Trash2 size={16} style={{ color: 'var(--color-danger)' }} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Tracking */}
            <div className="card">
                <div className="card-header">
                    <h3>Payment Tracking</h3>
                    <button className="btn btn-secondary btn-sm" onClick={handleExportPaid}><Download size={14} /> Export Paid</button>
                </div>
                <div className="card-body">
                    <div className="stats-grid" style={{ marginBottom: '24px' }}>
                        <div className="stat-card"><div className="stat-icon stat-icon-green" style={{ fontSize: '1.25rem', fontWeight: 700 }}>₱</div><div className="stat-content"><h4>Paid</h4><div className="stat-value" style={{ fontSize: '1.25rem' }}>{formatCurrency(paidTotal)}</div></div></div>
                        <div className="stat-card"><div className="stat-icon stat-icon-orange" style={{ fontSize: '1.25rem', fontWeight: 700 }}>₱</div><div className="stat-content"><h4>Pending</h4><div className="stat-value" style={{ fontSize: '1.25rem' }}>{formatCurrency(pendingTotal)}</div></div></div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        {['all', 'pending', 'paid', 'failed', 'cancelled'].map(s => (
                            <button key={s} className={`btn ${paymentFilter === s ? 'btn-primary' : 'btn-secondary'} btn-sm`} onClick={() => setPaymentFilter(s)}>{s.charAt(0).toUpperCase() + s.slice(1)}</button>
                        ))}
                    </div>
                    <div className="table-wrapper" style={{ border: 'none' }}>
                        <table className="table">
                            <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Proof</th><th>Actions</th></tr></thead>
                            <tbody>
                                {filteredOrders.length === 0 ? (
                                    <tr><td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-secondary)' }}>No orders found</td></tr>
                                ) : filteredOrders.map(order => (
                                    <tr key={order.id}>
                                        <td style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '0.8125rem' }}>{order.orderNumber}</td>
                                        <td>{order.customerName}</td>
                                        <td style={{ fontWeight: 500 }}>{formatCurrency(order.total)}</td>
                                        <td><span className={`badge ${order.paymentStatus === 'paid' ? 'badge-success' : order.paymentStatus === 'pending' ? 'badge-warning' : 'badge-danger'}`}>{order.paymentStatus}</span></td>
                                        <td>{order.proofOfPayment ? <button className="btn btn-ghost btn-sm" onClick={() => setShowProof(order.proofOfPayment)}><Eye size={14} /> View</button> : <span style={{ color: 'var(--color-text-tertiary)', fontSize: '0.8125rem' }}>None</span>}</td>
                                        <td><select className="form-select" value={order.paymentStatus} onChange={(e) => updatePaymentStatus(order.id, e.target.value)} style={{ padding: '6px 10px', fontSize: '0.8125rem' }}><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option><option value="cancelled">Cancelled</option></select></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Method Modal */}
            {showMethodModal && (
                <div className="modal-overlay" onClick={() => setShowMethodModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>{editMethod ? 'Edit Method' : 'Add Method'}</h3><button className="btn btn-ghost btn-icon" onClick={() => setShowMethodModal(false)}><X size={20} /></button></div>
                        <form onSubmit={handleMethodSubmit}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-group"><label className="form-label">Name *</label><input type="text" className="form-input" value={methodForm.name} onChange={(e) => setMethodForm(p => ({ ...p, name: e.target.value }))} required /></div>
                                <div className="form-group"><label className="form-label">Type</label><select className="form-select" value={methodForm.type} onChange={(e) => setMethodForm(p => ({ ...p, type: e.target.value }))}><option value="bank">Bank Transfer</option><option value="ewallet">E-Wallet</option><option value="card">Card</option></select></div>
                                <div className="form-group"><label className="form-label">Details</label><textarea className="form-textarea" value={methodForm.details} onChange={(e) => setMethodForm(p => ({ ...p, details: e.target.value }))} style={{ minHeight: '100px' }} /></div>
                            </div>
                            <div className="modal-footer"><button type="button" className="btn btn-ghost" onClick={() => setShowMethodModal(false)}>Cancel</button><button type="submit" className="btn btn-primary">{editMethod ? 'Save' : 'Add'}</button></div>
                        </form>
                    </div>
                </div>
            )}

            {/* Proof Viewer */}
            {showProof && (
                <div className="modal-overlay" onClick={() => setShowProof(null)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header"><h3>Proof of Payment</h3><button className="btn btn-ghost btn-icon" onClick={() => setShowProof(null)}><X size={20} /></button></div>
                        <div className="modal-body"><img src={showProof} alt="Proof" style={{ width: '100%', borderRadius: 'var(--radius)' }} /></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPaymentsPage;
