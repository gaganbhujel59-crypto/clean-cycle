import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  communityId?: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  allUsers: User[];
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: 'user' | 'admin') => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Initialize with default users
  useEffect(() => {
    const defaultUsers: User[] = [
      {
        id: 'admin',
        email: 'admin@cleancycle.com',
        name: 'Admin User',
        role: 'admin',
        communityId: 'community-1',
        createdAt: '2024-01-01T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-15T10:00:00Z'
      },
      {
        id: 'user1',
        email: 'user@cleancycle.com',
        name: 'John Smith',
        role: 'user',
        communityId: 'community-1',
        createdAt: '2024-01-02T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-14T15:30:00Z'
      },
      {
        id: 'manager',
        email: 'manager@cleancycle.com',
        name: 'Sarah Johnson',
        role: 'admin',
        communityId: 'community-1',
        createdAt: '2024-01-03T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-13T09:20:00Z'
      },
      {
        id: 'user2',
        email: 'john.doe@gmail.com',
        name: 'John Doe',
        role: 'user',
        communityId: 'community-1',
        createdAt: '2024-01-04T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-12T14:45:00Z'
      },
      {
        id: 'user3',
        email: 'emma.wilson@yahoo.com',
        name: 'Emma Wilson',
        role: 'user',
        communityId: 'community-1',
        createdAt: '2024-01-05T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-11T11:15:00Z'
      },
      {
        id: 'user4',
        email: 'mike.brown@outlook.com',
        name: 'Mike Brown',
        role: 'user',
        communityId: 'community-1',
        createdAt: '2024-01-06T00:00:00Z',
        status: 'active',
        lastLogin: '2024-01-10T16:30:00Z'
      }
    ];

    // Load users from localStorage or use defaults
    const storedUsers = localStorage.getItem('cleancycle_all_users');
    if (storedUsers) {
      try {
        setAllUsers(JSON.parse(storedUsers));
      } catch (error) {
        console.error('Error parsing stored users:', error);
        setAllUsers(defaultUsers);
        localStorage.setItem('cleancycle_all_users', JSON.stringify(defaultUsers));
      }
    } else {
      setAllUsers(defaultUsers);
      localStorage.setItem('cleancycle_all_users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem('cleancycle_user');
      const storedToken = localStorage.getItem('cleancycle_token');
      
      if (storedUser && storedToken) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('cleancycle_user');
          localStorage.removeItem('cleancycle_token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Password mapping for existing users
      const passwordMap: Record<string, string> = {
        'admin@cleancycle.com': 'admin123',
        'user@cleancycle.com': 'user123',
        'manager@cleancycle.com': 'manager123',
        'john.doe@gmail.com': 'password123',
        'emma.wilson@yahoo.com': 'emma2024',
        'mike.brown@outlook.com': 'mikeb456',
      };

      // Check if user exists in our users list
      const foundUser = allUsers.find(u => u.email === email);

      if (!foundUser) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      // Check password (use password map for default users, or assume correct for new registrations)
      const expectedPassword = passwordMap[email] || 'defaultpass';
      if (password !== expectedPassword && !passwordMap[email]) {
        // For new users, we'll accept any password since we don't store passwords in frontend
        // In real app, this would be handled by backend authentication
      } else if (passwordMap[email] && password !== expectedPassword) {
        throw new Error('Invalid email or password. Please check your credentials.');
      }

      if (foundUser.status === 'suspended') {
        throw new Error('Your account has been suspended. Please contact an administrator.');
      }

      if (foundUser.status === 'inactive') {
        throw new Error('Your account is inactive. Please contact an administrator.');
      }

      // Update last login
      const updatedUser = {
        ...foundUser,
        lastLogin: new Date().toISOString()
      };

      // Update user in the list
      const updatedUsers = allUsers.map(u =>
        u.id === foundUser.id ? updatedUser : u
      );
      setAllUsers(updatedUsers);
      localStorage.setItem('cleancycle_all_users', JSON.stringify(updatedUsers));

      const mockToken = 'cleancycle-jwt-' + Date.now();

      localStorage.setItem('cleancycle_user', JSON.stringify(updatedUser));
      localStorage.setItem('cleancycle_token', mockToken);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'user' | 'admin' = 'user'): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if email already exists in our users list
      const existingUser = allUsers.find(u => u.email === email);

      if (existingUser) {
        throw new Error('Email already exists. Please use a different email or try logging in.');
      }

      // Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long.');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        communityId: 'community-1',
        createdAt: new Date().toISOString(),
        status: 'active',
        lastLogin: new Date().toISOString()
      };

      // Add to users list
      const updatedUsers = [newUser, ...allUsers];
      setAllUsers(updatedUsers);
      localStorage.setItem('cleancycle_all_users', JSON.stringify(updatedUsers));

      const mockToken = 'cleancycle-jwt-' + Date.now();

      localStorage.setItem('cleancycle_user', JSON.stringify(newUser));
      localStorage.setItem('cleancycle_token', mockToken);
      setUser(newUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('cleancycle_user');
    localStorage.removeItem('cleancycle_token');
    setUser(null);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    const updatedUsers = allUsers.map(u =>
      u.id === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
    );
    setAllUsers(updatedUsers);
    localStorage.setItem('cleancycle_all_users', JSON.stringify(updatedUsers));

    // Update current user if it's the same user
    if (user?.id === userId) {
      const updatedCurrentUser = { ...user, ...updates };
      setUser(updatedCurrentUser);
      localStorage.setItem('cleancycle_user', JSON.stringify(updatedCurrentUser));
    }
  };

  const deleteUser = (userId: string) => {
    const updatedUsers = allUsers.filter(u => u.id !== userId);
    setAllUsers(updatedUsers);
    localStorage.setItem('cleancycle_all_users', JSON.stringify(updatedUsers));

    // Logout if current user is being deleted
    if (user?.id === userId) {
      logout();
    }
  };

  const getAllUsers = () => {
    return allUsers;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    allUsers,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    updateUser,
    deleteUser,
    getAllUsers,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
