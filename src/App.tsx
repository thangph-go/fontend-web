// File: src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import các component
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import AdminLayout from './components/layout/AdminLayout'; // <-- 1. Import Layout mới

// Import các trang
import DashboardPage from './pages/DashboardPage';
import HocVienPage from './pages/HocVienPage';
import HocVienDetailPage from './pages/HocVienDetailPage';
import KhoaHocPage from './pages/KhoaHocPage';
import KhoaHocDetailPage from './pages/KhoaHocDetailPage';
import DangKyPage from './pages/DangKyPage';
import CapNhatKetQuaPage from './pages/CapNhatKetQuaPage';
import ThongKePage from './pages/ThongKePage';
import QuanLyTaiKhoanPage from './pages/QuanLyTaiKhoanPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- TRANG CÔNG KHAI --- */}
        <Route path="/login" element={<LoginPage />} />

        {/* --- TRANG ĐƯỢC BẢO VỆ --- */}
        <Route element={<ProtectedRoute />}>
          
          {/* 2. Dùng AdminLayout làm route cha "bọc" tất cả các trang */}
          <Route path="/admin" element={<AdminLayout />}>
            
            {/* 3. Các trang con (dùng path tương đối, không có / ở đầu) */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="hocvien" element={<HocVienPage />} />
            <Route path="hocvien/:ma_hv" element={<HocVienDetailPage />} />
            <Route path="khoahoc" element={<KhoaHocPage />} />
            <Route path="khoahoc/:ma_kh" element={<KhoaHocDetailPage />} />
            <Route path="dangky" element={<DangKyPage />} />
            <Route path="ketqua" element={<CapNhatKetQuaPage />} />
            <Route path="thongke" element={<ThongKePage />} />
            <Route path="taikhoan" element={<QuanLyTaiKhoanPage />} />

            {/* (Nếu vào /admin, tự động chuyển đến dashboard) */}
            <Route index element={<Navigate to="dashboard" />} />
          </Route>
        
        </Route>

        {/* Tự động chuyển hướng từ trang gốc về /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;