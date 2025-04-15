import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaDollarSign, FaCalendarAlt, FaEnvelope, FaPhone, FaEye, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import { Badge, Modal, Spinner } from 'react-bootstrap';
import { useCustomerContext } from '../../context/CustomerContext';
import styles from './Customers.module.css';

export default function Customers() {
  const { customers, fetchCustomers, loading } = useCustomerContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const filteredCustomers = customers.length && customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const averageSpent = customers.length > 0
    ? (customers.reduce((acc, curr) => acc + curr.totalSpent, 0) / customers.length).toFixed(2)
    : 0;

  useEffect(() => {
    fetchCustomers();
  }, []);


  return (

    <div className={styles.customersContainer}>
      {loading ? <div style={{style: '100vh'}} className=' text-center my-5 d-flex align-items-center justify-content-center'><Spinner animation="border" /></div> : <>
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
                <h3>{customers.filter(customer => customer.role === "Admin").length}</h3>
                <p>No. of Admins</p>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrapper}>
                <FaDollarSign className={styles.statIcon} />
              </div>
              <div>
                <h3>{customers.filter(customer => customer.role === "User").length}</h3>
                <p>No. Of users</p>
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
                <th>Activation</th>
                <th>Role</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 && filteredCustomers.map((customer) => (
                <tr key={customer.id} className={styles.customerRow}>
                  <td className={styles.customerCell}>
                    {customer.profilePic ? <img src={customer.profilePic} alt={customer.name} className={styles.customerAvatar} /> : <div className={styles.customerAvatar}>
                      {customer.name.charAt(0)}
                    </div>}
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
                      <Badge bg={customer.status === 'Active' ? 'success' : 'danger'}>{customer.status}</Badge>
                    </div>
                  </td>
                  <td className={styles.spentCell}>
                    <div className={styles.spentAmount}>
                      {customer.role}
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
      </>}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Customer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCustomer && (
            <div className={styles.customerDetails}>
              <div className={styles.customerHeader}>
                <div className={styles.modalAvatar + ' bg-transparent'}>
                  {selectedCustomer.profilePic ? <img src={selectedCustomer.profilePic} alt={selectedCustomer.name} className={styles.customerAvatar} /> : <div className={styles.customerAvatar}>
                    {selectedCustomer.name.charAt(0)}
                  </div>}
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
                  <label>Gender</label>
                  <span>{selectedCustomer.gender}</span>
                </div>
                <div className={styles.statItem}>
                  <label>confirmed</label>
                  <span>{selectedCustomer.confirmed}</span>
                </div>
                <div className={styles.statItem}>
                  <label>Bocked</label>
                  <span>
                    {selectedCustomer.blocked}
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
