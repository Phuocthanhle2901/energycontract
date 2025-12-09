import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contract } from "../types/contract";
import { ContractApi } from "../api/contract.api";
import NavMenu from "../components/NavMenu/NavMenu";
import { Box, Button } from "@mui/material";

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load contracts from API
  useEffect(() => {
    ContractApi.getContracts()
      .then((data) => {
        setContracts(Array.isArray(data) ? data : []); // FIX
      })
      .finally(() => setLoading(false));
  }, []);

  // ----------------------------
  // SAFE CALCULATIONS (NO CRASH)
  // ----------------------------

  // Thời hạn hợp đồng (nếu endDate null → coi như expired)
  const activeContracts = contracts.filter((c) => {
    if (!c.endDate) return false;
    return new Date(c.endDate) > new Date();
  }).length;

  const expiredContracts = contracts.length - activeContracts;

  // FIX: orders có thể undefined hoặc null → fallback []
  const totalOrders = contracts.reduce((sum, c) => {
    const orderList = Array.isArray(c.orders) ? c.orders : [];
    return sum + orderList.length;
  }, 0);

  return (
    <div style={{ display: "flex" }}>
      <NavMenu />

      <div
        style={{
          marginLeft: "240px",
          padding: "2rem",
          width: "100%",
          background: "#F3F4F6",
          minHeight: "100vh",
        }}
      >
        {/* Hero Section */}
        <div className="hero-section">
          <h1>⚡ Energy Contract Manager</h1>
          <p>Manage all your energy contracts and orders in one centralized platform</p>

          <div className="hero-buttons">
            <button className="btn-primary" onClick={() => navigate("/contracts/create")}>
              Create New Contract
            </button>

            <button className="btn-outline" onClick={() => navigate("/contracts/list")}>
              View All Contracts
            </button>
          </div>
        </div>

        {/* Dashboard Overview */}
        <h2 style={{ marginBottom: "2rem", fontSize: "1.6rem", fontWeight: 700 }}>
          📊 Dashboard Overview
        </h2>

        <div className="card-grid">
          {/* Total Contracts */}
          <div className="card stat-card">
            <p className="stat-label">📋 Total Contracts</p>
            <div className="stat-number">{contracts.length}</div>

            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
              <span className="status-badge status-active">{activeContracts} Active</span>

              {expiredContracts > 0 && (
                <span className="status-badge status-expired">
                  {expiredContracts} Expired
                </span>
              )}
            </div>
          </div>

          {/* Total Orders */}
          <div className="card stat-card">
            <p className="stat-label">🔌 Total Orders</p>
            <div className="stat-number">{totalOrders}</div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
              Gas & Electricity combined
            </p>
          </div>

          {/* Expired */}
          <div className="card stat-card">
            <p className="stat-label">⏰ Requires Renewal</p>
            <div className="stat-number">{expiredContracts}</div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
              {expiredContracts === 0 ? "✅ All contracts active" : "⚠️ Action needed"}
            </p>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="card" style={{ marginTop: "3rem" }}>
          <div className="recent-contracts-header">
            <h2>📄 Recent Contracts</h2>
            <button className="btn-primary" onClick={() => navigate("/contracts")}>
              View All →
            </Button>
          </Box>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p className="muted">Loading contracts...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                No contracts yet. Create your first contract!
              </p>
              <button className="btn-primary" onClick={() => navigate("/contracts/new")}>
                Create First Contract
              </button>
            </div>
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
                  {contracts.slice(0, 5).map((c) => {
                    const isActive = c.endDate && new Date(c.endDate) > new Date();
                    const orders = Array.isArray(c.orders) ? c.orders.length : 0;

                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          {c.contractNumber}
                        </td>

                        <td style={{ fontWeight: 500 }}>
                          {c.firstName} {c.lastName}
                        </td>

                        <td className="muted">{c.email}</td>

                        <td>{c.resellerName}</td>

                        <td className="muted" style={{ fontSize: "0.85rem" }}>
                          {new Date(c.startDate).toLocaleDateString("vi-VN")} –{" "}
                          {new Date(c.endDate).toLocaleDateString("vi-VN")}
                        </td>

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
                            {orders} order{orders !== 1 ? "s" : ""}
                          </span>
                        </td>

                        <td>
                          <span
                            className={
                              isActive
                                ? "status-badge status-active"
                                : "status-badge status-expired"
                            }
                          >
                            {isActive ? "Active" : "Expired"}
                          </span>
                        </td>

                        <td>
                          <button className="btn-link" onClick={() => navigate(`/contracts/${c.id}/detail`)}>
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
        </div>
      </div>
    </div>
  );
}
