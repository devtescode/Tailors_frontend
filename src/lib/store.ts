import { Product } from "./types";

const STORAGE_KEY = "tailor_products";
const AUTH_KEY = "tailor_admin_token";

// Admin credentials (stored in localStorage for persistence)
const ADMIN_CRED_KEY = "tailor_admin_creds";
const DEFAULT_EMAIL = "admin@tailor.com";
const DEFAULT_PASSWORD = "admin123";

function getAdminCreds() {
  const stored = localStorage.getItem(ADMIN_CRED_KEY);
  if (stored) return JSON.parse(stored);
  return { email: DEFAULT_EMAIL, password: DEFAULT_PASSWORD };
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Royal Agbada Set",
    price: 85000,
    description: "Premium hand-embroidered Agbada with intricate gold thread detailing. Perfect for ceremonies and special occasions.",
    imageURL: "",
    category: "Men",
  },
  {
    id: "2",
    name: "Elegant Ankara Gown",
    price: 45000,
    description: "Beautifully tailored Ankara gown with modern silhouette and traditional patterns.",
    imageURL: "",
    category: "Women",
  },
  {
    id: "3",
    name: "Senator Style Kaftan",
    price: 55000,
    description: "Classic Senator-style kaftan in premium fabric with subtle embroidery.",
    imageURL: "",
    category: "Men",
  },
  {
    id: "4",
    name: "Aso Oke Bridal Set",
    price: 120000,
    description: "Exquisite handwoven Aso Oke bridal outfit with matching gele and iro.",
    imageURL: "",
    category: "Women",
  },
  {
    id: "5",
    name: "Dashiki Casual Shirt",
    price: 25000,
    description: "Vibrant Dashiki shirt with modern fit, perfect for casual and semi-formal events.",
    imageURL: "",
    category: "Men",
  },
  {
    id: "6",
    name: "Lace Blouse & Wrapper",
    price: 65000,
    description: "Premium French lace blouse paired with complementary wrapper. Timeless elegance.",
    imageURL: "",
    category: "Women",
  },
];

export function getProducts(): Product[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
  return defaultProducts;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product: Omit<Product, "id">): Product {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now().toString() };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const products = getProducts();
  const idx = products.findIndex((p) => p.id === id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...updates };
    saveProducts(products);
  }
  return products;
}

export function deleteProduct(id: string) {
  const products = getProducts().filter((p) => p.id !== id);
  saveProducts(products);
  return products;
}

export function adminLogin(email: string, password: string): boolean {
  const creds = getAdminCreds();
  if (email === creds.email && password === creds.password) {
    localStorage.setItem(AUTH_KEY, "authenticated");
    return true;
  }
  return false;
}

export function changeAdminPassword(currentPassword: string, newPassword: string): boolean {
  const creds = getAdminCreds();
  if (currentPassword !== creds.password) return false;
  localStorage.setItem(ADMIN_CRED_KEY, JSON.stringify({ ...creds, password: newPassword }));
  return true;
}

export function isAdminLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === "authenticated";
}

export function adminLogout() {
  localStorage.removeItem(AUTH_KEY);
}

export const WHATSAPP_NUMBER = "2348012345678";

export function getWhatsAppLink(product: Product): string {
  const message = `Hello, I am interested in this product:\n\nName: ${product.name}\nPrice: ₦${product.price.toLocaleString()}\n\nI would like to place an order.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
