// File: src/pages/CapNhatKetQuaPage.tsx
import React, { useEffect, useState } from 'react';

// Import CSS
import '../styles/forms.css';
import '../styles/tables.css';

// Import các service cần thiết
import { getAllKhoaHoc, KhoaHoc } from '../services/khoahoc.service';
import { 
  getEnrollmentsByCourse, 
  updateEnrollmentResult, 
  EnrollmentInfo 
} from '../services/dangky.service';

// SỬA LỖI 1: Import component Thông báo
import Notification from '../components/common/Notification';

// SỬA LỖI 2: Thêm kiểu State Thông báo
type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const CapNhatKetQuaPage = () => {
  // --- STATE ---
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<string>('');
  const [enrollments, setEnrollments] = useState<EnrollmentInfo[]>([]);
  
  // SỬA LỖI 3: Thay thế 'error' state bằng 'notification' state
  const [notification, setNotification] = useState<NotificationState>(null);
  const [loading, setLoading] = useState(false);

  // --- TẢI DANH SÁCH KHÓA HỌC (CHO DROPDOWN) ---
  useEffect(() => {
    const loadKhoaHoc = async () => {
      try {
        const data = await getAllKhoaHoc();
        setKhoaHocList(data);
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    };
    loadKhoaHoc();
  }, []);

  // --- HÀM XỬ LÝ KHI CHỌN KHÓA HỌC ---
  const handleCourseSelect = async (ma_kh: string) => {
    setSelectedKhoaHoc(ma_kh);
    setNotification(null);
    setEnrollments([]); 

    if (!ma_kh) {
      return;
    }

    setLoading(true);
    try {
      const data = await getEnrollmentsByCourse(ma_kh);
      setEnrollments(data);
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ KHI CẬP NHẬT KẾT QUẢ ---
  const handleResultChange = async (ma_hv: string, new_ket_qua: string) => {
    if (!['DAT', 'KHONG DAT', 'CHUA CAP NHAT'].includes(new_ket_qua)) return;

    try {
      await updateEnrollmentResult({
        ma_hoc_vien: ma_hv,
        ma_khoa_hoc: selectedKhoaHoc,
        ket_qua: new_ket_qua as any
      });

      // Cập nhật giao diện (state)
      setEnrollments(prevList => 
        prevList.map(item => 
          item.ma_hoc_vien === ma_hv 
            ? { ...item, ket_qua: new_ket_qua as any } 
            : item
        )
      );
      // SỬA LỖI 4: Thêm thông báo thành công
      setNotification({ message: 'Cập nhật kết quả thành công!', type: 'success' });

    } catch (err: any) {
      // SỬA LỖI 5: Thay thế alert()
      setNotification({ message: err.message, type: 'error' });
    }
  };

  // --- GIAO DIỆN (JSX) ---
  return (
    <div>
      {/* SỬA LỖI 6: Thêm Component Thông báo */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2>Cập nhật Kết quả (Cấp chứng chỉ)</h2>
      
      {/* (Xóa dòng {error} cũ) */}

      {/* Áp dụng CSS cho Form/Dropdown */}
      <div className="form-container" style={{padding: '15px'}}>
        <div className="form-group">
          <label className="form-label">Chọn khóa học để cập nhật:</label>
          <select 
            value={selectedKhoaHoc} 
            onChange={(e) => handleCourseSelect(e.target.value)}
            className="form-select"
          >
            <option value="">-- Chọn khóa học --</option>
            {khoaHocList.map((kh) => (
              <option key={kh.ma_khoa_hoc} value={kh.ma_khoa_hoc}>
                {kh.ten_khoa}
              </option>
            ))}
          </select>
        </div>
      </div>

      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
      
      {/* Áp dụng CSS cho Bảng kết quả */}
      {loading && <p>Đang tải danh sách học viên...</p>}

      {!loading && selectedKhoaHoc && (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Mã Học Viên</th>
              <th>Tên Học Viên</th>
              <th>Kết Quả (Đạt/Không Đạt)</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  Không có học viên nào trong khóa học này.
                </td>
              </tr>
            ) : (
              enrollments.map((item) => (
                <tr key={item.ma_hoc_vien}>
                  <td>{item.ma_hoc_vien}</td>
                  <td>{item.ho_ten}</td>
                  <td>
                    <select 
                      value={item.ket_qua}
                      onChange={(e) => handleResultChange(item.ma_hoc_vien, e.target.value)}
                      className="form-select"
                    >
                      <option value="CHUA CAP NHAT">Chưa Cập Nhật</option>
                      <option value="DAT">Đạt</option>
                      <option value="KHONG DAT">Không Đạt</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CapNhatKetQuaPage;