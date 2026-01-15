export interface User {
  id: number;
  name: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  profilePicture?: string;
  memberSince?: string;
  membershipType?: 'standard' | 'gold' | 'premium';
  totalOrders?: number;
  totalReviews?: number;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  status: 'delivered' | 'in-transit' | 'track-order';
  orderDate: string;
  orderNumber: string;
}
