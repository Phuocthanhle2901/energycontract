import { useEffect, useState, useCallback } from 'react';
import type { Reseller } from "@/types/reseller.ts";
import resellerService from "@/services/customerService/ResellerService.ts";
import {CreateResellerDialog} from "@/components/createResellerDialog.tsx";
 // Import Dialog vừa tạo

// Giữ nguyên styles cũ của bạn
const styles = {
    container: { padding: '20px' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }, // Style mới cho header
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' as const },
    td: { border: '1px solid #ddd', padding: '12px' },
    error: { color: 'red', fontWeight: 'bold' }
};

function ResellerPage() {
    const [resellers, setResellers] = useState<Reseller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Tách hàm fetch data ra ngoài để có thể tái sử dụng (gọi lại khi thêm mới thành công)
    const fetchData = useCallback(async () => {
  try {
    setLoading(true);
    const data = await resellerService.getAll();
    
    console.log("Data từ API:", data); // ← Thêm dòng này
    useEffect(() => {
    resellerService.getAll().then(result => {
        console.log("Kết quả thực tế từ resellerService.getAll():", result);
    });
}, []);
    console.log("Type of data:", typeof data); // ← Kiểm tra kiểu
    console.log("Is Array?", Array.isArray(data)); // ← Kiểm tra có phải array không
    
    setResellers(data);
    setError(null);
  } catch (err: any) {
    console.error("Lỗi ở component:", err);
    setError('Không thể tải danh sách Đại lý. Vui lòng kiểm tra Backend.');
  } finally {
    setLoading(false);
  }
}, []); 

    // Gọi lần đầu tiên
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading && resellers.length === 0) {
        return <div style={styles.container}>⏳ Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div style={{ ...styles.container, ...styles.error }}>⚠️ Lỗi: {error}</div>;
    }

    return (
        <div style={styles.container}>
            {/* Header chứa Tiêu đề và Nút Thêm */}
            <div style={styles.header}>
                <div>
                    <h1>Danh sách Đại lý (Resellers)</h1>
                    <p>Tổng số: {resellers.length} đại lý</p>
                </div>

                {/* Nhúng Component Dialog vào đây.
                    Truyền hàm fetchData vào props onSuccess.
                    Khi Modal thêm xong, nó gọi onSuccess -> fetchData chạy lại -> Bảng cập nhật
                */}
                <CreateResellerDialog onSuccess={fetchData} />
            </div>

            {resellers.length === 0 ? (
                <p>Không có dữ liệu nào.</p>
            ) : (
                <table style={styles.table}>
                    <thead>
                    <tr>
                        <th style={styles.th}>ID</th>
                        <th style={styles.th}>Tên Đại Lý</th>
                        <th style={styles.th}>Loại hình</th>
                    </tr>
                    </thead>
                    <tbody>
                    {resellers.map((reseller) => (
                        <tr key={reseller.id}>
                            <td style={styles.td}>{reseller.id}</td>
                            <td style={styles.td}><strong>{reseller.name}</strong></td>
                            <td style={styles.td}>{reseller.type}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ResellerPage;