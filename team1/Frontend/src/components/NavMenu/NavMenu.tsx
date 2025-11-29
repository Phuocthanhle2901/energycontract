import React from "react";
import { Box, Container, Stack, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Contracts List", path: "/contracts/list" },
    { label: "Create Contract", path: "/contracts/create" },
    { label: "Orders", path: "/orders" },
    { label: "Resellers", path: "/resellers/create" },
    { label: "History", path: "/history" },
    { label: "Reports", path: "/reports" },
  ];

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/");
  };

  return (
    <Box
      sx={{
        backdropFilter: "blur(12px)",
        bgcolor: "rgba(50,50,70,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Typography
          variant="h6"
          sx={{
            fontSize: 40,
            fontWeight: 700,
            cursor: "pointer",
            color: "#ffffffff",
            transition: "0.3s",
            "&:hover": { color: "#ffea70" },
          }}
          onClick={() => navigate("/")}
        >
          INFODATION{" "}
          <Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.8 }}>
            Management
          </Typography>
        </Typography>

        {/* Menu Items */}
        <Stack
          direction="row"
          spacing={4}
          sx={{
            display: { xs: "none", md: "flex" },
            flexGrow: 1,
            ml: 4,
            flexWrap: "nowrap",
            overflowX: "auto",
          }}
        >
          {menuItems.map((item) => (
            <Typography
              key={item.label}
              sx={{
                cursor: "pointer",
                transition: "all 0.3s",
                color: "white",
                fontWeight: 500,
                whiteSpace: "nowrap",
                "&:hover": { color: "#FFD700", transform: "translateY(-2px)" },
              }}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </Typography>
          ))}
        </Stack>

        {/* Nút Log Out nhỏ */}
        <Button
          size="small"
          variant="contained"
          sx={{
            bgcolor: "#ff4d4d",
            "&:hover": { bgcolor: "#ff1a1a" },
            ml: 2,
            textTransform: "none", // giữ chữ thường
            fontSize: 12,
            padding: "4px 8px",
          }}
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </Container>
    </Box>
  );
};

export default Header;
