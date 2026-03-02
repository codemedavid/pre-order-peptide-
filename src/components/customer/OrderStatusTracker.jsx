import { Check } from 'lucide-react';
import { ORDER_STATUSES } from '../../context/OrderContext';

const OrderStatusTracker = ({ currentStatus }) => {
    const currentIndex = ORDER_STATUSES.indexOf(currentStatus);

    return (
        <div className="status-tracker">
            {ORDER_STATUSES.map((status, index) => {
                let className = 'status-step';
                if (index < currentIndex) className += ' completed';
                if (index === currentIndex) className += ' active';

                return (
                    <div key={status} className={className}>
                        <div className="status-step-dot">
                            {index < currentIndex ? (
                                <Check size={16} />
                            ) : (
                                <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{index + 1}</span>
                            )}
                        </div>
                        <span className="status-step-label">{status}</span>
                    </div>
                );
            })}
        </div>
    );
};

export default OrderStatusTracker;
