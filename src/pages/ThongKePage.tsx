// File: src/pages/ThongKePage.tsx
import React, { useEffect, useState } from 'react';

// Import CSS
import '../styles/forms.css';
import '../styles/tables.css';

// Import các hàm service và kiểu dữ liệu
import {
  getStatsByHometown,
  StatsQueQuan,
  getStatsByCourse,
  StatsKhoaHoc,
  getStatsByThuongTru,
  StatsThuongTru
} from '../services/thongke.service';

const ThongKePage = () => {
  // --- STATE LƯU DỮ LIỆU TỪ API ---
  const [queQuanData, setQueQuanData] = useState<StatsQueQuan[] | null>(null);
  const [thuongTruData, setThuongTruData] = useState<StatsThuongTru[] | null>(null);
  const [khoaHocData, setKhoaHocData] = useState<StatsKhoaHoc[] | null>(null);
  
  // --- STATE CHO LỖI VÀ FORM ---
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // --- STATE LOADING (CHO TỪNG NÚT) ---
  const [loadingKhoaHoc, setLoadingKhoaHoc] = useState(false);
  const [loadingQueQuan, setLoadingQueQuan] = useState(false);
  const [loadingThuongTru, setLoadingThuongTru] = useState(false);

  // --- STATE ĐIỀU KHIỂN BẬT/TẮT ---
  const [showQueQuan, setShowQueQuan] = useState(false);
  const [showThuongTru, setShowThuongTru] = useState(false);
  const [showKhoaHoc, setShowKhoaHoc] = useState(false);
  
  // (useEffect trống, không tự động tải)
  useEffect(() => {}, []);

  // --- CÁC HÀM "TOGGLE" (BẬT/TẮT) ---

  // Hàm Tải/Ẩn Thống kê Quê quán
  const handleToggleQueQuan = async () => {
    const newShowState = !showQueQuan;
    setShowQueQuan(newShowState);
    
    if (newShowState && queQuanData === null) { // Chỉ tải nếu Bật và chưa có dữ liệu
      setLoadingQueQuan(true);
      setError(null);
      try {
        const apiData = await getStatsByHometown();
        setQueQuanData(apiData || null);
      } catch (err: any) {
        setError(err.message);
        setShowQueQuan(false); 
      } finally {
        setLoadingQueQuan(false);
      }
    }
  };

  // Hàm Tải/Ẩn Thống kê Thường trú
  const handleToggleThuongTru = async () => {
    const newShowState = !showThuongTru;
    setShowThuongTru(newShowState);

    if (newShowState && thuongTruData === null) { // Chỉ tải nếu Bật và chưa có dữ liệu
      setLoadingThuongTru(true);
      setError(null);
      try {
        const apiData = await getStatsByThuongTru();
        setThuongTruData(apiData || null);
      } catch (err: any) {
        setError(err.message);
        setShowThuongTru(false);
      } finally {
        setLoadingThuongTru(false);
      }
    }
  };
  
  // (THAY ĐỔI) Hàm Tải/Ẩn Thống kê Khóa học
  const handleToggleKhoaHoc = async () => {
    const newShowState = !showKhoaHoc;
    setShowKhoaHoc(newShowState);

    // Chỉ tải nếu là "Bật" (true)
    // (Chúng ta sẽ tải lại mỗi lần nhấn "Xem" để đảm bảo năm là mới nhất)
    if (newShowState) { 
      setLoadingKhoaHoc(true);
      setError(null);
      setKhoaHocData(null); 

      try {
        const apiData = await getStatsByCourse(selectedYear);
        setKhoaHocData(apiData);
      } catch (err: any) {
        setError(err.message);
        setShowKhoaHoc(false); // Ẩn nếu lỗi
      } finally {
        setLoadingKhoaHoc(false);
      }
    }
    // Nếu là "Tắt" (false), nó sẽ tự động ẩn bảng (ở JSX)
  };

  // --- GIAO DIỆN (JSX) ---
  return (
    <div>
      <h2>Thống kê</h2>
      {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

      {/* --- PHẦN 1: THỐNG KÊ QUÊ QUÁN --- */}
      <hr style={{background: "#888888", height: "2px"}} />
      <h3>Thống kê học viên theo Quê quán</h3>
      <button 
        onClick={handleToggleQueQuan} 
        className="form-button"
        disabled={loadingQueQuan}
      >
        {loadingQueQuan ? 'Đang tải...' : (showQueQuan ? 'Đóng' : 'Xem thống kê')}
      </button>

      {/* Bảng này CHỈ HIỂN THỊ nếu showQueQuan là true */}
      {showQueQuan && (
        <div style={{ marginTop: '10px' }}>
          {/* (Code logic hiển thị bảng Quê quán giữ nguyên) */}
          {loadingQueQuan ? <p>Đang tải dữ liệu...</p> : (
            <table className="styled-table">
              <thead><tr><th>Tên Tỉnh</th><th>Mã Tỉnh</th><th>Số Lượng</th></tr></thead>
              <tbody>
                {queQuanData && queQuanData.length > 0 ? (
                  queQuanData.map((item) => (
                    <tr key={item.ma_tinh_que_quan}>
                      <td>{item.ten_tinh}</td><td>{item.ma_tinh_que_quan}</td><td>{item.so_luong}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3}>Không có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- PHẦN 2: THỐNG KÊ TỈNH THƯỜNG TRÚ --- */}
      <hr style={{background: "#888888", height: "2px"}} />
      <h3>Thống kê học viên theo Tỉnh Thường Trú</h3>
      <button 
        onClick={handleToggleThuongTru} 
        className="form-button"
        disabled={loadingThuongTru}
      >
        {loadingThuongTru ? 'Đang tải...' : (showThuongTru ? 'Đóng' : 'Xem thống kê')}
      </button>

      {/* Bảng này CHỈ HIỂN THỊ nếu showThuongTru là true */}
      {showThuongTru && (
        <div style={{ marginTop: '10px' }}>
          {/* (Code logic hiển thị bảng Thường trú giữ nguyên) */}
          {loadingThuongTru ? <p>Đang tải dữ liệu...</p> : (
            <table className="styled-table">
              <thead><tr><th>Tên Tỉnh</th><th>Mã Tỉnh</th><th>Số Lượng</th></tr></thead>
              <tbody>
                {thuongTruData && thuongTruData.length > 0 ? (
                  thuongTruData.map((item) => (
                    <tr key={item.ma_tinh_thuong_tru}>
                      <td>{item.ten_tinh}</td><td>{item.ma_tinh_thuong_tru}</td><td>{item.so_luong}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={3}>Không có dữ liệu.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* --- PHẦN 3: THỐNG KÊ KHÓA HỌC THEO NĂM --- */}
      <hr style={{background: "#888888", height: "2px"}} />
      <h3>Thống kê Khóa học theo năm</h3>
      
      {/* (THAY ĐỔI) Bỏ <form>, dùng <div> bình thường */}
      <div className="form-container" style={{padding: '15px'}}>
        <div className="form-group" style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          <label className="form-label" style={{ marginRight: '10px', marginTop: 0 }}>Chọn năm:</label>
          <input
            type="number"
            className="form-input"
            style={{ width: '150px', marginRight: '10px', marginBottom: 0 }}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            required
          />
          {/* (THAY ĐỔI) Nút này giờ là nút Bật/Tắt */}
          <button 
            type="button" 
            className="form-button" 
            onClick={handleToggleKhoaHoc}
            disabled={loadingKhoaHoc}
          >
            {loadingKhoaHoc ? 'Đang tải...' : (showKhoaHoc ? 'Đóng' : 'Xem thống kê')}
          </button>
        </div>
      </div>

      {/* Bảng kết quả (CHỈ HIỂN THỊ nếu showKhoaHoc là true) */}
      {showKhoaHoc && (
        <div style={{ marginTop: '10px' }}>
          {/* (Code logic hiển thị bảng Khóa học giữ nguyên) */}
          {loadingKhoaHoc ? <p>Đang tải dữ liệu...</p> : (
            <table className="styled-table">
              <thead><tr><th>Mã Khóa Học</th><th>Tên Khóa Học</th><th>Tổng số Học viên</th><th>Đạt</th><th>Không Đạt</th></tr></thead>
              <tbody>
                {khoaHocData && khoaHocData.length > 0 ? (
                  khoaHocData.map((kh) => (
                    <tr key={kh.ma_khoa_hoc}>
                      <td>{kh.ma_khoa_hoc}</td><td>{kh.ten_khoa}</td><td>{kh.so_luong_hoc_vien}</td><td>{kh.so_luong_dat}</td><td>{kh.so_luong_khong_dat}</td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5}>Không tìm thấy khóa học nào trong năm {selectedYear}.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

    </div>
  );
};

export default ThongKePage;