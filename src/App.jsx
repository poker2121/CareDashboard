import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import Categories from './components/Categories/Categories';
import Products from './components/Products/Products';
import Blogs from './components/Blogs/Blogs';
import ProfileAdmin from './components/ProfileAdmin/ProfileAdmin';
import Orders from './components/Orders/Orders';
import Customers from './components/Customers/Customers';
import Discounts from './components/Discounts/Discounts';
import BlogProvider from './context/BlogContext';
import ProductProvider from './context/ProductContext';
import Login from './components/Login/Login';
import { DiscountProvider } from './context/DiscountContext';
import { CustomerProvider } from './context/CustomerContext';
import { OrderProvider } from './context/OrderContext';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
    <OrderProvider>
    <CustomerProvider>
    <DiscountProvider>
    <BlogProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Layout component handles protected route logic internally */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="products" element={<Products />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="profile-admin" element={<ProfileAdmin />} />
            </Route>
            
            {/* Redirect any unknown routes to login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
        </ProductProvider>
    </BlogProvider>
    </DiscountProvider>
    </CustomerProvider>
    </OrderProvider>
    </UserProvider>
  );
}

export default App;
