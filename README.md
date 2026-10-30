# 🍽️ FOODORA – AI-Powered Food Booking Platform

> **"Good Food. Great Mood."**  
> A modern, premium-quality food ordering web application developed for the **Data and Technology Hackathon**.

---

## 🌟 Key Features

1. **Intuitive Food Discovery & Home Page**
   - Hero banner with quick navigation actions.
   - Popular cuisine categories (Indian, Chinese, Italian, Fast Food, Desserts, Beverages).
   - Dynamic Best Sellers & Trending Dishes showcases.
   - Special promo coupon offers (`WELCOME20`, `FREEDEL`, `SWEET3`).
   - Customer community testimonials & feature trust badges.

2. **Rich Explore Menu**
   - Real-time search by dish title and description.
   - Cuisine filter tabs & Dietary toggle (**🟢 Veg** / **🔴 Non-Veg**).
   - Sorting options: Price (Low to High, High to Low) & Customer Rating.
   - Responsive food cards with prep time, price in ₹, rating, and interactive quantity selectors (`+` / `-`).

3. **AI Food Recommendation Engine**
   - **"Find Your Perfect Meal"** interactive taste profiler.
   - Captures user diet (Veg/Non-Veg/Both), Cuisine, Budget bracket, Taste preference (Spicy/Mild/Sweet/Healthy), and Meal timing.
   - Rule-based scoring engine with simulated AI processing animation.
   - Displays match explanations (e.g. *"Matches your vegetarian preference · Mild flavour you love"*).
   - Modular service architecture isolated in `recommendationService.js`, ready for plug-and-play LLM/AI model integration.

4. **Dynamic Shopping Cart & Bill Calculator**
   - Real-time bill breakdown: Subtotal, Delivery Fee (Free on orders above ₹299), 5% Taxes, and Grand Total.
   - Inline quantity increments, decrements, and removal with instant recalculation.
   - Empty state with CTA to explore the menu.
   - LocalStorage persistence across page refreshes.

5. **Smooth Checkout Experience**
   - Form validation for Customer Name, 10-digit Indian Mobile Number, and Delivery Address.
   - Special cooking/delivery instructions field.
   - Live order summary inspection.

6. **Order Confirmation with Dynamic Order ID**
   - Generates unique tracking identifier format (e.g., `FOOD-A3B7K2`).
   - Displays estimated kitchen preparation and delivery times.
   - Complete itemized breakdown and delivery details.

7. **My Orders & History**
   - Persistent demo order history stored in LocalStorage.
   - Expandable order receipt cards with date, time, status, and itemized bills.
   - Empty state for new users.

---

## 🏗️ Project Architecture

```
FOODORA/
├── public/
├── src/
│   ├── assets/              # Static assets
│   ├── components/          # Reusable UI components
│   │   ├── CartItem.jsx
│   │   ├── CategoryFilter.jsx
│   │   ├── FoodCard.jsx
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   ├── RecommendationCard.jsx
│   │   └── Toast.jsx
│   ├── context/             # Global state
│   │   └── CartContext.jsx  # Cart state, quantities & toast notifications
│   ├── data/                # Mock food dataset
│   │   └── foodData.js      # 26 realistic Indian & global dishes
│   ├── pages/               # Application views
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── MyOrders.jsx
│   │   ├── OrderConfirmation.jsx
│   │   └── Recommendations.jsx
│   ├── services/            # API & business logic layer
│   │   ├── apiConfig.js     # Centralized backend endpoint definitions
│   │   ├── foodService.js   # Asynchronous food data provider
│   │   ├── orderService.js  # Order creation & history repository
│   │   └── recommendationService.js # AI/rule-based scoring engine
│   ├── utils/               # Helpers
│   │   ├── billCalculator.js
│   │   └── generateOrderId.js
│   ├── App.jsx              # Routing & application shell
│   ├── index.css            # Tailwind CSS & design tokens
│   └── main.jsx             # React entrypoint
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Visual Identity & Design System

- **Primary Color:** `#FF6B35` (Warm Energetic Orange)
- **Secondary Color:** `#FFB347` (Golden Amber)
- **Background:** `#FFF9F3` (Soft Warm Cream)
- **Card Background:** `#FFFFFF` (Clean Pure White)
- **Text:** `#242424` (Deep Charcoal)
- **Typography:** Poppins & Inter (Google Fonts)

---

## 🚀 Future Backend & AI Integration Readiness

The application is structured to easily connect with a **Spring Boot REST API** and **MySQL database**:

- Centralized API configuration is located in `src/services/apiConfig.js`.
- Food queries are abstracted in `src/services/foodService.js` (mimicking `GET /api/foods`, `GET /api/categories`).
- Order placement is handled asynchronously in `src/services/orderService.js` (ready for `POST /api/orders`).
- AI recommendations are decoupled in `src/services/recommendationService.js` (ready to query `POST /api/recommendations` backed by Gemini or any LLM without changing UI code).

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## 🏆 Hackathon Notes
- **Theme:** Data and Technology
- **Frontend Only:** Runs fully client-side with persistent LocalStorage state.
- **Responsive:** Designed for mobile, tablet, and desktop viewports.
