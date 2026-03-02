import { useState, useRef } from 'react';
import { useProducts } from '../../context/ProductContext';
import { formatCurrency } from '../../utils/formatters';
import { parseCSV } from '../../utils/csvHelpers';
import { v4 as uuidv4 } from 'uuid';
import {
    Plus,
    Pencil,
    Trash2,
    Upload,
    X,
    Eye,
    EyeOff,
    Save,
    Download,
} from 'lucide-react';
import { exportToCSV } from '../../utils/csvHelpers';

const AdminProductsPage = () => {
    const { products, addProduct, updateProduct, deleteProduct, toggleAvailability, getCategories } = useProducts();
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [bulkPriceMode, setBulkPriceMode] = useState(false);
    const [priceEdits, setPriceEdits] = useState({});
    const fileRef = useRef(null);

    const emptyForm = {
        name: '',
        category: '',
        description: '',
        variants: [{ size: '', price: '', available: true }],
    };

    const [form, setForm] = useState(emptyForm);

    const openAdd = () => {
        setEditProduct(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEdit = (product) => {
        setEditProduct(product);
        setForm({
            name: product.name,
            category: product.category || '',
            description: product.description || '',
            variants: product.variants.map(v => ({ ...v })),
        });
        setShowModal(true);
    };

    const handleVariantChange = (idx, field, value) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.map((v, i) =>
                i === idx ? { ...v, [field]: field === 'price' ? (value === '' ? '' : Number(value)) : value } : v
            ),
        }));
    };

    const addVariant = () => {
        setForm(prev => ({
            ...prev,
            variants: [...prev.variants, { size: '', price: '', available: true }],
        }));
    };

    const removeVariant = (idx) => {
        setForm(prev => ({
            ...prev,
            variants: prev.variants.filter((_, i) => i !== idx),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editProduct) {
            updateProduct({
                ...editProduct,
                name: form.name,
                category: form.category,
                description: form.description,
                variants: form.variants.map(v => ({
                    ...v,
                    id: v.id || uuidv4(),
                    price: Number(v.price),
                })),
            });
        } else {
            addProduct({
                name: form.name,
                category: form.category,
                description: form.description,
                variants: form.variants.map(v => ({
                    ...v,
                    price: Number(v.price),
                    available: true,
                })),
                available: true,
            });
        }
        setShowModal(false);
    };

    const handleCSVImport = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const data = await parseCSV(file);
            // Group by product name
            const grouped = {};
            data.forEach(row => {
                const name = row.name || row.Name || row.product_name;
                if (!name) return;
                if (!grouped[name]) {
                    grouped[name] = {
                        name,
                        category: row.category || row.Category || '',
                        description: row.description || row.Description || '',
                        variants: [],
                    };
                }
                grouped[name].variants.push({
                    size: row.variant || row.Variant || row.size || row.Size || '',
                    price: Number(row.price || row.Price || 0),
                    available: true,
                });
            });

            Object.values(grouped).forEach(product => {
                addProduct(product);
            });

            alert(`Imported ${Object.keys(grouped).length} products successfully!`);
        } catch (err) {
            alert('Error importing CSV: ' + err.message);
        }
        e.target.value = '';
    };

    const handleBulkPriceSave = () => {
        Object.entries(priceEdits).forEach(([key, newPrice]) => {
            const [productId, variantId] = key.split('|');
            const product = products.find(p => p.id === productId);
            if (product) {
                updateProduct({
                    ...product,
                    variants: product.variants.map(v =>
                        v.id === variantId ? { ...v, price: Number(newPrice) } : v
                    ),
                });
            }
        });
        setBulkPriceMode(false);
        setPriceEdits({});
    };

    const handleExport = () => {
        const rows = [];
        products.forEach(p => {
            p.variants.forEach(v => {
                rows.push({
                    name: p.name,
                    category: p.category,
                    description: p.description,
                    variant: v.size,
                    price: v.price,
                    available: v.available ? 'Yes' : 'No',
                });
            });
        });
        exportToCSV(rows, 'products_export');
    };

    return (
        <div>
            <div className="page-header">
                <h1>Products</h1>
                <div className="page-header-actions">
                    <button className="btn btn-ghost btn-sm" onClick={handleExport}>
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => { setBulkPriceMode(!bulkPriceMode); setPriceEdits({}); }}
                    >
                        {bulkPriceMode ? 'Cancel Bulk Edit' : '💰 Bulk Price Edit'}
                    </button>
                    <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                        <Upload size={16} /> Import CSV
                        <input
                            type="file"
                            accept=".csv,.xlsx"
                            ref={fileRef}
                            onChange={handleCSVImport}
                            style={{ display: 'none' }}
                        />
                    </label>
                    <button className="btn btn-primary btn-sm" onClick={openAdd}>
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {bulkPriceMode && (
                <div style={{
                    background: 'var(--color-warning-light)',
                    border: '1px solid var(--color-warning)',
                    borderRadius: 'var(--radius)',
                    padding: '12px 16px',
                    marginBottom: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <span style={{ fontWeight: 500, fontSize: '0.875rem' }}>
                        💰 Bulk Price Edit Mode — modify prices below and click Save
                    </span>
                    <button className="btn btn-primary btn-sm" onClick={handleBulkPriceSave}>
                        <Save size={14} /> Save All Prices
                    </button>
                </div>
            )}

            <div className="table-wrapper">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Variants</th>
                            <th>Availability</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <div style={{ fontWeight: 600 }}>{product.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                                        {product.variants.length} variant{product.variants.length !== 1 ? 's' : ''}
                                    </div>
                                </td>
                                <td>
                                    {product.category ? (
                                        <span className="badge badge-primary">{product.category}</span>
                                    ) : (
                                        <span style={{ color: 'var(--color-text-tertiary)' }}>—</span>
                                    )}
                                </td>
                                <td>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                        {product.variants.map(v => (
                                            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem' }}>
                                                <span style={{ color: 'var(--color-text-secondary)' }}>{v.size}</span>
                                                <span style={{ fontWeight: 600 }}>
                                                    {bulkPriceMode ? (
                                                        <input
                                                            type="number"
                                                            className="form-input"
                                                            style={{ width: '100px', padding: '4px 8px', fontSize: '0.8125rem' }}
                                                            defaultValue={v.price}
                                                            onChange={(e) => setPriceEdits(prev => ({
                                                                ...prev,
                                                                [`${product.id}|${v.id}`]: e.target.value,
                                                            }))}
                                                        />
                                                    ) : (
                                                        formatCurrency(v.price)
                                                    )}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <label className="toggle">
                                        <input
                                            type="checkbox"
                                            checked={product.available}
                                            onChange={() => toggleAvailability(product.id)}
                                        />
                                        <span className="toggle-slider"></span>
                                    </label>
                                </td>
                                <td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(product)} title="Edit">
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-icon"
                                            onClick={() => {
                                                if (confirm('Delete this product?')) deleteProduct(product.id);
                                            }}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} style={{ color: 'var(--color-danger)' }} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editProduct ? 'Edit Product' : 'Add Product'}</h3>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label className="form-label">Product Name *</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.name}
                                            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                            placeholder="e.g., Semaglutide"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={form.category}
                                            onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))}
                                            placeholder="e.g., GLP-1 Agonists"
                                            list="categories-list"
                                        />
                                        <datalist id="categories-list">
                                            {getCategories().map(cat => (
                                                <option key={cat} value={cat} />
                                            ))}
                                        </datalist>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="form-textarea"
                                        value={form.description}
                                        onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                                        placeholder="Product description..."
                                    />
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <label className="form-label" style={{ margin: 0 }}>Variants</label>
                                        <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}>
                                            <Plus size={14} /> Add Variant
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {form.variants.map((variant, idx) => (
                                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                <input
                                                    type="text"
                                                    className="form-input"
                                                    placeholder="Size (e.g., 10mg × 5 vials)"
                                                    value={variant.size}
                                                    onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                                                    style={{ flex: 2 }}
                                                    required
                                                />
                                                <input
                                                    type="number"
                                                    className="form-input"
                                                    placeholder="Price"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                                                    style={{ flex: 1 }}
                                                    required
                                                    min="0"
                                                />
                                                {form.variants.length > 1 && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-ghost btn-icon"
                                                        onClick={() => removeVariant(idx)}
                                                    >
                                                        <X size={16} style={{ color: 'var(--color-danger)' }} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    {editProduct ? 'Save Changes' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
