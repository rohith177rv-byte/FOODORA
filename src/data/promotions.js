// Promotions and Coupon Codes dataset
export const initialPromotions = [
  {
    id: 'promo_1',
    code: 'WELCOME20',
    title: 'First Order Welcome Offer',
    discountType: 'PERCENTAGE', // PERCENTAGE or FIXED
    discountValue: 20, // 20%
    maxDiscount: 100,
    minOrderValue: 199,
    expiresAt: '2026-12-31',
    isActive: true,
    description: 'Get 20% off up to ₹100 on orders above ₹199',
  },
  {
    id: 'promo_2',
    code: 'FREEDEL',
    title: 'Zero Delivery Fee Promo',
    discountType: 'FIXED',
    discountValue: 30, // covers ₹30 delivery fee
    minOrderValue: 149,
    expiresAt: '2026-12-31',
    isActive: true,
    description: 'Flat ₹30 off delivery fee on orders above ₹149',
  },
  {
    id: 'promo_3',
    code: 'FESTIVE50',
    title: 'Festive Delight Discount',
    discountType: 'FIXED',
    discountValue: 50,
    minOrderValue: 299,
    expiresAt: '2026-12-31',
    isActive: true,
    description: 'Flat ₹50 instant savings on orders above ₹299',
  },
  {
    id: 'promo_4',
    code: 'TASTY10',
    title: 'Weekend 10% Munch',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    maxDiscount: 75,
    minOrderValue: 249,
    expiresAt: '2026-12-31',
    isActive: false,
    description: '10% off up to ₹75 on weekend orders',
  },
];

