// File: src/components/layout/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // 1. Kiểm tra xem token có trong localStorage không?
  const token = localStorage.getItem('authToken');

  // 2. Nếu có token, cho phép vào
  // <Outlet /> là một "cửa" đặc biệt, nó sẽ render trang con (ví dụ: DashboardPage)
  if (token) {
    return <Outlet />;
  }

  // 3. Nếu không có token, "đá" người dùng về trang /login
  return <Navigate to="/login" />;
};

export default ProtectedRoute;