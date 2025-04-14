import React, { useEffect, useState } from 'react';
import { FaBox, FaTruck, FaCheck, FaClock, FaSearch, FaFileInvoiceDollar, FaAngleDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useOrderContext } from '../../context/OrderContext';
import styles from './Orders.module.css';
import { Modal, Dropdown, Pagination, Row, Col } from 'react-bootstrap';

export default function Orders() {
  const { orders, fetchOrders, updateOrderStatus } = useOrderContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [averageOrderValue, setAverageOrderValue] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Status options
  const statusOptions = [
    'pending', 'confirmed', 'placed', 'on way', 
    'deliverd', 'cancelled', 'rejected', 'payment failed'
  ];

  // Statuses that cannot be changed
  const immutableStatuses = ["deliverd", "cancelled", "rejected"];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if(orders.length > 0) {
      setFilteredOrders(orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      setTotalRevenue(orders.reduce((sum, order) => sum + order.totalPrice, 0));
    }
  }, [orders, searchTerm]);

  useEffect(() => {
    setAverageOrderValue(orders.length > 0 ? totalRevenue / orders.length : 0);
    // Reset to first page when search changes
    setCurrentPage(1);
  }, [totalRevenue, orders, filteredOrders.length]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleStatusChange = async (orderId, newStatus) => {
    // Find the order
    const order = orders.find(o => o._id === orderId);
    
    // Check if status can be changed
    if (order && !immutableStatuses.includes(order.orderStatus.toLowerCase())) {
      await updateOrderStatus(orderId, newStatus);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'deliverd': return <FaCheck />;
      case 'on way': return <FaTruck />;
      case 'pending':
      case 'confirmed':
      case 'placed': return <FaClock />;
      case 'cancelled':
      case 'rejected':
      case 'payment failed': return <FaBox />;
      default: return <FaBox />;
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'deliverd': return styles.delivered;
      case 'on way': return styles.intransit;
      case 'pending': return styles.pending;
      case 'confirmed': 
      case 'placed': return styles.processing;
      case 'cancelled':
      case 'rejected':
      case 'payment failed': return styles.cancelled;
      default: return '';
    }
  };

  const isStatusChangeable = (status) => {
    return !immutableStatuses.includes(status.toLowerCase());
  };

  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <Pagination.Item 
        key="prev" 
        onClick={() => currentPage > 1 && paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationItem}
      >
        <FaChevronLeft />
      </Pagination.Item>
    );
    
    // Page numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4 && totalPages > 5) {
      startPage = Math.max(1, endPage - 4);
    }
    
    // First page
    if (startPage > 1) {
      items.push(
        <Pagination.Item 
          key={1} 
          active={currentPage === 1}
          onClick={() => paginate(1)}
          className={styles.paginationItem}
        >
          1
        </Pagination.Item>
      );
      
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="ellipsis1" className={styles.paginationItem} />);
      }
    }
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item 
          key={i} 
          active={currentPage === i}
          onClick={() => paginate(i)}
          className={styles.paginationItem}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="ellipsis2" className={styles.paginationItem} />);
      }
      
      items.push(
        <Pagination.Item 
          key={totalPages} 
          active={currentPage === totalPages}
          onClick={() => paginate(totalPages)}
          className={styles.paginationItem}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    // Next button
    items.push(
      <Pagination.Item 
        key="next" 
        onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationItem}
      >
        <FaChevronRight />
      </Pagination.Item>
    );
    
    return items;
  };

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.header}>
        <div>
          <h2>Orders</h2>
          <p className={styles.subtitle}>Manage and track customer orders</p>
        </div>
        <Row className={styles.statsCards}>
          <Col className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaBox />
            </div>
            <div>
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </Col>
          <Col className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaFileInvoiceDollar />
            </div>
            <div>
              <h3>${totalRevenue.toLocaleString()}</h3>
              <p>Total Revenue</p>
            </div>
          </Col>
          <Col className={styles.statCard}>
            <div className={styles.statIconWrapper}>
              <FaBox />
            </div>
            <div>
              <h3>${averageOrderValue.toFixed(2)}</h3>
              <p>Average Order Value</p>
            </div>
          </Col>
        </Row>
      </div>

      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search orders by ID, address or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.ordersTable}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Address</th>
              <th>Phone</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order._id} className={styles.orderRow}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.address}</td>
                <td>{order.phone}</td>
                <td className={styles.totalCell}>
                  ${order.totalPrice.toLocaleString()}
                </td>
                <td>
                  {isStatusChangeable(order.orderStatus) ? (
                    <Dropdown>
                      <Dropdown.Toggle 
                        variant="light" 
                        id={`dropdown-${order._id}`}
                        className={`${styles.statusDropdown} ${getStatusClass(order.orderStatus)} bg-info bg-opacity-25 rounded-pill text-primary`}
                      >
                        <span className={styles.statusText}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                        <FaAngleDown className={styles.dropdownIcon} />
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {statusOptions.map((status) => (
                          <Dropdown.Item 
                            key={status} 
                            onClick={() => handleStatusChange(order._id, status)}
                            active={order.orderStatus.toLowerCase() === status.toLowerCase()}
                          >
                            {status}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <span className={`${styles.status} ${getStatusClass(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>
                  )}
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

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            Showing {indexOfFirstOrder + 1}-{Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
          </div>
          <Pagination className={styles.pagination}>
            {renderPaginationItems()}
          </Pagination>
        </div>
      )}

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className={styles.orderDetails}>
              <div className={styles.orderInfo}>
                <h4>Order #{selectedOrder._id}</h4>
                <p className={styles.orderDate}>
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </p>
                <div className={styles.orderStatus}>
                  {isStatusChangeable(selectedOrder.orderStatus) ? (
                    <Dropdown>
                      <Dropdown.Toggle 
                        variant="light" 
                        id={`modal-dropdown-${selectedOrder._id}`}
                        className={`${styles.statusDropdown} ${getStatusClass(selectedOrder.orderStatus)}`}
                      >
                        <span className={styles.statusText}>
                          {getStatusIcon(selectedOrder.orderStatus)}
                          {selectedOrder.orderStatus}
                        </span>
                        <FaAngleDown className={styles.dropdownIcon} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {statusOptions.map((status) => (
                          <Dropdown.Item 
                            key={status} 
                            onClick={() => handleStatusChange(selectedOrder._id, status)}
                            active={selectedOrder.orderStatus.toLowerCase() === status.toLowerCase()}
                          >
                            {status}
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  ) : (
                    <span className={`${styles.status} ${getStatusClass(selectedOrder.orderStatus)}`}>
                      {getStatusIcon(selectedOrder.orderStatus)}
                      {selectedOrder.orderStatus}
                    </span>
                  )}
                </div>
              </div>
              
              <div className={styles.customerInfo}>
                <h5>Customer Information</h5>
                <p><strong>Address:</strong> {selectedOrder.address}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
              </div>
              
              <div className={styles.itemsSection}>
                <h5>Items</h5>
                <div className={styles.itemsList}>
                  {selectedOrder.products.map((item) => (
                    <div key={item._id} className={styles.itemRow}>
                      <div className={styles.itemInfo}>
                        {item.productId?.mainImage?.path && (
                          <img 
                            src={item.productId.mainImage.path} 
                            alt={item.name} 
                            className={styles.productImage}
                          />
                        )}
                        <div>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemQuantity}>x{item.quantity}</span>
                        </div>
                      </div>
                      <span className={styles.itemPrice}>${item.finalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.priceDetails}>
                  <div className={styles.priceRow}>
                    <span>Subtotal</span>
                    <span>${selectedOrder.subTotal.toFixed(2)}</span>
                  </div>
                  {selectedOrder.couponId && (
                    <div className={styles.priceRow}>
                      <span>Discount</span>
                      <span>-${(selectedOrder.subTotal - selectedOrder.totalPrice).toFixed(2)}</span>
                    </div>
                  )}
                                    <div className={styles.totalRow}>
                    <span>Total</span>
                    <span className={styles.modalTotal}>${selectedOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

