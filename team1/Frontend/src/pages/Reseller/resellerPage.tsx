import { useEffect, useState, useCallback } from 'react';
import type { Reseller } from "@/types/reseller.ts";
import resellerService from "@/services/customerService/ResellerService.ts";
import { CreateResellerDialog } from "@/components/createResellerDialog.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Giữ nguyên styles cũ của bạn, nhưng bỏ container padding vì ta sẽ dùng class của Tailwind cho layout chính
const styles = {
    // container: { padding: '20px' }, // Đã chuyển sang class p-4 của wrapper
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px' },
    th: { border: '1px solid #ddd', padding: '12px', backgroundColor: '#f2f2f2', textAlign: 'left' as const },
    td: { border: '1px solid #ddd', padding: '12px' },
    error: { color: 'red', fontWeight: 'bold' }
};

function ResellerPage() {
    const [resellers, setResellers] = useState<Reseller[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await resellerService.getAll();

            console.log("Data nhận được:", data);

            if (Array.isArray(data)) {
                setResellers(data);
            } else {
                console.warn("API không trả về mảng, set về rỗng.");
                setResellers([]);
            }

            setError(null);
        } catch (err: any) {
            console.error("Lỗi:", err);
            setError('Lỗi tải dữ liệu');
            setResellers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Render nội dung chính của trang Reseller
    const renderContent = () => {
        if (loading && resellers.length === 0) {
            return <div>⏳ Đang tải dữ liệu...</div>;
        }

        if (error) {
            return <div style={styles.error}>⚠️ Lỗi: {error}</div>;
        }

        return (
            <>
                <div style={styles.header}>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Danh sách Đại lý</h1>
                        <p className="text-muted-foreground">Tổng số: {resellers.length} đại lý</p>
                    </div>
                    <CreateResellerDialog onSuccess={fetchData} />
                </div>

                {resellers.length === 0 ? (
                    <p>Không có dữ liệu nào.</p>
                ) : (
                    <div className="rounded-md border">
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
                    </div>
                )}
            </>
        );
    };

    return (
        <SidebarProvider>
            {/* Sidebar bên trái */}
            <AppSidebar />

            {/* Khu vực nội dung bên phải */}
            <SidebarInset>
                {/* Header nhỏ chứa nút toggle sidebar và breadcrumb */}
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator orientation="vertical" className="mr-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">Quản lý</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Đại lý (Resellers)</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </header>

                {/* Nội dung chính của trang */}
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {renderContent()}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}

export default ResellerPage;