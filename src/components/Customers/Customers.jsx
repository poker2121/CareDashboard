import React, { useState } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaDollarSign, FaCalendarAlt, FaEnvelope, FaPhone, FaEye, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { Modal } from 'react-bootstrap';
import { useCustomerContext } from '../../context/CustomerContext';
import styles from './Customers.module.css';

export default function Customers() {
  const { customers } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageSpent = customers.length > 0 
    ? (customers.reduce((acc, curr) => acc + curr.totalSpent, 0) / customers.length).toFixed(2)
    : 0;

  return (
    <div className={styles.customersContainer}>
      <div className={styles.header}>
        <div>
          <h2>Customers</h2>
          <p className={styles.subtitle}>Manage and view customer information</p>
        </div>
        <div className={styles.statsCards}>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaUser className={styles.statIcon} />
            </div>
            <div>
              <h3>{customers.length}</h3>
              <p>Total Customers</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaShoppingBag className={styles.statIcon} />
            </div>
            <div>
              <h3>{customers.reduce((acc, curr) => acc + curr.orders, 0)}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaDollarSign className={styles.statIcon} />
            </div>
            <div>
              <h3>${averageSpent}</h3>
              <p>Average Spent</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.customersTable}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Information</th>
              <th>Join Date</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer) => (
              <tr key={customer.id} className={styles.customerRow}>
                <td className={styles.customerCell}>
                  <div className={styles.customerAvatar}>
                    {customer.name.charAt(0)}
                  </div>
                  <div className={styles.customerInfo}>
                    <h4>{customer.name}</h4>
                    <span className={styles.customerLocation}>{customer.location}</span>
                  </div>
                </td>
                <td className={styles.contactCell}>
                  <div className={styles.contactInfo}>
                    <span><FaEnvelope /> {customer.email}</span>
                    <span><FaPhone /> {customer.phone}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.dateCell}>
                    <FaCalendarAlt />
                    <span>{new Date(customer.joinDate).toLocaleDateString()}</span>
                  </div>
                </td>
                <td className={styles.ordersCell}>
                  <div className={styles.orderCount}>
                    {customer.orders}
                    <span className={styles.orderLabel}>orders</span>
                  </div>
                </td>
                <td className={styles.spentCell}>
                  <div className={styles.spentAmount}>
                    ${customer.totalSpent.toLocaleString()}
                    <span className={styles.spentLabel}>lifetime</span>
                  </div>
                </td>
                <td>
                  <button 
                    className={styles.viewButton}
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowModal(true);
                    }}
                  >
                    <FaEye /> View
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
        className={styles.customerModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <div className={styles.customerDetails}>
              <div className={styles.customerHeader}>
                <div className={styles.modalAvatar}>
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3>{selectedCustomer.name}</h3>
                  <span className={styles.customerSince}>
                    Customer since {new Date(selectedCustomer.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.detailsSection}>
                <h4>Contact Information</h4>
                <div className={styles.detailRow}>
                  <FaEnvelope />
                  <span>{selectedCustomer.email}</span>
                </div>
                <div className={styles.detailRow}>
                  <FaPhone />
                  <span>{selectedCustomer.phone}</span>
                </div>
                <div className={styles.detailRow}>
                  <FaMapMarkerAlt />
                  <span>{selectedCustomer.location}</span>
                </div>
              </div>

              <div className={styles.statsSection}>
                <div className={styles.statItem}>
                  <label>Total Orders</label>
                  <span>{selectedCustomer.orders}</span>
                </div>
                <div className={styles.statItem}>
                  <label>Total Spent</label>
                  <span>${selectedCustomer.totalSpent.toLocaleString()}</span>
                </div>
                <div className={styles.statItem}>
                  <label>Average Order</label>
                  <span>
                    ${(selectedCustomer.totalSpent / selectedCustomer.orders).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
