import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:5100/api",
});

api.defaults.headers.common.Authorization =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoic2t5b3BzIiwiaWF0IjoxNzg3MDYxOTA3LCJleHAiOjE3ODcwNjU1MDd9.js9CaUEWY-vaR-x2OjoBLqntdS1Opyii7kRgXhnLdVQ";
