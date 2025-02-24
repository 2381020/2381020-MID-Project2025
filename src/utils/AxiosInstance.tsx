import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
});

export default AxiosInstance;
