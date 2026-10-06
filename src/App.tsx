import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { AdminProvider } from './context/AdminContext';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import Appointment from './pages/Appointment';
import Contact from './pages/Contact';
import GalleryPage from './pages/Gallery';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ProductDetails from './pages/ProductDetails';
import Products from './pages/Products';
import Reviews from './pages/Reviews';
import Services from './pages/Services';

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="services" element={<Services />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="gallery" element={<GalleryPage />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="contact" element={<Contact />} />
          <Route path="appointment" element={<Appointment />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
        <Route path="admin" element={<Navigate to="/admin/login" replace />} />
        <Route path="admin/login" element={<AdminLogin />} />
        <Route path="admin/dashboard" element={<AdminDashboard />} />
        <Route path="admin/*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </AdminProvider>
  );
}
