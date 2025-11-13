/*
 * File: thongke.service.ts
 * Nhiệm vụ:
 * 1. Cung cấp các hàm để "nói chuyện" với API Thống Kê (/api/thongke) của Backend.
 * 2. Định nghĩa các kiểu dữ liệu (Interface) cho các loại báo cáo.
 * 3. Gói gọn logic gọi API (sử dụng apiClient) và xử lý lỗi.
 */

import apiClient from './api';

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES/INTERFACES) ---

/**
 * Interface (Kiểu) cho dữ liệu Thống kê Tổng quan (Dashboard)
 * (API: GET /api/thongke/dashboard)
 */
export interface DashboardStats {
  totalHocVien: number;
  totalKhoaHoc: number;
  totalDangKy: number;
}

/**
 * Interface (Kiểu) cho dữ liệu Thống kê Quê quán
 * (API: GET /api/thongke/quequan)
 */
export interface StatsQueQuan {
  ma_tinh_que_quan: string;
  ten_tinh: string;
  so_luong: number;
}

/**
 * Interface (Kiểu) cho dữ liệu Thống kê Tỉnh Thường Trú
 * (API: GET /api/thongke/thuongtru)
 */
export interface StatsThuongTru {
  ma_tinh_thuong_tru: string;
  ten_tinh: string;
  so_luong: number;
}

/**
 * Interface (Kiểu) cho dữ liệu Thống kê Khóa học (theo năm)
 * (API: GET /api/thongke/khoahoc)
 */
export interface StatsKhoaHoc {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  so_luong_hoc_vien: number;
  so_luong_dat: number;
  so_luong_khong_dat: number;
}

/**
 * Interface (Kiểu) cho dữ liệu Lịch sử Học tập
 * (API: GET /api/thongke/lichsuhocvien/:ma_hv)
 */
export interface StudentHistory {
  ma_khoa_hoc: string;
  ten_khoa: string;
  thoi_gian_bat_dau: string;
  thoi_gian_ket_thuc: string | null;
  ngay_dang_ky: string;
  ket_qua: 'DAT' | 'KHONG DAT' | 'CHUA CAP NHAT';
}


// --- 2. CÁC HÀM GỌI API (Đã được bảo vệ bởi Token) ---

/**
 * API: GET /api/thongke/dashboard
 * Mục đích: Lấy 3 số liệu thống kê nhanh cho trang Tổng quan.
 */
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

/**
 * API: GET /api/thongke/quequan
 * Mục đích: Lấy thống kê số lượng học viên theo quê quán.
 */
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

/**
 * API: GET /api/thongke/thuongtru
 * Mục đích: Lấy thống kê số lượng học viên theo tỉnh thường trú.
 */
export const getStatsByThuongTru = async () => {
  try {
    const response = await apiClient.get<StatsThuongTru[]>('/thongke/thuongtru');
    return response.data;
  } catch (error: any) {
    // (SỬA LỖI: Bổ sung code xử lý lỗi bị thiếu)
    if (error.response) {
      throw new Error(error.response.data.error || 'Lỗi khi tải thống kê thường trú');
    } else {
      throw new Error('Không thể kết nối đến máy chủ.');
    }
  }
};

/**
 * API: GET /api/thongke/khoahoc?year=...
 * Mục đích: Lấy thống kê khóa học (số lượng Đạt/Không Đạt) theo năm.
 * @param year Năm cần xem (vd: 2025)
 */
export const getStatsByCourse = async (year: number) => {
  try {
    const response = await apiClient.get<StatsKhoaHoc[]>('/thongke/khoahoc', {
      params: { year } // Gửi 'year' dưới dạng query params
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

/**
 * API: GET /api/thongke/lichsuhocvien/:ma_hv
 * Mục đích: Lấy lịch sử học tập chi tiết của MỘT học viên.
 * @param ma_hv Mã học viên (vd: 'HV001')
 */
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