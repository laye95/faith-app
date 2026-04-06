export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  birthdate: string | null;
  country: string | null;
  city: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}
