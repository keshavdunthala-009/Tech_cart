import axiosClient from "./axiosClient";

export function createOrder(order) {
  return axiosClient.post("/orders", order);
}

export function fetchOrderById(id) {
  return axiosClient.get(`/orders/${id}`);
}

export function fetchOrdersByUser(userId) {
  return axiosClient.get(`/orders?userId=${userId}&_sort=createdAt&_order=desc`);
}

export function fetchAllOrders() {
  return axiosClient.get("/orders?_sort=createdAt&_order=desc");
}

export function updateOrderStatus(id, status) {
  return axiosClient.patch(`/orders/${id}`, { status });
}
