import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import Home from './pages/Home.jsx';
import Menu from './pages/Menu.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import MyOrders from './pages/MyOrders.jsx';
import { CartProvider, useCart } from './context/CartContext.jsx';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const { toast } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F3] text-[#242424] font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/recommendations" element={<Recommendations />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}
