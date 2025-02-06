export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (token: string, userData?: User) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
} 