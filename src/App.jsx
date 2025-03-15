
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { DiscountProvider } from './context/DiscountContext';
import { CustomerProvider } from './context/CustomerContext';
import { OrderProvider } from './context/OrderContext';


function App() {
  return (
    <OrderProvider>
    <CustomerProvider>
   <DiscountProvider>
    <BlogProvider>
      <ProductProvider>
        <BrowserRouter>
          <Routes>
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
          </Routes>
        </BrowserRouter>
        </ProductProvider>
    </BlogProvider>
    </DiscountProvider>
    </CustomerProvider>
    </OrderProvider>
  );
}

export default App;
