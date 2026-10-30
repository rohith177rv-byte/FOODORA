// Predefined demo accounts and customer data for FOODORA
// In a real application, passwords would be hashed and stored in MySQL/Spring Security.

export const initialUsers = [
  {
    id: 'user_cust_1',
    name: 'Aarav Sharma',
    email: 'customer@foodora.com',
    password: 'demo123',
    role: 'customer',
    phone: '9876543210',
    status: 'ACTIVE',
    registeredAt: '2026-01-15T10:30:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    addresses: [
      {
        id: 'addr_1',
        title: 'Home',
        address: 'Flat 402, Sunshine Heights, Linking Road, Bandra West, Mumbai 400050',
        landmark: 'Near Starbucks',
        isDefault: true,
      },
      {
        id: 'addr_2',
        title: 'Office',
        address: 'Tower 4, Horizon Tech Park, MIDC, Andheri East, Mumbai 400069',
        landmark: 'Opposite Metro Station',
        isDefault: false,
      },
    ],
  },
  {
    id: 'user_cust_2',
    name: 'Priya Verma',
    email: 'priya@example.com',
    password: 'demo123',
    role: 'customer',
    phone: '9811223344',
    status: 'ACTIVE',
    registeredAt: '2026-02-10T14:20:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    addresses: [
      {
        id: 'addr_3',
        title: 'Apartment',
        address: '12B, Palm Grove, Juhu Tara Road, Mumbai 400049',
        landmark: 'Near Sea Princess',
        isDefault: true,
      },
    ],
  },
  {
    id: 'user_cust_3',
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    password: 'demo123',
    role: 'customer',
    phone: '9845098450',
    status: 'SUSPENDED',
    registeredAt: '2026-01-28T09:15:00.000Z',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80',
    addresses: [
      {
        id: 'addr_4',
        title: 'Home',
        address: '803, Silver Arcades, Powai, Mumbai 400076',
        landmark: 'Behind Hiranandani Hospital',
        isDefault: true,
      },
    ],
  },
  {
    id: 'user_rest_1',
    name: 'Chef Rajesh Khanna',
    email: 'restaurant@foodora.com',
    password: 'demo123',
    role: 'restaurant',
    phone: '9823456789',
    restaurantId: 'rest_1',
    status: 'ACTIVE',
    registeredAt: '2025-11-20T11:00:00.000Z',
  },
  {
    id: 'user_admin_1',
    name: 'Foodora Administrator',
    email: 'admin@foodora.com',
    password: 'demo123',
    role: 'admin',
    phone: '9800011223',
    status: 'ACTIVE',
    registeredAt: '2025-10-01T08:00:00.000Z',
  },
];

