import { Card } from 'react-bootstrap';
import style from './DashboardCard.module.css';

const DashboardCard = ({ title, value, icon, timeframe, variant }) => {
  return (
    <Card className={`${style.dashboardCard} border-${variant}`}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div className={`${style.iconContainer} bg-${variant} bg-opacity-10`}>
            <span className={`text-${variant}`}>{icon}</span>
          </div>
          <div className="text-end">
            <h3 className={`${style.cardValue}`}>{value}</h3>
            <div className={`${style.cardTitle}`}>{title}</div>
            {timeframe && (
              <small className={`${style.cardTimeframe}`}>{timeframe}</small>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DashboardCard;
