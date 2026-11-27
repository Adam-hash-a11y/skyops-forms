import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5100/api",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError<{ message: string }>(error)) {
      if (error.response) {
        error.message = error.response.data?.message ?? error.message;
      } else {
        error.message = "Server not reachable";
      }
    }
    return Promise.reject(error);
  },
);

export async function loginToApi() {
  const response = await api.get("/login");
  api.defaults.headers.common.Authorization = "Bearer " + response.data.token;
}
