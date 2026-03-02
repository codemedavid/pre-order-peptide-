import { Link } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useSessions } from '../../context/SessionContext';
import SessionBanner from '../../components/customer/SessionBanner';
import ProductCard from '../../components/customer/ProductCard';
import { FlaskConical, ShoppingCart, Clock, Truck, ArrowRight } from 'lucide-react';

const HomePage = () => {
    const { products } = useProducts();
    const { activeSession } = useSessions();

    const availableProducts = products.filter(p => p.available).slice(0, 6);

    return (
        <div>
            <SessionBanner />

            {/* Hero Section */}
            <section className="hero">
                <div className="container">
                    <h1>
                        Where Purity<br />
                        <span>Meets Privilege</span>
                    </h1>
                    <p>
                        Access premium research peptides through our exclusive group-buy program.
                        Refined quality. Strategic pricing.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link to="/products" className="btn btn-primary btn-lg">
                            Browse Products <ArrowRight size={18} />
                        </Link>
                        {activeSession && (
                            <Link to="/products" className="btn btn-outline btn-lg">
                                Session is Live!
                            </Link>
                        )}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section style={{ padding: '80px 0' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '48px' }}>
                        How It Works
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                        gap: '32px',
                    }}>
                        {[
                            {
                                icon: <Clock size={28} />,
                                title: 'Wait for a Session',
                                desc: 'We open pre-order sessions periodically. Follow us to get notified when one goes live.',
                            },
                            {
                                icon: <ShoppingCart size={28} />,
                                title: 'Place Your Order',
                                desc: 'Browse products, select your items and quantities, and checkout with full payment.',
                            },
                            {
                                icon: <Truck size={28} />,
                                title: 'Receive Your Order',
                                desc: 'After the session closes, we order in bulk and ship directly to you once ready.',
                            },
                        ].map((step, i) => (
                            <div
                                key={i}
                                style={{
                                    textAlign: 'center',
                                    padding: '32px 24px',
                                    background: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-lg)',
                                }}
                            >
                                <div
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        margin: '0 auto 20px',
                                        borderRadius: '50%',
                                        background: 'var(--color-primary-light)',
                                        color: 'var(--color-primary)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {step.icon}
                                </div>
                                <h3 style={{ fontSize: '1.125rem', marginBottom: '8px' }}>{step.title}</h3>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: '1.7' }}>
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {availableProducts.length > 0 && (
                <section style={{ padding: '0 0 80px' }}>
                    <div className="container">
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '32px',
                        }}>
                            <h2>Featured Products</h2>
                            <Link to="/products" className="btn btn-secondary">
                                View All <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="products-grid">
                            {availableProducts.map(product => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* No Active Session Notice */}
            {!activeSession && (
                <section style={{ padding: '0 0 80px' }}>
                    <div className="container">
                        <div
                            style={{
                                textAlign: 'center',
                                padding: '48px',
                                background: 'var(--color-primary-50)',
                                borderRadius: 'var(--radius-xl)',
                                border: '1px solid var(--color-primary-light)',
                            }}
                        >
                            <FlaskConical size={48} style={{ color: 'var(--color-primary)', marginBottom: '16px' }} />
                            <h3 style={{ marginBottom: '8px' }}>No Active Session</h3>
                            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
                                There are no active pre-order sessions right now. Check back soon or follow us for updates!
                            </p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default HomePage;
