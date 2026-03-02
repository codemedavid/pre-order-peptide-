import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, FlaskConical, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const Header = () => {
    const { cartCount } = useCart();

    return (
        <header className="header">
            <div className="header-inner">
                <Link to="/" className="header-logo">
                    <div className="header-logo-icon">
                        <FlaskConical size={20} />
                    </div>
                    Pre Order Peptide
                </Link>

                <nav className="header-nav">
                    <NavLink to="/" end>Home</NavLink>
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/research">Research</NavLink>
                    <NavLink to="/track-order">Track Order</NavLink>
                </nav>

                <Link to="/cart" className="header-cart">
                    <ShoppingCart size={18} />
                    Cart
                    {cartCount > 0 && (
                        <span className="header-cart-count">{cartCount}</span>
                    )}
                </Link>

                <button className="header-mobile-btn">
                    <Menu size={24} />
                </button>
            </div>
        </header>
    );
};

export default Header;
