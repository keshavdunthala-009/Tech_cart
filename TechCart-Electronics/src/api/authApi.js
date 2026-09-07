import axiosClient from "./axiosClient";

// json-server has no real auth, so "login" = look up a user by email
// (and role, for the admin flow) and check the password client-side.

export function fetchUserByEmail(email) {
  return axiosClient.get(`/users?email=${encodeURIComponent(email)}`);
}

export function fetchUserByEmailAndRole(email, role) {
  return axiosClient.get(`/users?email=${encodeURIComponent(email)}&role=${role}`);
}

export function registerUser(user) {
  return axiosClient.post("/users", user);
}

export function fetchAllUsers() {
  return axiosClient.get("/users");
}

export function deleteUser(id) {
  return axiosClient.delete(`/users/${id}`);
}
