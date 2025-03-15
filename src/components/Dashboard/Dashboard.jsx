import { Row, Col, Card, Table, InputGroup, Form } from 'react-bootstrap';
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { 
  FaClipboardList, 
  FaCheckCircle, 
  FaClock,
  FaSearch
} from 'react-icons/fa';
import style from './Dashboard.module.css';
import DashboardCard from '../DashboardCard/DashboardCard';
import { useState } from 'react';  // Add this import at the top


const Dashboard = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);  // Add this state

  const recentOrders = [
    { id: '1', UserName: 'John Doe', Category: 'Skin Care', status: 'Completed', date: '2025-02-23' },
    { id: '2', UserName: 'Jane Smith', Category: 'Hair Care', status: 'Pending', date: '2025-02-23' },
    { id: '3', UserName: 'Mike Johnson', Category: 'Supplment', status: 'Completed', date: '2025-02-22' },
    { id: '4', UserName: 'Sarah Wilson', Category: 'Makeup', status: 'Pending', date: '2025-02-22' },
    { id: '5', UserName: 'Emily Davis', Category: 'Nan', status: 'Completed', date: '2025-02-22' },
  ];

  const chartData = [
    { name: 'Jan', total: 120, completed: 78, pending: 42 },
    { name: 'Feb', total: 156, completed: 89, pending: 67 },
    { name: 'Mar', total: 110, completed: 65, pending: 45 },
    { name: 'Apr', total: 135, completed: 82, pending: 53 },
    { name: 'May', total: 147, completed: 90, pending: 57 },
    { name: 'Jun', total: 125, completed: 75, pending: 50 },
  ];

  return (
    <div className={style.dashboardContainer}>
      <div className={style.dashboardHeader}>
        <h2 className={style.heading}>Careplus Control</h2>
      </div>
      
      <Row className='g-4 mb-4'>
        <Col sm={12} md={4}>
          <DashboardCard
            title="Total Orders"
            value="156"
            icon={<FaClipboardList size={24} />}
            timeframe="This Month"
            variant="primary"
          />
        </Col>
        <Col sm={12} md={4}>
          <DashboardCard
            title="Completed Orders"
            value="89"
            icon={<FaCheckCircle size={24} />}
            timeframe="This Month"
            variant="success"
          />
        </Col>
        <Col sm={12} md={4}>
          <DashboardCard
            title="Pending Orders"
            value="67"
            icon={<FaClock size={24} />}
            timeframe="Current"
            variant="warning"
          />
        </Col>
      </Row>

      <Card className={style.chartCard}>
        <Card.Header className={style.cardHeader}>
          <h5 className={style.cardTitle}>Orders Overview</h5>
        </Card.Header>
        <Card.Body className={style.chartBody}>
          <OrdersChart data={chartData} />
        </Card.Body>
      </Card>

      <Card className={style.tableCard}>
        <Card.Header className={style.cardHeader}>
          <h5 className={style.cardTitle}>Recent Orders</h5>
        </Card.Header>
        <Card.Body className={style.cardBody}>
          <div className={style.tableResponsive}>
            <Table hover className={style.table}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.UserName}</td>
                    <td>{order.Category}</td>
                    <td>
                      <span className={`${style.statusBadge} ${style[order.status.toLowerCase()]}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

const OrdersChart = ({ data }) => {
  return (
    <div className={style.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
  <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
    <defs>
    <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="5%" stopColor="#6b7bab" stopOpacity={0.7}/>
  <stop offset="95%" stopColor="#b0c4de" stopOpacity={0.1}/>
</linearGradient>

      <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.7}/>
        <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1}/>
      </linearGradient>
      <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.7}/>
        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.1}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
    <YAxis stroke="#6B7280" fontSize={12} tickFormatter={(value) => `${value}`} />
    <Tooltip 
      contentStyle={{ 
        backgroundColor: '#fff',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
      }}
    />
    <Legend verticalAlign="top" height={36} iconType="circle" />
    
    <Area type="monotone" dataKey="total" name="Total Orders" stroke="#3b4468" fill="url(#totalGradient)" strokeWidth={2} />
    <Area type="monotone" dataKey="completed" name="Completed" stroke="#4ade80" fill="url(#completedGradient)" strokeWidth={2} />
    
    
    <Area 
      type="monotone" 
      dataKey="pending" 
      name="Pending" 
      stroke="#fbbf28" 
      fill="url(#pendingGradient)" 
      strokeWidth={2} 
      animationBegin={500} 
    />
  </AreaChart>
</ResponsiveContainer>

    </div>
  );
};

export default Dashboard;