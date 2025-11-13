import apiClient from './api';

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

// Kiểu dữ liệu (Interface) cho dữ liệu trả về (khi lấy ds đăng ký)
export interface EnrollmentInfo {
  ma_hoc_vien: string;
  ho_ten: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
}

// Kiểu dữ liệu (Type) cho data gửi đi khi ĐĂNG KÝ (POST)
type RegisterDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
};

// Kiểu dữ liệu (Type) cho data gửi đi khi CẬP NHẬT (PUT)
type UpdateResultDTO = {
  ma_hoc_vien: string;
  ma_khoa_hoc: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
};


// --- 2. CÁC HÀM GỌI API ---

/**
 * API: POST /api/dangky
 * Mục đích: Ghi danh một học viên mới vào khóa học
 */
export const registerStudentToCourse = async (data: RegisterDTO) => {
  try {
    const response = await apiClient.post('/dangky', data);
    return response.data;
  } catch (error: any) {
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
 * Mục đích: Cập nhật kết quả (Đạt/Không Đạt) cho một lượt đăng ký
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
 * Mục đích: Lấy danh sách học viên (và kết quả) của MỘT khóa học
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