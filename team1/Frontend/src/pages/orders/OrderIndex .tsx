import React, { useState } from "react";
import { Container, Typography, Box, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import NavMenu from "@/components/NavMenu/NavMenu";

import OrderList, { mockOrders } from "./OrderList";
import type { Order } from "./OrderList";
import OrderForm from "./OrderForm";

export default function OrderIndex() {
    const [view, setView] = useState<"list" | "form">("list");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [formData, setFormData] = useState<Partial<Order>>({});

    const handleEdit = (order: Order) => {
        setSelectedOrder(order);
        setFormData(order);
        setView("form");
    };

    const handleCreate = () => {
        setSelectedOrder(null);
        setFormData({
            order_type: "electricity",
            status: "pending",
            topup_fee: 0,
            start_date: "",
            end_date: "",
        });
        setView("form");
    };

    const handleFormChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "topup_fee" ? parseFloat(value) : value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        setView("list");
    };

    return (
        <>
            <NavMenu />

            <Box sx={{ background: "#f5f7fa", minHeight: "100vh", py: 4 }}>
                <Container maxWidth="lg">

                    {/* PAGE TITLE */}
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                        <span style={{ color: "#1976D2" }}>Order</span> Management
                    </Typography>

                    <Typography sx={{ color: "#6b7280", mb: 3 }}>
                        Manage all energy orders for this contract.
                    </Typography>

                    {/* CONTRACT INFO */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: "12px",
                            p: 2.5,
                            mb: 3,
                            borderLeft: "4px solid #1976D2",
                            bgcolor: "#ffffff",
                            boxShadow: "0px 2px 6px rgba(0,0,0,0.06)"
                        }}
                    >
                        <Typography fontSize={15}>
                            Đơn hàng cho Hợp đồng:{" "}
                            <b style={{ color: "#1976D2" }}>CT-2025-A101</b> – Khách hàng:{" "}
                            <b>Nguyễn Văn A</b>
                        </Typography>
                    </Paper>

                    {view === "list" && (
                        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleCreate}
                                sx={{
                                    backgroundColor: "#1976D2",
                                    borderRadius: "10px",
                                    px: 3,
                                    py: 1.2,
                                    fontWeight: 700,
                                    textTransform: "none",
                                    boxShadow: "0px 3px 5px rgba(0,0,0,0.15)"
                                }}
                            >
                                Thêm đơn hàng mới
                            </Button>
                        </Box>
                    )}

                    {/* SHOW LIST OR FORM */}
                    {view === "list" ? (
                        <OrderList
                            orders={mockOrders}
                            onEdit={handleEdit}
                            onDelete={() => { }}
                        />
                    ) : (
                        <OrderForm
                            selectedOrder={selectedOrder}
                            formData={formData}
                            onChange={handleFormChange}
                            onSubmit={handleSubmit}
                            onBack={() => setView("list")}
                        />
                    )}
                </Container>
            </Box>
        </>
    );
}
