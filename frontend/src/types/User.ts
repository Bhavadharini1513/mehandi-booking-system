// ==========================================
// ENUM
// ==========================================

export enum UserRole {
  CUSTOMER = "customer",
  ARTIST = "artist",
  ADMIN = "admin",
}

// ==========================================
// INTERFACE
// ==========================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  role: UserRole;
}
