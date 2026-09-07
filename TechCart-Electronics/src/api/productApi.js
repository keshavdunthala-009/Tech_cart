import axiosClient from "./axiosClient";

export function fetchProducts(params = {}) {
  return axiosClient.get("/products", { params });
}

export function fetchProductsByCategory(categorySlug) {
  return axiosClient.get(`/products?categorySlug=${categorySlug}`);
}

export function fetchProductById(id) {
  return axiosClient.get(`/products/${id}`);
}

export function searchProducts(query) {
  return axiosClient.get(`/products?q=${encodeURIComponent(query)}`);
}

export function createProduct(product) {
  return axiosClient.post("/products", product);
}

export function updateProduct(id, product) {
  return axiosClient.put(`/products/${id}`, product);
}

export function deleteProduct(id) {
  return axiosClient.delete(`/products/${id}`);
}
