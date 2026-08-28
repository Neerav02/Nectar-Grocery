export interface Product {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  description: string;
  nutritionInfo: {
    calories?: string;
    weight: string;
    organic: boolean;
  };
  imageUrl: string;
  stockQuantity: number;
  isExclusive?: boolean;
  isBestSelling?: boolean;
  brand: string;
}

export interface Category {
  id: string;
  name: string;
  fillBg: string;
  borderColor: string;
  iconName: string;
  imageUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAtPrice: number;
  warning?: 'price_changed' | 'out_of_stock' | 'stock_capped' | 'unavailable';
  previousPrice?: number;
}

export interface FilterState {
  categories: string[];
  brands: string[];
  priceRanges: string[];
  dietary: string[];
  minRating: number;
}

export interface UserLocation {
  zone: string;
  area: string;
  city: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

export type TabType = 'shop' | 'explore' | 'cart' | 'favourite' | 'account';

export interface SearchApiResponse {
  results: Product[];
  query: string;
  timestamp: number;
  requestId: string;
}
