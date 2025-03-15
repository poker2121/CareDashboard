
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaBox, 
  FaShoppingBag, 
  FaSprayCan, 
  FaPills,
  FaEllipsisH,
  FaArrowUp 
} from 'react-icons/fa';
import styles from './Categories.module.css';
import { Helmet } from 'react-helmet';

const Categories = () => {
  const categoryCards = [
    {
      title: 'Skin Care',
      icon: <FaSprayCan />,
      totalProducts: 45,
      activeProducts: 38,
      growth: '+12.5%',
      color: '#4f46e5'
    },
    {
      title: 'Hair Care',
      icon: <FaShoppingBag />,
      totalProducts: 32,
      activeProducts: 28,
      growth: '+8.2%',
      color: '#06b6d4'
    },
    {
      title: 'Supplements',
      icon: <FaPills />,
      totalProducts: 28,
      activeProducts: 25,
      growth: '+15.3%',
      color: '#10b981'
    },
    {
      title: 'Makeup',
      icon: <FaBox />,
      totalProducts: 35,
      activeProducts: 30,
      growth: '+10.7%',
      color: '#f59e0b'
    }
  ];

  return (
    <div className={styles.categoriesContainer}>
       <Helmet>
                
                <title>Our unique collection</title>
                
    </Helmet>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h2 className={styles.title}>Categories</h2>
            <p className={styles.subtitle}>Manage your product categories</p>
          </div>
          
        </div>
      </div>

      <Row className="g-4">
        {categoryCards.map((category, index) => (
          <Col key={index} xs={12} sm={6} lg={3}>
            <Card className={styles.categoryCard}>
              <Card.Body>
                <div className={styles.cardHeader}>
                  <div className={styles.iconWrapper} style={{ backgroundColor: `${category.color}15` }}>
                    <div className={styles.icon} style={{ color: category.color }}>
                      {category.icon}
                    </div>
                  </div>
                  <button className={styles.menuButton}>
                    <FaEllipsisH />
                  </button>
                </div>
                
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                
                <div className={styles.stats}>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Total Products</span>
                    <span className={styles.statValue}>{category.totalProducts}</span>
                  </div>
                  <div className={styles.stat}>
                    <span className={styles.statLabel}>Active</span>
                    <span className={styles.statValue}>{category.activeProducts}</span>
                  </div>
                </div>

                <div className={styles.progressBar}>
                  <div 
                    className={styles.progress} 
                    style={{ 
                      width: `${(category.activeProducts / category.totalProducts) * 100}%`,
                      backgroundColor: category.color
                    }}
                  ></div>
                </div>

                <div className={styles.growth}>
                  <FaArrowUp className={styles.growthIcon} />
                  <span>{category.growth}</span>
                  <span className={styles.growthPeriod}>this month</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Categories;
