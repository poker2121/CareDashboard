import  { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaCopy, FaSearch } from 'react-icons/fa';
import { Modal, Form } from 'react-bootstrap';
import { useDiscountContext } from '../../context/DiscountContext';
import styles from './Discounts.module.css';

export default function Discounts() {
  const { discounts, addDiscount, updateDiscount, deleteDiscount } = useDiscountContext();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingDiscount, setEditingDiscount] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    amount: '',
    fromDate: '',
    toDate: '',
    maxUsage: '',
    usageCount: 0,
  });

  const handleShowModal = (discount = null) => {
    if (discount) {
      setEditingDiscount(discount);
      setFormData({
        code: discount.code,
        amount: discount.amount,
        fromDate: discount.fromDate,
        toDate: discount.toDate,
        maxUsage: discount.maxUsage,
        usageCount: discount.usageCount,
      });
    } else {
      setEditingDiscount(null);
      setFormData({
        code: '',
        amount: '',
        fromDate: '',
        toDate: '',
        maxUsage: '',
        usageCount: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingDiscount) {
      updateDiscount({ ...formData, id: editingDiscount.id });
    } else {
      addDiscount({ ...formData });
    }
    setShowModal(false);
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.code && discount.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.discountsContainer}>
      <div className={styles.header}>
        <div>
          <h2>Discount Codes</h2>
          <p className={styles.subtitle}>Manage your discount codes and promotions</p>
        </div>
        <button className={styles.addButton} onClick={() => handleShowModal()}>
          <FaPlus /> Create Discount
        </button>
      </div>

      <div className={styles.searchWrapper}>
        <FaSearch className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search discounts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.discountsTable}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Value</th>
              <th>Expiry Date</th>
              <th>Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDiscounts.map((discount) => (
              <tr key={discount.id}>
                <td>
                  <div className={styles.codeCell}>
                    <span>{discount.code}</span>
                    <FaCopy 
                      className={styles.copyIcon}
                      onClick={() => navigator.clipboard.writeText(discount.code)}
                    />
                  </div>
                </td>
                <td>{discount.amount}%</td>
                <td>{discount.toDate}</td>
                <td>
                  <div className={styles.usageWrapper}>
                    <div className={styles.usageBar}>
                      <div 
                        className={styles.usageProgress}
                        style={{ width: `${(discount.usageCount / discount.maxUsage) * 100}%` }}
                      />
                    </div>
                    <span>{discount.usageCount}/{discount.maxUsage}</span>
                  </div>
                </td>
                <td>
                  <span className={styles.statusBadge}>
                    {discount.status || 'Active'}
                  </span>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button 
                      className={styles.editButton}
                      onClick={() => handleShowModal(discount)}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => deleteDiscount(discount.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        className={styles.discountModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingDiscount ? 'Edit Discount' : 'Create Discount'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Discount Code</Form.Label>
              <Form.Control
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Value (%)</Form.Label>
              <Form.Control
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>From Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.fromDate}
                onChange={(e) => setFormData({...formData, fromDate: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="datetime-local"
                value={formData.toDate}
                onChange={(e) => setFormData({...formData, toDate: e.target.value})}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type="number"
                value={formData.maxUsage}
                onChange={(e) => setFormData({...formData, maxUsage: e.target.value})}
                required
              />
            </Form.Group>

            <div className={styles.modalFooter}>
              <button 
                type="button" 
                className={styles.cancelButton}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
              >
                {editingDiscount ? 'Update' : 'Create'}
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}