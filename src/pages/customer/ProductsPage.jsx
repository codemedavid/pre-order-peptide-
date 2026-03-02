import { useState, useMemo } from 'react';
import { useProducts } from '../../context/ProductContext';
import { useSessions } from '../../context/SessionContext';
import SessionBanner from '../../components/customer/SessionBanner';
import ProductCard from '../../components/customer/ProductCard';
import { Search, Filter } from 'lucide-react';

const ProductsPage = () => {
    const { products, getCategories } = useProducts();
    const { activeSession } = useSessions();
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = getCategories();

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            if (!p.available) return false;
            if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
            if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
            return true;
        });
    }, [products, search, selectedCategory]);

    return (
        <div>
            <SessionBanner />

            <section style={{ padding: '48px 0 80px' }}>
                <div className="container">
                    <div className="page-header">
                        <div>
                            <h1>Products</h1>
                            <p style={{ color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
                            </p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div style={{
                        display: 'flex',
                        gap: '16px',
                        marginBottom: '32px',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                    }}>
                        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '400px' }}>
                            <Search
                                size={18}
                                style={{
                                    position: 'absolute',
                                    left: '14px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: 'var(--color-text-tertiary)',
                                }}
                            />
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{ paddingLeft: '42px', width: '100%' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <button
                                className={`btn ${selectedCategory === 'all' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                onClick={() => setSelectedCategory('all')}
                            >
                                All
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {!activeSession && (
                        <div
                            className="checkout-disclaimer"
                            style={{ marginBottom: '24px' }}
                        >
                            <strong>⏳ No Active Session</strong>
                            Ordering is currently closed. Products are shown for reference only.
                            Check back when a session is active to place your pre-order.
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                <Filter size={28} />
                            </div>
                            <h3>No products found</h3>
                            <p>Try adjusting your search or filter criteria.</p>
                        </div>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProductsPage;
