import { useState, useEffect } from 'react';
import { formatCountdown } from '../../utils/formatters';
import { useSessions } from '../../context/SessionContext';
import { Clock } from 'lucide-react';

const SessionBanner = () => {
    const { activeSession } = useSessions();
    const [countdown, setCountdown] = useState(null);

    useEffect(() => {
        if (!activeSession) return;

        const update = () => {
            setCountdown(formatCountdown(activeSession.endDate));
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [activeSession]);

    if (!activeSession || !countdown || countdown.expired) return null;

    return (
        <div className="session-banner">
            <div className="session-banner-inner">
                <div>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} />
                        {activeSession.name}
                    </h3>
                    <p>Pre-order session is live! Place your order before time runs out.</p>
                </div>
                <div className="countdown">
                    <div className="countdown-item">
                        <span className="countdown-value">{countdown.days}</span>
                        <span className="countdown-label">Days</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{countdown.hours}</span>
                        <span className="countdown-label">Hours</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{countdown.minutes}</span>
                        <span className="countdown-label">Mins</span>
                    </div>
                    <div className="countdown-item">
                        <span className="countdown-value">{countdown.seconds}</span>
                        <span className="countdown-label">Secs</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionBanner;
