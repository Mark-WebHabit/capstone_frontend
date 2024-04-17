import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://holyangelsapi.onrender.com",
});
