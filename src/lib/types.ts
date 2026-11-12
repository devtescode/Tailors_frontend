export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** A product shaped for the public website. */
export interface CatalogItem extends Product {
  id: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role?: string;
  rating?: number;
}
