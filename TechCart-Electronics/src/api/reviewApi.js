import axiosClient from "./axiosClient";

export function fetchReviews() {
  return axiosClient.get("/reviews");
}
