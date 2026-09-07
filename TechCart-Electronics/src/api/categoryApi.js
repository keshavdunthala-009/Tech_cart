import axiosClient from "./axiosClient";

export function fetchCategories() {
  return axiosClient.get("/categories");
}
