import axios, { AxiosInstance } from "axios";

// ----------
// Create Axios client
// ----------
export const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------
// Typed helpers
// ----------

// GET request
export async function get<T>(path: string): Promise<T> {
  
    const res = await api.get<T>(path);
    return res.data;
  
}

// POST request
export async function post<T, Body = unknown>(
  path: string,
  data: Body
): Promise<T> {
  const res = await api.post<T>(path, data);
  return res.data;
}

// PATCH request
export async function patch<T, Body = unknown>(
  path: string,
  data: Body
): Promise<T> {
  const res = await api.patch<T>(path, data);
  return res.data;
}

// DELETE request
export async function remove<T>(path: string): Promise<T> {
  const res = await api.delete<T>(path);
  return res.data;
}
