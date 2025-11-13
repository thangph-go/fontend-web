/*
 * File: hocvien.service.ts
 * Nhiệm vụ:
 * 1. Cung cấp các hàm để "nói chuyện" với API Quản lý Học Viên (/api/hocvien) của Backend.
 * 2. Định nghĩa các kiểu dữ liệu (Interface/Type) cho Học Viên.
 * 3. Gói gọn logic gọi API (sử dụng apiClient) và xử lý lỗi.
 */

import apiClient from './api';

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

/**
 * Interface (Kiểu) chính cho đối tượng Học Viên.
 * Khớp với dữ liệu Backend trả về (bao gồm cả dữ liệu JOIN từ bảng TinhThanh).
 */
export interface HocVien {
  ma_hoc_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
  deleted_at: string | null;
  ten_tinh_que_quan: string | null;  // (Từ JOIN)
  ten_tinh_thuong_tru: string | null; // (Từ JOIN)
}

/**
 * Type (Kiểu) cho dữ liệu gửi đi (req.body) khi TẠO MỚI (Create)
 * hoặc CẬP NHẬT (Update) một học viên.
 * (Không chứa ma_hoc_vien, vì mã này được Backend tự sinh khi tạo mới,
 * và được gửi qua URL (params) khi cập nhật)
 */
type HocVienDTO = {
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
};


// --- 2. CÁC HÀM GỌI API (CRUD + Search) ---

/**
 * API: GET /api/hocvien
 * Mục đích: Lấy danh sách tất cả học viên (chưa bị xóa mềm).
 */
export const getAllHocVien = async () => {
  try {
    const response = await apiClient.get<HocVien[]>('/hocvien');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải danh sách học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: GET /api/hocvien/:ma_hv
 * Mục đích: Lấy thông tin chi tiết của MỘT học viên (đã JOIN tên tỉnh).
 * @param ma_hv Mã học viên (vd: 'HV001')
 */
export const getHocVienById = async (ma_hv: string) => {
  try {
    const response = await apiClient.get<HocVien>(`/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải chi tiết học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: GET /api/hocvien/search?q=...
 * Mục đích: Tìm kiếm học viên theo tên hoặc mã.
 * @param query Từ khóa tìm kiếm (string)
 */
export const searchHocVien = async (query: string) => {
  try {
    const response = await apiClient.get<HocVien[]>('/hocvien/search', {
      params: { q: query } // Gửi 'query' dưới dạng ?q=...
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tìm kiếm học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: POST /api/hocvien
 * Mục đích: Tạo mới một học viên (Backend sẽ tự sinh mã).
 * @param hocVienData Dữ liệu học viên mới (không có ma_hoc_vien)
 */
export const createHocVien = async (hocVienData: HocVienDTO) => {
  try {
    const response = await apiClient.post('/hocvien', hocVienData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tạo học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: PUT /api/hocvien/:ma_hv
 * Mục đích: Cập nhật thông tin của một học viên.
 * @param ma_hv Mã học viên cần cập nhật
 * @param hocVienData Dữ liệu mới để cập nhật
 */
export const updateHocVien = async (ma_hv: string, hocVienData: HocVienDTO) => {
  try {
    const response = await apiClient.put(`/hocvien/${ma_hv}`, hocVienData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi cập nhật học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: DELETE /api/hocvien/:ma_hv
 * Mục đích: Xóa mềm (đánh dấu deleted_at) một học viên.
 * @param ma_hv Mã học viên cần xóa
 */
export const deleteHocVien = async (ma_hv: string) => {
  try {
    const response = await apiClient.delete(`/hocvien/${ma_hv}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi xóa học viên');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};