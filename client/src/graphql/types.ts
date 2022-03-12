interface items {
  product: ProductType;
  quantity: number;
}
export interface UserType {
  email?: string;
  mobile?: string;
  _id?: string;
  fullname?: string;
  createdAt?: string;
  role?: string;
  orders?: OrderType[];
  shop?: ShopType[];
}
export interface ShopType {
  owner?: UserType;
  image?: string;
  _id?: string;
  name?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  avgRating?: number;
  ratings?: number[];
  orders?: OrderType[];
}
export interface ProductType {
  name: string;
  _id: string;
  inStock: boolean;
  price: number;
  image: string;
  description: string;
  shop: string;
}
export interface OrderType {
  shop?: ShopType;
  _id?: string;
  user?: string;
  placedAt?: string;
  status?: string;
  items?: items[];
  amount?: number;
}
