// File: src/services/khoahoc.service.ts
import apiClient from './api';

// 1. Định nghĩa kiểu dữ liệu (Interface) cho KhoaHoc
// Phải khớp với CSDL và API Backend trả về
export interface KhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null; // Có thể là null
  deleted_at: string | null;
}

// 2. Kiểu dữ liệu (Type) cho Form (khi tạo/sửa)
// (Chúng ta có thể bỏ qua deleted_at)
export type KhoaHocFormData = {
  ma_khoa_hoc: string;
  ten_khoa: string;
  noi_dung: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string;
};

// 3. Hàm gọi API GET (Lấy tất cả)
export const getAllKhoaHoc = async () => {
  try {
    const response = await apiClient.get<KhoaHoc[]>('/khoahoc');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// 4. Hàm gọi API POST (Tạo mới)
export const createKhoaHoc = async (khoaHocData: KhoaHocFormData) => {
  try {
    const response = await apiClient.post('/khoahoc', khoaHocData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tạo khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// 5. Hàm gọi API PUT (Cập nhật)
export const updateKhoaHoc = async (ma_kh: string, khoaHocData: KhoaHocFormData) => {
  try {
    const response = await apiClient.put(`/khoahoc/${ma_kh}`, khoaHocData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi cập nhật khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// 6. Hàm gọi API DELETE (Xóa mềm)
export const deleteKhoaHoc = async (ma_kh: string) => {
  try {
    const response = await apiClient.delete(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi xóa khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// Hàm gọi API GET (Lấy MỘT khóa học)
// (API: GET /api/khoahoc/:ma_kh)
export const getKhoaHocById = async (ma_kh: string) => {
  try {
    const response = await apiClient.get<KhoaHoc>(`/khoahoc/${ma_kh}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải chi tiết khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};