import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavMenu from "@/components/NavMenu/NavMenu";
import { getContracts } from "@/services/customerService/ContractService";
import type { Contract } from "@/types/contract";
import {
  Box,
  Typography,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load contracts from API
  useEffect(() => {
    getContracts()
      .then((data) => setContracts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const list = Array.isArray(contracts) ? contracts : [];

  const active = list.filter(
    (c) => c?.endDate && new Date(c.endDate) > new Date()
  ).length;

  const expired = list.length - active;

  const totalOrders = list.reduce(
    (sum, c) => sum + (Array.isArray(c.orders) ? c.orders.length : 0),
    0
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* ---- FIXED: NavMenu must be OUTSIDE layout ---- */}
      <NavMenu />

      <Box
        sx={{
          ml: "240px",
          p: 3,
          width: "100%",
          background: "#F3F4F6",
          minHeight: "100vh",
        }}
      >
        {/* ================= HERO ================= */}
        <Box
          sx={{
            width: "100%",
            height: "360px",
            borderRadius: "24px",
            overflow: "hidden",
            position: "relative",
            mb: 5,
          }}
        >
          <img
            src="https://images.pexels.com/photos/414807/pexels-photo-414807.jpeg"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(65%)",
            }}
          />

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              color: "white",
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 700 }}>
              ⚡ Energy Contract Manager
            </Typography>

            <Typography sx={{ mb: 3, fontSize: "1.15rem", opacity: 0.9 }}>
              Manage all your energy contracts and orders in one platform
            </Typography>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  px: 4,
                  py: 1.4,
                  borderRadius: "12px",
                  background: "#1E88E5",
                  fontWeight: 600,
                }}
                onClick={() => navigate("/contracts/create")}
              >
                Create New Contract
              </Button>

              <Button
                variant="outlined"
                sx={{
                  px: 4,
                  py: 1.4,
                  borderRadius: "12px",
                  color: "white",
                  borderColor: "white",
                  fontWeight: 600,
                }}
                onClick={() => navigate("/contracts/list")}
              >
                View All Contracts
              </Button>
            </Box>
          </Box>
        </Box>

        {/* ================= OVERVIEW CARDS ================= */}
        <Typography sx={{ fontSize: "1.35rem", fontWeight: 700, mb: 2 }}>
          📊 Dashboard Overview
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 3,
            mb: 5,
          }}
        >
          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography sx={{ fontWeight: 600 }}>📄 Total Contracts</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>
              {list.length}
            </Typography>

            <Button
              size="small"
              sx={{
                mt: 1,
                borderRadius: "20px",
                background: "#E3F2FD",
                color: "#1E88E5",
                px: 2,
                textTransform: "none",
              }}
            >
              {active} Active
            </Button>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography sx={{ fontWeight: 600 }}>🔌 Total Orders</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>
              {totalOrders}
            </Typography>
            <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>
              Gas & Electricity combined
            </Typography>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: "16px" }}>
            <Typography sx={{ fontWeight: 600 }}>⏰ Requires Renewal</Typography>
            <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>
              {expired}
            </Typography>
            <Typography sx={{ color: "gray", fontSize: "0.85rem" }}>
              {expired === 0 ? "All active" : "⚠️ Some expired"}
            </Typography>
          </Paper>
        </Box>

        {/* ================= RECENT CONTRACTS ================= */}
        <Paper sx={{ p: 3, borderRadius: "16px", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography sx={{ fontSize: "1.3rem", fontWeight: 700 }}>
              📄 Recent Contracts
            </Typography>

            <Button
              variant="contained"
              sx={{ background: "#1E88E5", borderRadius: "10px" }}
              onClick={() => navigate("/contracts/list")}
            >
              View All →
            </Button>
          </Box>

          {loading ? (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : list.length === 0 ? (
            <Typography>No contracts found.</Typography>
          ) : (
            <Box sx={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Contract</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Reseller</th>
                    <th>Duration</th>
                    <th>Orders</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {list.slice(0, 5).map((c) => {
                    const orders = Array.isArray(c.orders)
                      ? c.orders.length
                      : 0;

                    const isActive =
                      c?.endDate && new Date(c.endDate) > new Date();

                    return (
                      <tr key={c.id}>
                        <td>{c.contractNumber}</td>
                        <td>
                          {c.firstname} {c.lastname}
                        </td>
                        <td>{c.email}</td>
                        <td>{c.reseller?.name || "N/A"}</td>
                        <td>
                          {new Date(c.startDate).toLocaleDateString("vi-VN")} –{" "}
                          {new Date(c.endDate).toLocaleDateString("vi-VN")}
                        </td>

                        <td>{orders} orders</td>

                        <td>
                          <Button
                            size="small"
                            sx={{
                              borderRadius: "20px",
                              px: 2,
                              textTransform: "none",
                              background: isActive
                                ? "#E3F2FD"
                                : "rgba(255,0,0,0.08)",
                              color: isActive ? "#1E88E5" : "red",
                            }}
                          >
                            {isActive ? "ACTIVE" : "EXPIRED"}
                          </Button>
                        </td>

                        <td>
                          <Button
                            variant="text"
                            onClick={() => navigate(`/contracts/${c.id}`)}
                          >
                            Details →
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </Box>
          )}
        </Paper>

        {/* ================= QUICK ACTIONS ================= */}
        <Typography sx={{ fontSize: "1.3rem", fontWeight: 700, mb: 2 }}>
          🚀 Quick Actions
        </Typography>

        <Box sx={{ display: "grid", gap: 3 }}>
          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: "16px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/contracts/create")}
          >
            <Typography sx={{ fontSize: "3rem" }}>📝</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Create Contract
            </Typography>
            <Typography sx={{ color: "gray" }}>
              Add a new energy contract to the system
            </Typography>
          </Paper>

          <Paper
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: "16px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/contracts/list")}
          >
            <Typography sx={{ fontSize: "3rem" }}>📋</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Manage Contracts
            </Typography>
            <Typography sx={{ color: "gray" }}>
              View, edit, and organize all contracts
            </Typography>
          </Paper>

          <Paper sx={{ p: 5, textAlign: "center", borderRadius: "16px" }}>
            <Typography sx={{ fontSize: "3rem" }}>📊</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Analytics & Reports
            </Typography>
            <Typography sx={{ color: "gray" }}>
              View system statistics and insights
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
