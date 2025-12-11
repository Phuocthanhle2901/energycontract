import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contract } from "../types/contract";
import { ContractApi } from "../api/contract.api";
import NavMenu from "../components/NavMenu/NavMenu";

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ===================== FETCH CONTRACT DATA =====================
  useEffect(() => {
    setLoading(true);

    ContractApi.getAll()
      .then((data) => {
        setContracts(Array.isArray(data.items) ? data.items : []);
      })
      .catch(() => {
        setContracts([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // ===================== CALCULATIONS =====================

  const activeContracts = contracts.filter((c) => {
    if (!c?.endDate) return false;
    return new Date(c.endDate) > new Date();
  }).length;

  const expiredContracts = contracts.length - activeContracts;

  const totalOrders = contracts.reduce((sum, c) => {
    const orderList = Array.isArray(c?.orders) ? c.orders : [];
    return sum + orderList.length;
  }, 0);

  // ===================== UI ======================

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
        {/* ================= HERO ================= */}
        <div className="hero-section">
          <h1>⚡ Energy Contract Manager</h1>
          <p>Manage all your energy contracts and orders in one centralized platform</p>

          <div className="hero-buttons">
            <button
              className="btn-primary"
              onClick={() => navigate("/contracts/create")}
            >
              Create New Contract
            </button>

            <button
              className="btn-outline"
              onClick={() => navigate("/contracts/list")}
            >
              View All Contracts
            </button>
          </div>
        </div>

        {/* ================= DASHBOARD ================= */}
        <h2 style={{ marginBottom: "2rem", fontSize: "1.6rem", fontWeight: 700 }}>
          📊 Dashboard Overview
        </h2>

        <div className="card-grid">
          {/* TOTAL CONTRACTS */}
          <div className="card stat-card">
            <p className="stat-label">📋 Total Contracts</p>
            <div className="stat-number">{contracts.length}</div>

            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
              <span className="status-badge status-active">
                {activeContracts} Active
              </span>

              {expiredContracts > 0 && (
                <span className="status-badge status-expired">
                  {expiredContracts} Expired
                </span>
              )}
            </div>
          </div>

          {/* TOTAL ORDERS */}
          <div className="card stat-card">
            <p className="stat-label">🔌 Total Orders</p>
            <div className="stat-number">{totalOrders}</div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
              Gas & Electricity combined
            </p>
          </div>

          {/* EXPIRED CONTRACTS */}
          <div className="card stat-card">
            <p className="stat-label">⏰ Requires Renewal</p>
            <div className="stat-number">{expiredContracts}</div>
            <p className="muted" style={{ fontSize: "0.85rem", marginTop: "1rem" }}>
              {expiredContracts === 0 ? "✅ All contracts active" : "⚠️ Action needed"}
            </p>
          </div>
        </div>

        {/* ================= RECENT CONTRACTS ================= */}
        <div className="card" style={{ marginTop: "3rem" }}>
          <div className="recent-contracts-header">
            <h2>📄 Recent Contracts</h2>
            <button className="btn-primary" onClick={() => navigate("/contracts/list")}>
              View All →
            </button>
          </div>

          {/* LOADING STATE */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p className="muted">Loading contracts...</p>
            </div>
          ) : contracts.length === 0 ? (
            /* EMPTY STATE */
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <p className="muted" style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                No contracts yet. Create your first contract!
              </p>
              <button className="btn-primary" onClick={() => navigate("/contracts/create")}>
                Create First Contract
              </button>
            </div>
          ) : (
            /* TABLE DATA */
            <div className="table-wrapper">
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
                    const isActive =
                      c.endDate && new Date(c.endDate) > new Date();

                    const orderCount = Array.isArray(c.orders)
                      ? c.orders.length
                      : 0;

                    return (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 700, color: "var(--primary)" }}>
                          {c.contractNumber}
                        </td>

                        <td>
                          {c.firstName} {c.lastName}
                        </td>

                        <td className="muted">{c.email}</td>

                        <td>{c.resellerName ?? "—"}</td>

                        <td className="muted" style={{ fontSize: "0.85rem" }}>
                          {new Date(c.startDate).toLocaleDateString("vi-VN")} –{" "}
                          {c.endDate
                            ? new Date(c.endDate).toLocaleDateString("vi-VN")
                            : "N/A"}
                        </td>

                        <td>
                          <span
                            style={{
                              background: "#E0F2FE",
                              color: "#0284C7",
                              padding: "0.4rem 0.9rem",
                              borderRadius: "0.625rem",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            {orderCount} order{orderCount !== 1 ? "s" : ""}
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
                          <button
                            className="btn-link"
                            onClick={() => navigate(`/contracts/${c.id}/detail`)}
                          >
                            Details →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
