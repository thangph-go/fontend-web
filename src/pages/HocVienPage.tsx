// File: src/pages/HocVienPage.tsx (ĐÃ HOÀN CHỈNH)
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/forms.css';
import '../styles/tables.css';

// Import các hàm service
import { 
  getAllHocVien, 
  createHocVien, 
  updateHocVien,
  deleteHocVien,
  searchHocVien,
  HocVien 
} from '../services/hocvien.service';
import { getAllTinhThanh, TinhThanh } from '../services/tinhthanh.service';

// Import component giao diện
import Notification from '../components/common/Notification';

// --- ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ---

type NotificationState = {
  message: string;
  type: 'success' | 'error';
} | null;

type HocVienFormData = {
  ma_hoc_vien?: string;
  ho_ten: string;
  ngay_sinh: string;
  ma_tinh_que_quan: string;
  ma_tinh_thuong_tru: string;
};

const initialFormState: HocVienFormData = {
  ma_hoc_vien: '',
  ho_ten: '',
  ngay_sinh: '',
  ma_tinh_que_quan: '',
  ma_tinh_thuong_tru: '',
};

// --- COMPONENT CHÍNH ---

const HocVienPage = () => {
  // --- CÁC STATE ---
  const [hocVienList, setHocVienList] = useState<HocVien[]>([]);
  const [tinhThanhList, setTinhThanhList] = useState<TinhThanh[]>([]);
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<HocVienFormData>(initialFormState);
  const [editingMaHV, setEditingMaHV] = useState<string | null>(null);
  
  const [notification, setNotification] = useState<NotificationState>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // (State [error, setError] đã bị XÓA BỎ)
  
  const navigate = useNavigate();

  // --- CÁC HÀM XỬ LÝ DỮ LIỆU ---

  // Hàm tải danh sách học viên
  const loadHocVien = async () => {
    try {
      const data = await getAllHocVien();
      setHocVienList(data);
    } catch (err: any) {
      // SỬA LẠI: Dùng setNotification
      setNotification({ message: err.message, type: 'error' });
    }
  };

  // Tải dữ liệu lần đầu khi trang mở
  useEffect(() => {
    const loadTinhThanh = async () => {
      try {
        const data = await getAllTinhThanh();
        setTinhThanhList(data);
      } catch (err: any) {
        // SỬA LẠI: Dùng setNotification
        setNotification({ message: err.message, type: 'error' });
      }
    };
    
    loadHocVien();
    loadTinhThanh();
  }, []); // [] = Chạy 1 lần

  // Hàm xử lý gõ/chọn trên form
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // --- CÁC HÀM XỬ LÝ SỰ KIỆN (CLICK) ---

  // Khi nhấn "Lưu" (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null); 

    try {
      if (editingMaHV) {
        // Cập nhật (Sửa)
        // (Ép kiểu formData cho đúng)
        await updateHocVien(editingMaHV, formData as HocVienFormData);
        setNotification({ message: 'Cập nhật thành công!', type: 'success' });
      } else {
        // Tạo mới (Thêm)
        const newData = {
          ho_ten: formData.ho_ten,
          ngay_sinh: formData.ngay_sinh,
          ma_tinh_que_quan: formData.ma_tinh_que_quan,
          ma_tinh_thuong_tru: formData.ma_tinh_thuong_tru
        };
        await createHocVien(newData);
        setNotification({ message: 'Thêm học viên thành công!', type: 'success' });
      }

      // --- SỬA LẠI LOGIC DỌN DẸP ---
      // Không gọi handleCancel() nữa vì nó sẽ tắt thông báo
      setShowForm(false);
      setFormData(initialFormState);
      setEditingMaHV(null);
      // -----------------------------
      
      loadHocVien();  // Tải lại danh sách
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    }
  };

  // Khi nhấn "Hủy" trên form
  const handleCancel = () => {
    setShowForm(false);
    setFormData(initialFormState);
    setEditingMaHV(null);
    setNotification(null); // Nút Hủy thì được phép tắt thông báo
  };

  // Khi nhấn "Sửa" trên danh sách
  const handleEditClick = (hv: HocVien) => {
    setNotification(null);
    setEditingMaHV(hv.ma_hoc_vien); 
    setFormData({
      ma_hoc_vien: hv.ma_hoc_vien,
      ho_ten: hv.ho_ten,
      ngay_sinh: (hv.ngay_sinh || '').split('T')[0], // Thêm || '' để phòng trường hợp null
      ma_tinh_que_quan: hv.ma_tinh_que_quan,
      ma_tinh_thuong_tru: hv.ma_tinh_thuong_tru
    });
    setShowForm(true); 
  };

  // Khi nhấn "Xóa" trên danh sách
  const handleDeleteClick = async (ma_hv: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học viên này?')) {
      try {
        setNotification(null);
        await deleteHocVien(ma_hv);
        setNotification({ message: 'Xóa học viên thành công!', type: 'success' });
        loadHocVien();
      } catch (err: any) {
        setNotification({ message: err.message, type: 'error' });
      }
    }
  };

  // Khi nhấn "Tìm kiếm"
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    try {
      if (searchTerm.trim() === '') {
        await loadHocVien();
      } else {
        const data = await searchHocVien(searchTerm);
        setHocVienList(data);
      }
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
      
      <h2>Quản lý Học viên</h2>

      {/* Header trang (Nút Thêm Mới và Thanh Tìm Kiếm) */}
      <div className="page-header">
        {!showForm && (
          <button 
            className="form-button" 
            onClick={() => {
              handleCancel(); 
              setShowForm(true);
            }}
          >
            Thêm học viên mới
          </button>
        )}
        {showForm && (
          <div></div> // Giữ chỗ để đẩy form tìm kiếm sang phải
        )}
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Tìm theo mã hoặc tên học viên..."
            className="form-input search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="form-button">Tìm kiếm</button>
        </form>
      </div>

      {/* Form Thêm Mới / Cập Nhật */}
      {showForm && (
        <form onSubmit={handleSubmit} className="form-container">
          <h3>{editingMaHV ? 'Cập nhật học viên' : 'Thêm học viên mới'}</h3>
          
          {editingMaHV && (
            <div className="form-group">
              <label className="form-label">Mã học viên:</label>
              <input
                type="text"
                name="ma_hoc_vien"
                className="form-input"
                value={formData.ma_hoc_vien}
                disabled={true}
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Họ tên:</label>
            <input
              type="text"
              name="ho_ten"
              className="form-input"
              value={formData.ho_ten}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Ngày sinh:</label>
            <input
              type="date"
              name="ngay_sinh"
              className="form-input"
              value={formData.ngay_sinh}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quê quán:</label>
            <select
              name="ma_tinh_que_quan"
              className="form-select"
              value={formData.ma_tinh_que_quan}
              onChange={handleInputChange}
            >
              <option value="">-- Chọn quê quán --</option>
              {tinhThanhList.map((tinh) => (
                <option key={tinh.ma_tinh} value={tinh.ma_tinh}>
                  {tinh.ten_tinh}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Tỉnh thường trú:</label>
            <select
              name="ma_tinh_thuong_tru"
              className="form-select"
              value={formData.ma_tinh_thuong_tru}
              onChange={handleInputChange}
            >
              <option value="">-- Chọn tỉnh thường trú --</option>
              {tinhThanhList.map((tinh) => (
                <option key={tinh.ma_tinh} value={tinh.ma_tinh}>
                  {tinh.ten_tinh}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-button">Lưu</button>
          <button type="button" onClick={handleCancel} className="form-button form-button-secondary">Hủy</button>
        </form>
      )}

      {/* Danh sách Học Viên (Bảng) */}
      <hr style={{border: 'none', borderTop: '1px solid #eee', margin: '20px 0'}} />
      <h3>Danh sách học viên</h3>

      <table className="styled-table">
        <thead>
          <tr>
            <th>Mã Học Viên</th>
            <th>Họ Tên</th>
            <th>Ngày Sinh</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {hocVienList.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center' }}>
                Không tìm thấy học viên nào.
              </td>
            </tr>
          ) : (
            hocVienList.map((hv) => (
              <tr key={hv.ma_hoc_vien}>
                <td>{hv.ma_hoc_vien}</td>
                <td>{hv.ho_ten}</td>
                {/* Thêm kiểm tra (hv.ngay_sinh ?) để phòng trường hợp null */}
                <td>{hv.ngay_sinh ? new Date(hv.ngay_sinh).toLocaleDateString('vi-VN') : '(Chưa có)'}</td>
                
                <td>
                  <button 
                    onClick={() => navigate(`/admin/hocvien/${hv.ma_hoc_vien}`)} 
                    className="form-button"
                    style={{marginRight: '5px', padding: '5px 10px'}}
                  >
                    Chi tiết
                  </button>
                  <button 
                    onClick={() => handleEditClick(hv)} 
                    className="form-button form-button-secondary"
                    style={{marginRight: '5px', padding: '5px 10px'}}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteClick(hv.ma_hoc_vien)} 
                    className="form-button" 
                    style={{backgroundColor: '#e74c3c', padding: '5px 10px'}}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HocVienPage;