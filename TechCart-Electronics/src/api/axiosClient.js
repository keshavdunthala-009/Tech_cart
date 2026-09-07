import axios from "axios";

// json-server instance. Run `npm run server` to start it on port 4500.
const axiosClient = axios.create({
  baseURL: "http://localhost:4500",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
