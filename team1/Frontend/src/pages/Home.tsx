import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Contract } from "../types/contract";
import { getContracts } from "../api/contract.api";
import NavMenu from "../components/NavMenu/NavMenu";

export default function Home() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getContracts().then((data) => {
      setContracts(data);
      setLoading(false);
    });
  }, []);

  const activeContracts = contracts.filter(
    (c) => new Date(c.endDate) > new Date()
  ).length;
  const expiredContracts = contracts.length - activeContracts;
  const totalOrders = contracts.reduce((sum, c) => sum + c.orders.length, 0);

  return (
    <div style={{ display: "flex" }}>
      {/* SIDEBAR */}
      <NavMenu />

      {/* MAIN CONTENT */}
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
          <p>
            Manage all your energy contracts and orders in one centralized
            platform
          </p>
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

        {/* Statistics Dashboard */}
        <div>
          <h2
            style={{
              marginBottom: "2rem",
              color: "var(--text)",
              fontSize: "1.6rem",
              fontWeight: 700,
            }}
          >
            📊 Dashboard Overview
          </h2>

          <div className="card-grid">
            <div className="card stat-card">
              <p className="stat-label">📋 Total Contracts</p>
              <div className="stat-number">{contracts.length}</div>
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                  marginTop: "1rem",
                }}
              >
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

            <div className="card stat-card">
              <p className="stat-label">🔌 Total Orders</p>
              <div className="stat-number">{totalOrders}</div>
              <p
                className="muted"
                style={{ fontSize: "0.85rem", marginTop: "1rem" }}
              >
                Gas & Electricity combined
              </p>
            </div>

            <div className="card stat-card">
              <p className="stat-label">⏰ Requires Renewal</p>
              <div className="stat-number">{expiredContracts}</div>
              <p
                className="muted"
                style={{ fontSize: "0.85rem", marginTop: "1rem" }}
              >
                {expiredContracts === 0
                  ? "✅ All contracts active"
                  : "⚠️ Action needed"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Contracts Section */}
        <div className="card" style={{ marginTop: "3rem" }}>
          <div className="recent-contracts-header">
            <h2>📄 Recent Contracts</h2>
            <button
              className="btn-primary"
              onClick={() => navigate("/contracts")}
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
              <p className="muted">Loading contracts...</p>
            </div>
          ) : contracts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
              <p
                className="muted"
                style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}
              >
                No contracts yet. Create your first contract!
              </p>
              <button
                className="btn-primary"
                onClick={() => navigate("/contracts/new")}
              >
                Create First Contract
              </button>
            </div>
          ) : (
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
                    const isActive = new Date(c.endDate) > new Date();
                    return (
                      <tr key={c.id}>
                        <td
                          style={{
                            fontWeight: 700,
                            color: "var(--primary)",
                          }}
                        >
                          {c.contractNumber}
                        </td>
                        <td style={{ fontWeight: 500 }}>
                          {c.firstname} {c.lastname}
                        </td>
                        <td className="muted">{c.email}</td>
                        <td>{c.reseller.name}</td>
                        <td
                          className="muted"
                          style={{ fontSize: "0.85rem" }}
                        >
                          {new Date(c.startDate).toLocaleDateString("vi-VN")} –{" "}
                          {new Date(c.endDate).toLocaleDateString("vi-VN")}
                        </td>
                        <td>
                          <span
                            style={{
                              background: "rgba(14, 165, 233, 0.18)",
                              color: "#6ee7b7",
                              padding: "0.4rem 0.9rem",
                              borderRadius: "0.625rem",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                            }}
                          >
                            {c.orders.length} order
                            {c.orders.length !== 1 ? "s" : ""}
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
                            onClick={() => navigate(`/contracts/${c.id}`)}
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

        {/* Quick Actions */}
        <div>
          <h2
            style={{
              marginTop: "3rem",
              marginBottom: "2rem",
              color: "var(--text)",
              fontSize: "1.6rem",
              fontWeight: 700,
            }}
          >
            🚀 Quick Actions
          </h2>
          <div className="card-grid">
            <div
              className="card action-card"
              onClick={() => navigate("/contracts/create")}
            >
              <div className="action-card-icon">📝</div>
              <h3>Create Contract</h3>
              <p>Add a new energy contract to the system</p>
            </div>
            <div
              className="card action-card"
              onClick={() => navigate("/contracts/list")}
            >
              <div className="action-card-icon">📋</div>
              <h3>Manage Contracts</h3>
              <p>View, edit, and organize all contracts</p>
            </div>
            <div className="card action-card" style={{ cursor: "default" }}>
              <div className="action-card-icon">📊</div>
              <h3>Analytics & Reports</h3>
              <p>View system statistics and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}