export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; // Main display image
  images: string[]; // Gallery images (including main)
  quantity?: number; // Cart quantity

  // Product details
  rating: number; // Average rating (0-5)
  totalReviews: number; // Total review count
  inStock: boolean; // Availability
  stock: number; // Available quantity
  category?: string; // Optional category

  // Reviews
  reviews: Review[];
}

export interface Review {
  id: number;
  reviewerName: string; // Full name (two names)
  reviewTitle: string; // Review headline
  comment: string; // Full review text
  rating: number; // Individual rating (1-5)
  date: string; // ISO date string
  verified?: boolean; // Verified purchase badge
  helpfulCount?: number; // How many found helpful
}
