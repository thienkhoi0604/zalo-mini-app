import { axiosClient } from "./client";

// Example API Service - Products
export const productsApi = {
  getAll: () => axiosClient.get("/products"),
  getById: (id: string) => axiosClient.get(`/products/${id}`),
  search: (query: string) => axiosClient.get("/products/search", { params: { q: query } }),
};

// Example API Service - Cart
export const cartApi = {
  getCart: () => axiosClient.get("/cart"),
  addItem: (productId: string, quantity: number) =>
    axiosClient.post("/cart/items", { productId, quantity }),
  updateItem: (itemId: string, quantity: number) =>
    axiosClient.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => axiosClient.delete(`/cart/items/${itemId}`),
  checkout: (checkoutData: any) => axiosClient.post("/cart/checkout", checkoutData),
};

// Example API Service - Orders
export const ordersApi = {
  getAll: () => axiosClient.get("/orders"),
  getById: (id: string) => axiosClient.get(`/orders/${id}`),
  create: (orderData: any) => axiosClient.post("/orders", orderData),
  cancel: (id: string) => axiosClient.post(`/orders/${id}/cancel`),
  getStatus: (id: string) => axiosClient.get(`/orders/${id}/status`),
};

// Example API Service - User
export const userApi = {
  getProfile: () => axiosClient.get("/auth/me"),
  updateProfile: (data: any) => axiosClient.put("/auth/me", data),
  getNotifications: () => axiosClient.get("/notifications"),
  markNotificationAsRead: (id: string) => axiosClient.put(`/notifications/${id}/read`),
};

// Example API Service - Delivery
export const deliveryApi = {
  getOptions: () => axiosClient.get("/delivery/options"),
  getAddresses: () => axiosClient.get("/delivery/addresses"),
  addAddress: (addressData: any) => axiosClient.post("/delivery/addresses", addressData),
  updateAddress: (id: string, addressData: any) =>
    axiosClient.put(`/delivery/addresses/${id}`, addressData),
};
