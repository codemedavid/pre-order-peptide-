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
            {/* Full-Screen Hero */}
            <section className="hero-fullscreen">
                <SessionBanner />
                <div className="hero-content">
                    <div className="container">
                        <h1 className="hero-title">
                            Where Purity<br />
                            <span>Meets Privilege</span>
                        </h1>
                        <p className="hero-subtitle">
                            Access premium research peptides through our exclusive group-buy program.
                            Refined quality. Strategic pricing.
                        </p>
                        <div className="hero-actions">
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
                </div>
            </section>

            {/* How It Works */}
            <section className="homepage-section">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid">
                        {[
                            {
                                icon: <Clock size={24} />,
                                title: 'Wait for a Session',
                                desc: 'We open pre-order sessions periodically. Follow us to get notified when one goes live.',
                            },
                            {
                                icon: <ShoppingCart size={24} />,
                                title: 'Place Your Order',
                                desc: 'Browse products, select your items and quantities, and checkout with full payment.',
                            },
                            {
                                icon: <Truck size={24} />,
                                title: 'Receive Your Order',
                                desc: 'After the session closes, we order in bulk and ship directly to you once ready.',
                            },
                        ].map((step, i) => (
                            <div key={i} className="step-card">
                                <div className="step-icon">
                                    {step.icon}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            {availableProducts.length > 0 && (
                <section className="homepage-section homepage-section--alt">
                    <div className="container">
                        <div className="section-header">
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
                <section className="homepage-section">
                    <div className="container">
                        <div className="notice-card">
                            <FlaskConical size={40} style={{ color: 'var(--color-primary)', marginBottom: '12px' }} />
                            <h3>No Active Session</h3>
                            <p>
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
