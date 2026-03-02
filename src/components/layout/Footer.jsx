import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-inner">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>Pre Order Peptide</h3>
                        <p>
                            Premium Peptides<br />
                            Pure. Precise. Preferential.<br />
                            Join the next private group release.
                        </p>
                    </div>

                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <Link to="/">Home</Link>
                        <Link to="/products">Products</Link>
                        <Link to="/research">Research Protocols</Link>
                        <Link to="/track-order">Track Order</Link>
                    </div>

                    <div className="footer-links">
                        <h4>Support</h4>
                        <a href="mailto:support@vpeptides.com">support@vpeptides.com</a>
                        <Link to="/track-order">Order Status</Link>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Pre Order Peptide. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
