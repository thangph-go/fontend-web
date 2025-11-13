// File: src/services/api.ts
import axios from 'axios';

// 1. Tạo một "instance" (phiên bản) của Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api' 
});

// 2. Interceptor GỬI ĐI (Request)
// (Giữ nguyên như cũ)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 3. PHẦN MỚI: Interceptor NHẬN VỀ (Response) ---
// (Kiểm tra lỗi TRƯỚC KHI trả về cho component)
apiClient.interceptors.response.use(
  // (a) Nếu Response thành công (status 2xx), cứ trả về
  (response) => {
    return response;
  },
  // (b) Nếu Response thất bại (status 4xx, 5xx)
  (error) => {
    
    // Kiểm tra xem có phải lỗi 401 (Unauthorized) không
    if (error.response && error.response.status === 401) {
      
      // Lỗi 401: Token không hợp lệ hoặc đã hết hạn
      console.error('Lỗi 401: Token không hợp lệ hoặc đã hết hạn.');
      
      // Xóa token hỏng
      localStorage.removeItem('authToken');
      
      // "Đá" người dùng về trang login
      // Chúng ta dùng window.location.href thay vì useNavigate
      // vì file này là file service (bên ngoài React component)
      window.location.href = '/login';
    }
    
    // Đối với các lỗi khác (404, 500...), cứ ném lỗi ra
    // để component (ví dụ: HocVienPage) có thể bắt và hiển thị
    return Promise.reject(error);
  }
);
// ---------------------------------------------------

// 4. Export instance này ra để dùng chung
export default apiClient;