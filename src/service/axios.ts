import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5100/api",
});

export async function loginToApi() {
  const response = await api.get("/login");
  api.defaults.headers.common.Authorization = "Bearer " + response.data.token;
}
