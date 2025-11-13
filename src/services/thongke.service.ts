import apiClient from './api';
import '../styles/tables.css';

export interface DashboardStats {
  totalHocVien: number;
  totalKhoaHoc: number;
  totalDangKy: number;
}

// --- 1. Interface cho Thống kê Quê quán ---
export interface StatsQueQuan {
  ma_tinh_que_quan: string;
  ten_tinh: string;
  so_luong: number;
}

// --- 1. TẠO INTERFACE MỚI NÀY ---
export interface StatsThuongTru {
  ma_tinh_thuong_tru: string;
  ten_tinh: string;
  so_luong: number;
}

// --- 2. Interface cho Thống kê Khóa học ---
export interface StatsKhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  so_luong_hoc_vien: number;
  so_luong_dat: number;
  so_luong_khong_dat: number;
}

// --- 3. Interface cho Lịch sử Học tập ---
export interface StudentHistory {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  ngay_dang_ky: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
}


// --- 4. Hàm gọi API Thống kê Quê quán ---
// (API: GET /api/thongke/quequan)
export const getStatsByHometown = async () => {
  try {
    const response = await apiClient.get<StatsQueQuan[]>('/thongke/quequan');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê quê quán');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// --- 2. SỬA LẠI HÀM NÀY ---
export const getStatsByThuongTru = async () => {
  try {
    // Sửa <StatsQueQuan[]> thành <StatsThuongTru[]>
    const response = await apiClient.get<StatsThuongTru[]>('/thongke/thuongtru');
    return response.data;
  } catch (error: any) {
    // ... (Giữ nguyên code catch lỗi)
  }
};

// --- 5. Hàm gọi API Thống kê Khóa học ---
// (API: GET /api/thongke/khoahoc?year=...)
export const getStatsByCourse = async (year: number) => {
  try {
    // Gửi 'year' dưới dạng query params
    const response = await apiClient.get<StatsKhoaHoc[]>('/thongke/khoahoc', {
      params: { year } // Sẽ tự động tạo URL: .../khoahoc?year=2025
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê khóa học');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

// --- 6. Hàm gọi API Lịch sử Học tập ---
// (API: GET /api/thongke/lichsuhocvien/:ma_hv)
export const getStudentHistory = async (ma_hv: string) => {
    try {
      const response = await apiClient.get<StudentHistory[]>(`/thongke/lichsuhocvien/${ma_hv}`);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.error || 'Lỗi khi tải lịch sử học viên');
      } else {
        throw new Error('Không thể kết nối đến máy chủ.');
      }
    }
  };

  // (API: GET /api/thongke/dashboard)
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get<DashboardStats>('/thongke/dashboard');
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê dashboard');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

