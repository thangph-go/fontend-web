// File: src/pages/KhoaHocDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 1. Import các service cần thiết
import { getKhoaHocById, KhoaHoc } from '../services/khoahoc.service';
import { getEnrollmentsByCourse, EnrollmentInfo } from '../services/dangky.service';
import '../styles/tables.css';

const KhoaHocDetailPage = () => {
  // 2. Lấy "ma_kh" (mã khóa học) từ URL
  const { ma_kh } = useParams<{ ma_kh: string }>();
  const navigate = useNavigate();

  // 3. State để lưu dữ liệu
  const [khoaHoc, setKhoaHoc] = useState<KhoaHoc | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentInfo[] | null>(null); // Danh sách học viên
  const [error, setError] = useState<string | null>(null);

  // 4. Tải dữ liệu khi trang mở
  useEffect(() => {
    if (!ma_kh) return; // Nếu không có mã, không làm gì cả

    const fetchData = async () => {
      try {
        // Tải song song cả 2 API: Chi tiết Khóa học VÀ Danh sách Đăng ký
        const [khData, enrollData] = await Promise.all([
          getKhoaHocById(ma_kh),
          getEnrollmentsByCourse(ma_kh)
        ]);
        
        setKhoaHoc(khData || null);
        setEnrollments(enrollData || []);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [ma_kh]); // Chạy lại nếu ma_kh thay đổi

  // 5. Xử lý hiển thị
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
  if (!khoaHoc || !enrollments) return <p>Đang tải chi tiết khóa học...</p>;

  // 6. Giao diện (JSX)
  return (
    <div>
      <button 
        className="form-button form-button-secondary" 
        onClick={() => navigate('/admin/khoahoc')}>&larr; 
        Quay lại danh sách
      </button>
      
      <h2>Chi tiết Khóa học: {khoaHoc.ten_khoa}</h2>
      <p><strong>Mã Khóa Học:</strong> {khoaHoc.ma_khoa_hoc}</p>
      <p><strong>Nội dung:</strong> {khoaHoc.noi_dung}</p>
      <p>
        <strong>Thời gian:</strong> 
        {new Date(khoaHoc.thoi_gian_bat_dau).toLocaleDateString('vi-VN')} - 
        {khoaHoc.thoi_gian_ket_thuc 
          ? new Date(khoaHoc.thoi_gian_ket_thuc).toLocaleDateString('vi-VN') 
          : '(Đang diễn ra)'}
      </p>
      
      <hr style={{background: "#666666", height: "2px"}} />
            
      <h3>Danh sách Học viên đã đăng ký:</h3>
      {enrollments.length === 0 ? (
        <p>Chưa có học viên nào đăng ký khóa học này.</p>
      ) : (
        <table className="styled-table" cellPadding={5}>
          <thead>
            <tr>
              <th>Mã Học Viên</th>
              <th>Tên Học Viên</th>
              <th>Kết Quả</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(item => (
              <tr key={item.ma_hoc_vien}>
                <td>{item.ma_hoc_vien}</td>
                <td>{item.ho_ten}</td>
                <td>{item.ket_qua}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default KhoaHocDetailPage;