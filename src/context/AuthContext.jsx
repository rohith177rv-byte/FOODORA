import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { initialUsers } from '../data/users.js';

const AuthContext = createContext();

const USERS_STORAGE_KEY = 'foodora_users';
const AUTH_STORAGE_KEY = 'foodora_auth_user';

function loadUsers() {
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    return data ? JSON.parse(data) : initialUsers;
  } catch {
    return initialUsers;
  }
}

function loadAuthUser() {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(loadAuthUser);

  // Sync users to LocalStorage
  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  // Sync session to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [currentUser]);

  // Login handler
  const login = useCallback(
    async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      const user = users.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password. Please verify your credentials.');
      }

      if (user.status === 'SUSPENDED') {
        throw new Error('Your account has been suspended. Please contact FOODORA platform support.');
      }

      // Safe user object (do not keep plaintext password in active session state)
      const { password: _, ...safeUser } = user;
      setCurrentUser(safeUser);
      return safeUser;
    },
    [users]
  );

  // Logout handler
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  // Register customer
  const registerCustomer = useCallback(
    async ({ name, email, phone, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
      if (existing) {
        throw new Error('An account with this email address already exists.');
      }

      const newUser = {
        id: `user_cust_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: password || 'demo123',
        phone: phone.trim(),
        role: 'customer',
        status: 'ACTIVE',
        registeredAt: new Date().toISOString(),
        avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80`,
        addresses: [
          {
            id: `addr_${Date.now()}`,
            title: 'Default Address',
            address: '101, Marine Drive, Churchgate, Mumbai 400020',
            landmark: 'Near Marine Lines Station',
            isDefault: true,
          },
        ],
      };

      setUsers((prev) => [...prev, newUser]);
      const { password: _, ...safeUser } = newUser;
      setCurrentUser(safeUser);
      return safeUser;
    },
    [users]
  );

  // Update current user's profile
  const updateProfile = useCallback(
    (updates) => {
      if (!currentUser) return;
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, ...updates } : u))
      );
    },
    [currentUser]
  );

  // Demo change password
  const changePassword = useCallback(
    (oldPass, newPass) => {
      if (!currentUser) throw new Error('Not logged in');
      const user = users.find((u) => u.id === currentUser.id);
      if (!user || user.password !== oldPass) {
        throw new Error('Current password does not match.');
      }
      setUsers((prev) =>
        prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPass } : u))
      );
      return true;
    },
    [currentUser, users]
  );

  // Admin action: toggle user status (ACTIVE / SUSPENDED)
  const toggleUserStatus = useCallback((userId, newStatus) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    // If current logged in user was suspended, log them out
    setCurrentUser((current) => {
      if (current && current.id === userId && newStatus === 'SUSPENDED') {
        return null;
      }
      return current;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || null,
        isAuthenticated: !!currentUser,
        users,
        login,
        logout,
        registerCustomer,
        updateProfile,
        changePassword,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

