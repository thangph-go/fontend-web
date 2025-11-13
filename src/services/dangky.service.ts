/*
 * File: dangky.service.ts
 * Nhiệm vụ:
 * 1. Cung cấp các hàm để "nói chuyện" với API Nghiệp vụ Đăng Ký (/api/dangky) của Backend.
 * 2. Gói gọn logic gọi API (sử dụng apiClient đã cấu hình) và xử lý lỗi.
 */

import apiClient from './api';

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

/**
 * Interface (Kiểu) cho dữ liệu trả về của API
 * lấy danh sách học viên trong 1 khóa học.
 * (API: GET /api/dangky/khoahoc/:ma_kh)
 */
export interface EnrollmentInfo {
  ma_hoc_vien: string;
  ho_ten: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
}

/**
 * Type (Kiểu) cho dữ liệu gửi đi (req.body)
 * khi GHI DANH một học viên.
 * (API: POST /api/dangky)
 */
type RegisterDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
};

/**
 * Type (Kiểu) cho dữ liệu gửi đi (req.body)
 * khi CẬP NHẬT KẾT QUẢ.
 * (API: PUT /api/dangky)
 */
type UpdateResultDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
};


// --- 2. CÁC HÀM GỌI API (Đã được bảo vệ bởi Token) ---

/**
 * API: POST /api/dangky
 * Mục đích: Ghi danh một học viên mới vào khóa học (FR3).
 * @param data Dữ liệu gồm { ma_hoc_vien, ma_khoa_hoc }
 */
export const registerStudentToCourse = async (data: RegisterDTO) => {
  try {
    const response = await apiClient.post('/dangky', data);
    return response.data;
  } catch (error: any) {
    // Xử lý lỗi (Interceptor trong api.ts sẽ tự xử lý lỗi 401)
    if (error.response) {
      // Ném lỗi từ Backend (ví dụ: "Học viên đã đăng ký khóa này rồi")
      throw new Error(error.response.data.error || 'Lỗi khi đăng ký');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: PUT /api/dangky
 * Mục đích: Cập nhật kết quả (Đạt/Không Đạt) cho một lượt đăng ký (FR3).
 * @param data Dữ liệu gồm { ma_hoc_vien, ma_khoa_hoc, ket_qua }
 */
export const updateEnrollmentResult = async (data: UpdateResultDTO) => {
    try {
      const response = await apiClient.put('/dangky', data);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Lỗi khi cập nhật kết quả');
      } else {
        throw new Error('Không thể kết nối đến máy chủ.');
      }
    }
  };

/**
 * API: GET /api/dangky/khoahoc/:ma_kh
 * Mục đích: Lấy danh sách học viên (và kết quả) của MỘT khóa học.
 * (Dùng cho trang Cập nhật Kết quả).
 * @param ma_kh Mã khóa học (từ URL)
 */
export const getEnrollmentsByCourse = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<EnrollmentInfo[]>(`/dangky/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách đăng ký');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};