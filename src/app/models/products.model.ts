export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string; // Main display image
  images: string[];
  quantity?: number;

  // Product details
  rating: number; // Optional - starts at 0 or calculated later
  totalReviews: number;
  inStock: boolean;
  stock: number; // Available quantity - required
  category: string;

  // Reviews
  reviews: Review[]; // Optional - new products have no reviews
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

// Create Product DTO - Only fields needed for new product creation
export interface CreateProductDto {
  name: string;
  description: string;
  price: number;
  image: string;
  inStock: boolean;
  stock: number;
  category: string;
}
