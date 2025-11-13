// File: src/services/hocvien.service.ts
import apiClient from './api';

// Định nghĩa kiểu dữ liệu (hãy đảm bảo khớp CSDL)
export interface HocVien {
  ma_hoc_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
  deleted_at: string | null;
  ten_tinh_que_quan: string | null; // <-- THÊM DÒNG NÀY
  ten_tinh_thuong_tru: string | null; // <-- THÊM DÒNG NÀY
}



// Hàm gọi API lấy danh sách học viên
export const getAllHocVien = async () => {
  try {
    // Interceptor sẽ tự động gắn Token vào đây
    const response = await apiClient.get<HocVien[]>('/hocvien');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải dữ liệu');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// 1. Tạo một kiểu dữ liệu (Type) cho dữ liệu gửi đi
// (Chúng ta không cần gửi ma_hoc_vien khi tạo nếu nó tự sinh,
// nhưng theo thiết kế của bạn, ma_hoc_vien là BẮT BUỘC)
type CreateHocVienDTO = {
  // ma_hoc_vien: string;
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
};

// 2. Hàm gọi API POST
export const createHocVien = async (hocVienData: CreateHocVienDTO) => {
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


// === THÊM HÀM UPDATE ===
// (Chúng ta có thể tái sử dụng CreateHocVienDTO cho dữ liệu update)
export const updateHocVien = async (ma_hv: string, hocVienData: CreateHocVienDTO) => {
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

// === THÊM HÀM DELETE ===
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

// --- THÊM HÀM MỚI NÀY ---
// Hàm gọi API GET (Lấy MỘT học viên)
// (API: GET /api/hocvien/:ma_hv)
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
// -------------------------

// (API: GET /api/hocvien/search?q=...)
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