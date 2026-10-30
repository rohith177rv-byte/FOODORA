import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';

// Context Providers
import { AuthProvider } from './context/AuthContext.jsx';
import { PlatformProvider } from './context/PlatformContext.jsx';
import { OrderProvider } from './context/OrderContext.jsx';
import { CartProvider, useCart } from './context/CartContext.jsx';

// Route Guards & Common Components
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import RestaurantConflictModal from './components/common/RestaurantConflictModal.jsx';

// Auth Pages
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register.jsx';
import RestaurantRegister from './pages/auth/RestaurantRegister.jsx';

// Customer Pages
import Home from './pages/Home.jsx';
import ExploreRestaurants from './pages/customer/ExploreRestaurants.jsx';
import RestaurantDetail from './pages/customer/RestaurantDetail.jsx';
import Menu from './pages/Menu.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import OrderTracking from './pages/customer/OrderTracking.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Favorites from './pages/customer/Favorites.jsx';
import Profile from './pages/customer/Profile.jsx';
import Feedback from './pages/customer/Feedback.jsx';

// Restaurant Portal Layout & Pages
import RestaurantLayout from './components/restaurant/RestaurantLayout.jsx';
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard.jsx';
import IncomingOrders from './pages/restaurant/IncomingOrders.jsx';
import OrderHistory from './pages/restaurant/OrderHistory.jsx';
import MenuManagement from './pages/restaurant/MenuManagement.jsx';
import AddFoodItem from './pages/restaurant/AddFoodItem.jsx';
import InventoryAvailability from './pages/restaurant/InventoryAvailability.jsx';
import SalesEarnings from './pages/restaurant/SalesEarnings.jsx';
import RestaurantReviews from './pages/restaurant/RestaurantReviews.jsx';
import RestaurantProfile from './pages/restaurant/RestaurantProfile.jsx';
import RestaurantFeedback from './pages/restaurant/RestaurantFeedback.jsx';

// Admin Portal Layout & Pages
import AdminLayout from './components/admin/AdminLayout.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import UserManagement from './pages/admin/UserManagement.jsx';
import RestaurantManagement from './pages/admin/RestaurantManagement.jsx';
import RestaurantApprovals from './pages/admin/RestaurantApprovals.jsx';
import OrderManagement from './pages/admin/OrderManagement.jsx';
import PaymentManagement from './pages/admin/PaymentManagement.jsx';
import FeedbackManagement from './pages/admin/FeedbackManagement.jsx';
import ReportsAnalytics from './pages/admin/ReportsAnalytics.jsx';
import PromotionsManagement from './pages/admin/PromotionsManagement.jsx';
import AdminSettings from './pages/admin/AdminSettings.jsx';

// Scroll to top helper on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Global Customer Layout wrapper
function CustomerShell() {
  const { toast } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F3] text-[#242424] font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <RestaurantConflictModal />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

// Global Portal Shell wrapper (for Restaurant & Admin toast and modals)
function PortalShell() {
  const { toast } = useCart();

  return (
    <>
      <ScrollToTop />
      <Outlet />
      {toast && <Toast message={toast.message} type={toast.type} />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PlatformProvider>
          <OrderProvider>
            <CartProvider>
              <Routes>
                {/* 1. AUTH ROUTES */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/restaurant-register" element={<RestaurantRegister />} />

                {/* 2. CUSTOMER PORTAL ROUTES */}
                <Route element={<CustomerShell />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/restaurants" element={<ExploreRestaurants />} />
                  <Route path="/restaurants/:restaurantId" element={<RestaurantDetail />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/recommendations" element={<Recommendations />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                  <Route path="/track/:orderId" element={<OrderTracking />} />
                  <Route path="/orders" element={<MyOrders />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/feedback" element={<Feedback />} />
                </Route>

                {/* 3. RESTAURANT PORTAL ROUTES (Protected) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['restaurant', 'admin']}>
                      <PortalShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/restaurant" element={<RestaurantLayout />}>
                    <Route index element={<RestaurantDashboard />} />
                    <Route path="orders" element={<IncomingOrders />} />
                    <Route path="history" element={<OrderHistory />} />
                    <Route path="menu" element={<MenuManagement />} />
                    <Route path="menu/add" element={<AddFoodItem />} />
                    <Route path="inventory" element={<InventoryAvailability />} />
                    <Route path="analytics" element={<SalesEarnings />} />
                    <Route path="reviews" element={<RestaurantReviews />} />
                    <Route path="profile" element={<RestaurantProfile />} />
                    <Route path="feedback" element={<RestaurantFeedback />} />
                  </Route>
                </Route>

                {/* 4. ADMIN PORTAL ROUTES (Protected) */}
                <Route
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <PortalShell />
                    </ProtectedRoute>
                  }
                >
                  <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="users" element={<UserManagement />} />
                    <Route path="restaurants" element={<RestaurantManagement />} />
                    <Route path="approvals" element={<RestaurantApprovals />} />
                    <Route path="orders" element={<OrderManagement />} />
                    <Route path="payments" element={<PaymentManagement />} />
                    <Route path="feedback" element={<FeedbackManagement />} />
                    <Route path="reports" element={<ReportsAnalytics />} />
                    <Route path="promotions" element={<PromotionsManagement />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                </Route>

                {/* 5. CATCH-ALL REDIRECT */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </CartProvider>
          </OrderProvider>
        </PlatformProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
