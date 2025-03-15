import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';
import Footer from './Footer';
const Layout = () => {
  return (
    <div className={styles.layoutWrapper}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Container fluid>
          <Outlet />
     
        </Container>
        <Footer/>
      </div>
     
    </div>
   
  );
};

export default Layout;