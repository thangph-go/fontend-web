// File: src/pages/DangKyPage.tsx
import React, { useEffect, useState } from 'react';

// Import CSS
import '../styles/forms.css';

// Import các hàm service chúng ta cần
import { getAllHocVien, HocVien } from '../services/hocvien.service';
import { getAllKhoaHoc, KhoaHoc } from '../services/khoahoc.service';
import { registerStudentToCourse } from '../services/dangky.service';

// Import component Thông báo
import Notification from '../components/common/Notification';

// Kiểu cho State Thông báo
type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

const DangKyPage = () => {
  // --- STATE ---
  const [hocVienList, setHocVienList] = useState<HocVien[]>([]);
  const [khoaHocList, setKhoaHocList] = useState<KhoaHoc[]>([]);

  const [selectedHocVien, setSelectedHocVien] = useState<string>('');
  const [selectedKhoaHoc, setSelectedKhoaHoc] = useState<string>('');

  // Thay thế state 'error' và 'success' bằng 'notification'
  const [notification, setNotification] = useState<NotificationState>(null);

  // --- TẢI DỮ LIỆU ---
  useEffect(() => {
    const loadData = async () => {
      try {
        setNotification(null);
        const [hvData, khData] = await Promise.all([
          getAllHocVien(),
          getAllKhoaHoc()
        ]);
        
        setHocVienList(hvData);
        setKhoaHocList(khData);
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    };
    loadData();
  }, []);

  // --- XỬ LÝ SUBMIT ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); // Xóa thông báo cũ

    if (!selectedHocVien || !selectedKhoaHoc) {
      setNotification({ message: 'Vui lòng chọn cả học viên và khóa học', type: 'error' });
      return;
    }

    try {
      const data = {
        ma_hoc_vien: selectedHocVien,
        ma_khoa_hoc: selectedKhoaHoc
      };
      await registerStudentToCourse(data); 

      // 3. Thông báo thành công và reset form
      setNotification({ message: 'Ghi danh học viên thành công!', type: 'success' });
      setSelectedHocVien('');
      setSelectedKhoaHoc('');
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  // --- GIAO DIỆN (JSX) ---
  return (
    <div>
      {/* Component Thông báo (sẽ tự động hiện/ẩn) */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      
      <h2>Đăng ký Khóa Học cho Học Viên</h2>
      
      <form onSubmit={handleSubmit} className="form-container">
        
        {/* Nhóm 1: Chọn Học Viên */}
        <div className="form-group">
          <label className="form-label">Chọn học viên:</label>
          <select 
            value={selectedHocVien} 
            onChange={(e) => setSelectedHocVien(e.target.value)}
            className="form-select" // <-- ÁP DỤNG CLASS
            required
          >
            <option value="">-- Chọn học viên --</option>
            {hocVienList.map((hv) => (
              <option key={hv.ma_hoc_vien} value={hv.ma_hoc_vien}>
                {hv.ho_ten} ({hv.ma_hoc_vien})
              </option>
            ))}
          </select>
        </div>

        {/* Nhóm 2: Chọn Khóa Học */}
        <div className="form-group">
          <label className="form-label">Chọn khóa học:</label>
          <select 
            value={selectedKhoaHoc} 
            onChange={(e) => setSelectedKhoaHoc(e.target.value)}
            className="form-select" // <-- ÁP DỤNG CLASS
            required
          >
            <option value="">-- Chọn khóa học --</option>
            {khoaHocList.map((kh) => (
              <option key={kh.ma_khoa_hoc} value={kh.ma_khoa_hoc}>
                {kh.ten_khoa} ({kh.ma_khoa_hoc})
              </option>
            ))}
          </select>
        </div>

        {/* Nút Bấm */}
        <button type="submit" className="form-button">Đăng ký</button>
      </form>
    </div>
  );
};

export default DangKyPage;