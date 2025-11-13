// File: src/components/layout/AdminLayout.tsx (Bản chuẩn)
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const storedName = localStorage.getItem('username'); 
    setUserRole(role);
    setUsername(storedName);
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* 1. SIDEBAR */}
      <nav className="sidebar">
        <div className="sidebar-header">
          <img src="/logo_quan_ly_trung_tam.png" alt="Logo" className="sidebar-logo" />
          <span>Quản lý trung tâm</span>
        </div>
        
        <ul className="sidebar-nav">
          
          <li>
            <NavLink to="/admin/dashboard">
              <i className="fas fa-home"></i>
              <span>Trang chủ</span>
            </NavLink>
          </li>
          
          {userRole === 'ADMIN' && (
            <> 
              <li>
                <NavLink to="/admin/khoahoc">
                  <i className="fas fa-book"></i>
                  <span>Quản lý khóa học</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/thongke">
                  <i className="fas fa-chart-bar"></i> 
                  <span>Thống kê</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/taikhoan">
                  <i className="fas fa-users"></i>
                  <span>Quản lý tài khoản</span>
                </NavLink>
              </li>
            </>
          )}

          {userRole === 'STAFF' && (
            <>
              <li>
                <NavLink to="/admin/hocvien">
                  <i className="fas fa-user-graduate"></i>
                  <span>Quản lý học viên</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/dangky">
                  <i className="fas fa-edit"></i>
                  <span>Đăng ký khoá học</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/ketqua">
                  <i className="fas fa-tasks"></i>
                  <span>Cập nhật Kết quả</span>
                </NavLink>
              </li>
            </>
          )}

        </ul>
      </nav>

      {/* 2. KHU VỰC NỘI DUNG CHÍNH (BÊN PHẢI) */}
      <div className="main-content">
        <header className="header">
          <div className="welcome-message">
            Xin chào, <strong>{username || 'Người dùng'}</strong>
          </div>
          <button onClick={handleLogout} className="logout-button">Đăng Xuất</button>
        </header>
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;