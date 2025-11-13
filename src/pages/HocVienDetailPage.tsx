// File: src/pages/HocVienDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getHocVienById, HocVien } from '../services/hocvien.service';
import { getStudentHistory, StudentHistory } from '../services/thongke.service';

// 1. Import CSS cho Bảng và Nút bấm
import '../styles/tables.css'; 
import '../styles/forms.css';

// Import component Thông báo
import Notification from '../components/common/Notification';

// Kiểu cho State Thông báo
type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const HocVienDetailPage = () => {
  const { ma_hv } = useParams<{ ma_hv: string }>();
  const navigate = useNavigate();

  // State
  const [hocVien, setHocVien] = useState<HocVien | null>(null);
  const [history, setHistory] = useState<StudentHistory[] | null>(null);
  const [notification, setNotification] = useState<NotificationState>(null);

  // Tải dữ liệu
  useEffect(() => {
    if (!ma_hv) return; 

    const fetchData = async () => {
      try {
        setNotification(null);
        const [hvData, historyData] = await Promise.all([
          getHocVienById(ma_hv),
          getStudentHistory(ma_hv)
        ]);
        
        setHocVien(hvData || null);
        setHistory(historyData || []);

      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    };

    fetchData();
  }, [ma_hv]); 

  // Xử lý hiển thị
  if (!hocVien || !history) {
     return (
       <div>
         {notification && (
           <Notification
             message={notification.message}
             type={notification.type}
             onClose={() => setNotification(null)}
           />
         )}
         {!notification && <p>Đang tải chi tiết học viên...</p>}
         <button 
           className="form-button form-button-secondary" 
           style={{marginTop: '20px'}}
           onClick={() => navigate('/admin/hocvien')}>&larr; 
           Quay lại
         </button>
       </div>
     );
  }

  // Giao diện (JSX)
  return (
    <div>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <button 
        className="form-button form-button-secondary" 
        style={{marginBottom: '20px'}}
        onClick={() => navigate('/admin/hocvien')}>&larr; 
        Quay lại danh sách
      </button>
      
      <h2>Chi tiết Học viên: {hocVien.ho_ten}</h2>
      <p><strong>Mã HV:</strong> {hocVien.ma_hoc_vien}</p>
      <p><strong>Ngày sinh:</strong> {hocVien.ngay_sinh ? new Date(hocVien.ngay_sinh).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '(Chưa cập nhật)'}</p>
      <p><strong>Quê quán:</strong> {hocVien.ten_tinh_que_quan || '(Chưa cập nhật)'}</p>
      <p><strong>Thường trú:</strong> {hocVien.ten_tinh_thuong_tru || '(Chưa cập nhật)'}</p>

      <hr style={{border: 'none', borderTop: '3px solid #777777', margin: '20px 0'}} />
            
      {/* --- PHẦN ĐÃ SỬA: Thay <ul> bằng <table> --- */}
      <h3>Lịch sử học tập:</h3>
      {history.length === 0 ? (
        <p>Chưa tham gia khóa học nào.</p>
      ) : (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Tên Khóa Học</th>
              <th>Ngày Đăng Ký</th>
              <th>Ngày Kết Thúc</th>
              <th>Kết Quả</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <tr key={item.ma_khoa_hoc}>
                <td>{item.ten_khoa}</td>
                <td>
                  {new Date(item.ngay_dang_ky).toLocaleDateString('vi-VN', {
                    day: '2-digit', month: '2-digit', year: 'numeric' 
                  })}
                </td>
                <td>
                  {item.thoi_gian_ket_thuc 
                    ? new Date(item.thoi_gian_ket_thuc).toLocaleDateString('vi-VN', {
                        day: '2-digit', month: '2-digit', year: 'numeric' 
                      }) 
                    : '(Đang diễn ra)'}
                </td>
                <td>{item.ket_qua}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {/* ------------------------------------------- */}

    </div>
  );
};

export default HocVienDetailPage;