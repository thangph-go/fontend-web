// File: src/services/auth.service.ts
import apiClient from './api'; // 1. Import apiClient (thay vì axios)

// 2. (Không cần API_URL nữa, vì đã có trong apiClient)

interface LoginResponse {
  message: string;
  token: string;
}

export const login = async (ten_dang_nhap: string, mat_khau: string) => {
  try {
    // 3. Dùng apiClient và URL ngắn (vì đã có baseURL)
    const response = await apiClient.post<LoginResponse>(
      '/auth/login', // Chỉ cần đường dẫn tương đối
      {
        ten_dang_nhap,
        mat_khau
      }
    );
    return response.data;
  } catch (error: any) {
    // (Giữ nguyên code catch lỗi)
    if (error.response) {
      throw new Error(error.response.data.error || 'Đã có lỗi xảy ra');
    } else {
      console.error('Lỗi Axios:', error.message);
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};