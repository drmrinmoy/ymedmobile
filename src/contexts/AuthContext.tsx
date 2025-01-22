import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  login: (phone: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>({
    id: 'dev-user-123',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: null,
  });
  const [loading] = useState(false);

  const signOut = async () => {
    // Implement actual sign out logic here
    console.log('Sign out clicked');
  };

  const getIdToken = async () => {
    // For development, return a mock token
    return 'dev-token-123';
  };

  const login = async (phone: string) => {
    console.log('Phone login:', phone);
  };

  const loginWithGoogle = async () => {
    console.log('Google login clicked');
  };

  const loginWithApple = async () => {
    console.log('Apple login clicked');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signOut, 
      getIdToken,
      login,
      loginWithGoogle,
      loginWithApple 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 