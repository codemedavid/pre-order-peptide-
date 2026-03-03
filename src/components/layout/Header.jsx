import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, FlaskConical, Menu, X, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';

const Header = () => {
    const { cartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const navLinks = [
        { to: '/', label: 'Home', end: true },
        { to: '/products', label: 'Products' },
        { to: '/research', label: 'Research' },
        { to: '/track-order', label: 'Track Order' },
    ];

    return (
        <header className="header">
            <div className="header-inner">
                {/* Logo */}
                <Link to="/" className="header-logo">
                    <div className="header-logo-icon">
                        <FlaskConical size={20} />
                    </div>
                    Pre Order Peptide
                </Link>

                {/* Desktop Nav */}
                <nav className="header-nav">
                    {navLinks.map((link) => (
                        <NavLink key={link.to} to={link.to} end={link.end || false}>
                            {link.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Desktop Cart */}
                <Link to="/cart" className="header-cart">
                    <ShoppingCart size={18} />
                    Cart
                    {cartCount > 0 && (
                        <span className="header-cart-count">{cartCount}</span>
                    )}
                </Link>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu-trigger"
                    onClick={() => setIsMenuOpen(true)}
                    aria-label="Open menu"
                >
                    <Menu size={22} />
                </button>

                {/* Mobile Overlay */}
                <div
                    className={`mobile-overlay ${isMenuOpen ? 'mobile-overlay--active' : ''}`}
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Mobile Sidebar */}
                <aside className={`mobile-sidebar ${isMenuOpen ? 'mobile-sidebar--open' : ''}`}>
                    {/* Sidebar Header */}
                    <div className="mobile-sidebar__header">
                        <Link to="/" className="mobile-sidebar__logo" onClick={() => setIsMenuOpen(false)}>
                            <div className="mobile-sidebar__logo-icon">
                                <FlaskConical size={18} />
                            </div>
                            <span>Pre Order Peptide</span>
                        </Link>
                        <button
                            className="mobile-sidebar__close"
                            onClick={() => setIsMenuOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="mobile-sidebar__divider" />

                    {/* Nav Links */}
                    <nav className="mobile-sidebar__nav">
                        {navLinks.map((link, index) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end || false}
                                className="mobile-sidebar__link"
                                onClick={() => setIsMenuOpen(false)}
                                style={{ transitionDelay: isMenuOpen ? `${index * 60 + 100}ms` : '0ms' }}
                            >
                                <span>{link.label}</span>
                                <ChevronRight size={16} className="mobile-sidebar__link-arrow" />
                            </NavLink>
                        ))}
                    </nav>

                    {/* Divider */}
                    <div className="mobile-sidebar__divider" />

                    {/* Cart in Sidebar */}
                    <Link
                        to="/cart"
                        className="mobile-sidebar__cart"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <ShoppingCart size={18} />
                        <span>Shopping Cart</span>
                        {cartCount > 0 && (
                            <span className="mobile-sidebar__cart-badge">{cartCount}</span>
                        )}
                    </Link>

                    {/* Footer */}
                    <div className="mobile-sidebar__footer">
                        <p>Premium Research Peptides</p>
                        <p className="mobile-sidebar__footer-sub">Pure · Precise · Preferential</p>
                    </div>
                </aside>
            </div>
        </header>
    );
};

export default Header;
