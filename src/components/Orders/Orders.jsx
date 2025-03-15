import React, { useState } from 'react';
import { FaBox, FaTruck, FaCheck, FaClock, FaSearch, FaFileInvoiceDollar } from 'react-icons/fa';
import { useOrderContext } from '../../context/OrderContext';
import styles from './Orders.module.css';
import { Modal } from 'react-bootstrap';

export default function Orders() {
  const { orders } = useOrderContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalRevenue / orders.length;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return <FaCheck />;
      case 'In Transit': return <FaTruck />;
      case 'Processing': return <FaClock />;
      default: return <FaBox />;
    }
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <div>
          <h2>Orders</h2>
          <p className={styles.subtitle}>Manage and track customer orders</p>
        </div>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaBox />
            </div>
            <div>
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaFileInvoiceDollar />
            </div>
            <div>
              <h3>${totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaBox />
            </div>
            <div>
              <h3>${averageOrderValue.toFixed(2)}</h3>
              <p>Average Order Value</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search orders by ID or customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Date</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className={styles.orderRow}>
                <td className={styles.customerCell}>
                  <div className={styles.customerAvatar}>{order.customer.avatar}</div>
                  <div className={styles.customerInfo}>
                    <h4>{order.customer.name}</h4>
                    <span>{order.customer.email}</span>
                  </div>
                </td>
                <td>{new Date(order.date).toLocaleDateString()}</td>
                <td className={styles.totalCell}>
                  ${order.total.toLocaleString()}
                </td>
                <td>
                  <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </span>
                </td>
                <td>
                  <button
                    className={styles.viewButton}
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowModal(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        className={styles.orderModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className={styles.orderDetails}>
              <div className={styles.orderInfo}>
                <h4>Order #{selectedOrder.id}</h4>
                <p className={styles.orderDate}>
                  {new Date(selectedOrder.date).toLocaleDateString()}
                </p>
              </div>
              
              <div className={styles.itemsSection}>
                <h5>Items</h5>
                <div className={styles.itemsList}>
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        <span className={styles.itemName}>{item.name}</span>
                        <span className={styles.itemQuantity}>x{item.quantity}</span>
                      </div>
                      <span className={styles.itemPrice}>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.modalTotal}>${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.shippingSection}>
                <h5>Shipping Address</h5>
                <p>{selectedOrder.shippingAddress}</p>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
