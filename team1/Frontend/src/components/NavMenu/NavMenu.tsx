import React from "react";
import { Box, Container, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

    const menuItems = [
      { label: "Home", path: "/home" },                     // Dashboard tổng quan
      { label: "Contracts List", path: "/contracts/list" },      // Danh sách hợp đồng
      { label: "Create Contract", path: "/contracts/create" }, // Tạo hợp đồng mới
      { label: "Orders", path: "/orders" },            // Quản lý orders (gas/electric)
      { label: "Resellers", path: "/resellers" },      // Quản lý đại lý
      { label: "History", path: "/history" },        // Quản lý lịch sử
      { label: "Reports / PDF", path: "/reports" }     // Xem, tạo PDF hợp đồng
    ];

  return (
    <Box
      sx={{
        backdropFilter: "blur(12px)",
        bgcolor: "rgba(50,50,70,0.85)", // background trong suốt pha blur
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Logo màu vàng trứng */}
        <Typography
          variant="h6"
          sx={{
            fontSize:40,
            fontWeight: 700,
            cursor: "pointer",
            color: "#ffffffff", // màu vàng trứng
            transition: "0.3s",
            "&:hover": { color: "#ffea70" }
          }}
          onClick={() => navigate("/")}
        >
          INFODATION <Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.8 }}>Management</Typography>
        </Typography>

        {/* Menu Items ngang */}
        <Stack direction="row" spacing={4} sx={{ display: { xs: "none", md: "flex" } }}>
          {menuItems.map((item) => (
            <Typography
              key={item.label}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s",
                color: "white",
                fontWeight: 500,
                "&:hover": { color: "#FFD700", transform: "translateY(-2px)" } // hover hiệu ứng nhẹ
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Header;
