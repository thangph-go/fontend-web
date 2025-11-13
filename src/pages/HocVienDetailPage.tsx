// File: src/pages/HocVienDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHocVienById, HocVien } from '../services/hocvien.service';
import { getStudentHistory, StudentHistory } from '../services/thongke.service';

const HocVienDetailPage = () => {
  // 1. Lấy "ma_hv" từ URL (ví dụ: /admin/hocvien/HV001)
  const { ma_hv } = useParams<{ ma_hv: string }>();
  const navigate = useNavigate();

  // 2. State để lưu dữ liệu
  const [hocVien, setHocVien] = useState<HocVien | null>(null);
  const [history, setHistory] = useState<StudentHistory[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 3. Tải dữ liệu khi trang mở
  useEffect(() => {
    if (!ma_hv) return; // Nếu không có mã, không làm gì cả

    const fetchData = async () => {
      try {
        // Tải song song cả 2 API
        const [hvData, historyData] = await Promise.all([
          getHocVienById(ma_hv),
          getStudentHistory(ma_hv)
        ]);
        
        setHocVien(hvData || null);
        setHistory(historyData || []);

      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchData();
  }, [ma_hv]); // Chạy lại nếu ma_hv thay đổi

  // 4. Xử lý hiển thị
  if (error) return <p style={{ color: 'red' }}>Lỗi: {error}</p>;
  if (!hocVien || !history) return <p>Đang tải chi tiết học viên...</p>;

  // 5. Giao diện (JSX)
  return (
    <div>
      <button 
        className="form-button form-button-secondary" 
        onClick={() => navigate('/admin/hocvien')}>&larr; 
        Quay lại danh sách
      </button>
      
      <h2>Chi tiết Học viên: {hocVien.ho_ten}</h2>
      <p><strong>Mã HV:</strong> {hocVien.ma_hoc_vien}</p>
      <p><strong>Ngày sinh:</strong> {new Date(hocVien.ngay_sinh).toLocaleDateString('vi-VN')}</p>
      
      {/* === ĐÃ SỬA THEO YÊU CẦU === */}
      <p><strong>Quê quán:</strong> {hocVien.ten_tinh_que_quan || '(Chưa cập nhật)'}</p>
      <p><strong>Thường trú:</strong> {hocVien.ten_tinh_thuong_tru || '(Chưa cập nhật)'}</p>
      {/* ============================= */}

      <hr style={{background: "#666666", height: "2px"}} />
            
      <h3>Lịch sử học tập:</h3>
      <ul>
        {history.length === 0 ? (
          <li>Chưa tham gia khóa học nào.</li>
        ) : (
          history.map(item => (
            <li key={item.ma_khoa_hoc}>
              <strong>{item.ten_khoa}</strong>
              <br />
              (Ngày ĐK: {new Date(item.ngay_dang_ky).toLocaleDateString('vi-VN')})
              {/* === ĐÃ THÊM THEO YÊU CẦU === */}
              {item.thoi_gian_ket_thuc && 
                ` - (Ngày KT: ${new Date(item.thoi_gian_ket_thuc).toLocaleDateString('vi-VN')})`
              }
              {/* ============================= */}
              <br />
              <strong>Kết quả: {item.ket_qua}</strong>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default HocVienDetailPage;