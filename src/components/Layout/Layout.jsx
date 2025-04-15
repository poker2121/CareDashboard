import { Container } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import styles from './Layout.module.css';
import Footer from './Footer';
const Layout = () => {
  return (
    <div className={`${styles.layoutWrapper} h-100`} style={{height: '100vh'}}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Container fluid className='h-100' style={{height: '100vh'}}>
          <Outlet />
     
        </Container>
        <Footer/>
      </div>
     
    </div>
   
  );
};

export default Layout;