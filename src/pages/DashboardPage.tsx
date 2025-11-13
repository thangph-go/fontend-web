// File: src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';

// (Chúng ta không cần 'Link' hay 'forms.css' nữa)

// 1. Import hàm service và interface mới
import { getDashboardStats, DashboardStats } from '../services/thongke.service';

// 2. Import CSS mới
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  // 3. State để lưu trữ dữ liệu thống kê
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 4. Tải dữ liệu khi trang mở
  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setError(err.message);
      }
    };
    loadStats();
  }, []); // [] = Chạy 1 lần

  return (
    <div>
      <h1>Tổng quan</h1>
      <p>Chào mừng bạn đến với trang quản trị.</p>

      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {/* --- 5. HIỂN THỊ CÁC THẺ STAT CARD --- */}
      {stats ? (
        <div className="stat-cards-container">
          <div className="stat-card">
            <h4>Tổng số Học viên</h4>
            <p>{stats.totalHocVien}</p>
          </div>
          <div className="stat-card green">
            <h4>Tổng số Khóa học</h4>
            <p>{stats.totalKhoaHoc}</p>
          </div>
          <div className="stat-card orange">
            <h4>Tổng số Lượt Ghi Danh</h4>
            <p>{stats.totalDangKy}</p>
          </div>
        </div>
      ) : (
        <p>Đang tải số liệu thống kê...</p>
      )}
      
    </div>
  );
};

export default DashboardPage;