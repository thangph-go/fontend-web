/*
 * File: auth.service.ts
 * NhiệmD vụ:
 * 1. Cung cấp các hàm để "nói chuyện" với API Xác thực (Authentication) của Backend.
 * 2. Gói gọn logic gọi API (sử dụng apiClient đã cấu hình) và xử lý lỗi.
 */

import apiClient from './api'; // Import instance Axios đã được cấu hình

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

/**
 * Interface (Kiểu) cho dữ liệu mà API /login trả về
 * khi đăng nhập thành công.
 */
interface LoginResponse {
  message: string;
  token: string;
}

// --- 2. CÁC HÀM GỌI API ---

/**
 * Gọi API: POST /api/auth/login
 * Mục đích: Gửi tên đăng nhập và mật khẩu để xác thực.
 * @param ten_dang_nhap Tên đăng nhập của người dùng (string)
 * @param mat_khau Mật khẩu của người dùng (string, dạng chữ)
 * @returns {Promise<LoginResponse>} Một Promise chứa (message, token) nếu thành công
 * @throws {Error} Ném (throw) ra lỗi nếu API thất bại
 */
export const login = async (ten_dang_nhap: string, mat_khau: string) => {
  try {
    // 1. Gửi yêu cầu POST đến /auth/login (baseURL đã có trong apiClient)
    const response = await apiClient.post<LoginResponse>(
      '/auth/login', // Đường dẫn tương đối
      {
        // Đây là req.body gửi lên Backend
        ten_dang_nhap,
        mat_khau
      }
    );
    
    // 2. Nếu thành công (status 2xx), trả về dữ liệu (data)
    return response.data;

  } catch (error: any) {
    // 3. Xử lý Lỗi
    
    // (Lỗi 401 'Token hết hạn' sẽ được xử lý tự động bởi
    //  Interceptor trong api.ts)
    
    // Lỗi do server trả về (vd: 401 Sai mật khẩu, 500 Lỗi máy chủ)
    if (error.response) {
      throw new Error(error.response.data.error || 'Đã có lỗi xảy ra');
    } 
    // Lỗi không kết nối được server (Network Error, CORS)
    else {
      console.error('Lỗi Axios (Auth Service):', error.message);
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/*
 * (Lưu ý: Chúng ta không cần hàm 'register' ở Frontend vì
 * theo thiết kế, tài khoản được tạo nội bộ (vd: qua Postman)
 * chứ không có trang Đăng ký công khai)
 */