import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
} from "@mui/material";

import FlashOnIcon from "@mui/icons-material/FlashOn";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export interface Order {
    id: string;
    order_number: string;
    order_type: "electricity" | "gas";
    status: "active" | "pending" | "completed" | "cancelled";
    start_date: string;
    end_date: string;
    topup_fee: number;
}

export const mockOrders: Order[] = [
    {
        id: "1",
        order_number: "ORD-E-001",
        order_type: "electricity",
        status: "active",
        start_date: "2025-12-01",
        end_date: "2025-12-01",
        topup_fee: 120000,

    },
    {
        id: "2",
        order_number: "ORD-G-002",
        order_type: "gas",
        status: "active",
        start_date: "2025-12-01",
        end_date: "2026-12-01",
        topup_fee: 80000,
    },
];

const statusColor: any = {
    active: "success",
    pending: "warning",
    completed: "info",
    cancelled: "error",
};

export default function OrderList({ orders, onEdit, onDelete }: any) {
    return (
        <Paper
            elevation={1}
            sx={{
                borderRadius: "16px",
                overflow: "hidden",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                mb: 4,
            }}
        >
            <TableContainer>
                <Table>

                    {/* HEADER – ĐỔI THÀNH MÀU XÁM (#D1D5DB) */}
                    <TableHead>
                        <TableRow sx={{ bgcolor: "#D1D5DB" }}>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Số Đơn hàng</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Loại</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Trạng thái</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Ngày Bắt đầu</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Ngày Kết thúc</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Chi phí</TableCell>
                            <TableCell sx={{ color: "#000", fontWeight: 700 }}>Thao tác</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {orders.map((o: Order) => (
                            <TableRow key={o.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{o.order_number}</TableCell>

                                <TableCell>
                                    <Chip
                                        icon={o.order_type === "electricity" ? <FlashOnIcon /> : <LocalGasStationIcon />}
                                        label={o.order_type.toUpperCase()}
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            borderColor: "#9CA3AF",
                                            color: "#374151",
                                            "& .MuiChip-icon": { color: "#6B7280" }
                                        }}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        label={o.status.toUpperCase()}
                                        variant="outlined"
                                        sx={{
                                            fontWeight: 600,
                                            borderColor: "#9CA3AF",
                                            color: "#374151",
                                        }}
                                    />
                                </TableCell>

                                <TableCell>{o.start_date}</TableCell>
                                <TableCell>{o.end_date}</TableCell>

                                <TableCell sx={{ fontWeight: 600 }}>
                                    {o.topup_fee.toLocaleString()} VND
                                </TableCell>

                                <TableCell>
                                    <IconButton color="primary" onClick={() => onEdit(o)}>
                                        <EditIcon />
                                    </IconButton>

                                    <IconButton color="error" onClick={() => onDelete(o.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </TableContainer>
        </Paper>
    );
}
