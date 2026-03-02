import { useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useSessions } from '../../context/SessionContext';
import { ShoppingCart, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addItem } = useCart();
    const { activeSession } = useSessions();
    const [addedVariant, setAddedVariant] = useState(null);

    const handleAdd = (variant) => {
        addItem(product, variant);
        setAddedVariant(variant.id);
        setTimeout(() => setAddedVariant(null), 1500);
    };

    return (
        <div className="product-card">
            <div className="product-card-header">
                {product.category && (
                    <div className="product-card-category">{product.category}</div>
                )}
                <h3 className="product-card-name">{product.name}</h3>
                <p className="product-card-desc">{product.description}</p>
            </div>
            <div className="product-card-body">
                <div className="product-card-variants">
                    {product.variants
                        .filter(v => v.available)
                        .map(variant => (
                            <div key={variant.id} className="variant-row">
                                <span className="variant-size">{variant.size}</span>
                                <span className="variant-price">{formatCurrency(variant.price)}</span>
                                <button
                                    className={`btn ${addedVariant === variant.id ? 'btn-secondary' : 'btn-primary'} btn-sm`}
                                    onClick={() => handleAdd(variant)}
                                    disabled={!activeSession}
                                    title={!activeSession ? 'No active session' : 'Add to cart'}
                                >
                                    {addedVariant === variant.id ? (
                                        <><Check size={14} /> Added</>
                                    ) : (
                                        <><ShoppingCart size={14} /> Add</>
                                    )}
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
