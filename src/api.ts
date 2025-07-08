import axios from "axios";

const api = axios.create({
    // baseURL: 'https://book-store-backend-cytz.onrender.com',
    baseURL: "http://localhost:5000",
    timeout: 5000
});

// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     config.headers.Authorization =`Bearer ${token}`;
//   }
//   return config;
// }, error => Promise.reject(error));

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export default api