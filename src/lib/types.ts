export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  imageURL: string;
  category?: string;
}

export interface AdminCredentials {
  email: string;
  password: string;
}
