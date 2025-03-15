import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCamera } from 'react-icons/fa';
import styles from './ProfileAdmin.module.css';
import Swal from 'sweetalert2';

const ProfileAdmin = () => {
  const [profileImage, setProfileImage] = useState("https://randomuser.me/api/portraits/men/1.jpg");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        Swal.fire({
          icon: 'success',
          title: 'Profile Image Updated!',
          showConfirmButton: false,
          timer: 1500
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.heading}>Admin Profile</h2>
      
      <Card className={styles.profileCard}>
        <Card.Body>
          <div className={styles.profileHeader}>
            <div className={styles.avatarSection}>
              <div className={styles.avatarWrapper}>
                <img 
                  src={profileImage} 
                  alt="Admin" 
                  className={styles.avatar}
                />
                <label className={styles.imageUpload}>
                  <FaCamera className={styles.cameraIcon} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              </div>
              <h3 className={styles.adminName}>Admin Name</h3>
              <p className={styles.role}>System Administrator</p>
            </div>
          </div>

          <Row className="mt-4">
            <Col md={6}>
              <div className={styles.infoItem}>
                <FaUser className={styles.icon} />
                <div>
                  <p className={styles.label}>Username</p>
                  <p className={styles.value}>admin123</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.infoItem}>
                <FaEnvelope className={styles.icon} />
                <div>
                  <p className={styles.label}>Email</p>
                  <p className={styles.value}>admin@careplus.com</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.infoItem}>
                <FaPhone className={styles.icon} />
                <div>
                  <p className={styles.label}>Phone</p>
                  <p className={styles.value}>+1 234 567 890</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className={styles.infoItem}>
                <FaMapMarkerAlt className={styles.icon} />
                <div>
                  <p className={styles.label}>Location</p>
                  <p className={styles.value}>New York, USA</p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProfileAdmin;