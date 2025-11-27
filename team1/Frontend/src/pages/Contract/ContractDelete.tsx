import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Contract } from "../../types/contract";
import { getContractById, deleteContractMock } from "../../api/contract.api";

export default function ContractDelete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Contract ID not found");
      setLoading(false);
      return;
    }

    getContractById(Number(id))
      .then((c) => {
        if (!c) {
          setError("Contract not found");
        } else {
          setContract(c);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load contract");
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    if (!contract) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteContractMock();
      alert("Contract deleted successfully");
      navigate("/contracts");
    } catch (err) {
      setError("Failed to delete contract. Please try again.");
      setDeleting(false);
    }
  }

  function handleCancel() {
    navigate(`/contracts/${id}`);
  }

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Delete Contract</h1>
        </div>
        <div className="card">
          <p>Loading contract information...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div>
        <div className="page-header">
          <h1>Delete Contract</h1>
        </div>
        <div className="card">
          <div
            style={{
              padding: "2rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "0.875rem",
              color: "#fca5a5",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 600 }}>
              ❌ {error || "Contract not found"}
            </p>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <button className="btn-outline" onClick={() => navigate("/contracts")}>
              Back to Contracts
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Delete Contract</h1>
          <p className="muted">
            Contract #{contract.contractNumber} – {contract.firstname}{" "}
            {contract.lastname}
          </p>
        </div>
      </div>

      <div className="card">
        <div
          style={{
            padding: "2rem",
            backgroundColor: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "0.875rem",
            marginBottom: "2rem",
          }}
        >
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</div>
          <h3 style={{ margin: "0 0 1rem 0", color: "#fca5a5", fontSize: "1.2rem" }}>
            Warning: This action cannot be undone
          </h3>
          <p style={{ margin: 0, color: "var(--muted)", lineHeight: "1.6" }}>
            You are about to permanently delete this contract and all associated
            orders. This action is irreversible. Please confirm if you want to
            proceed.
          </p>
        </div>

        <div
          style={{
            backgroundColor: "rgba(50, 50, 50, 0.8)",
            border: "1px solid rgba(100, 100, 100, 0.4)",
            borderRadius: "0.875rem",
            padding: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <h4 style={{ margin: "0 0 1rem 0", color: "var(--text)" }}>
            Contract Details:
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Contract Number
              </p>
              <p style={{ margin: 0, fontWeight: 600 }}>{contract.contractNumber}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Customer
              </p>
              <p style={{ margin: 0, fontWeight: 600 }}>
                {contract.firstname} {contract.lastname}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Email
              </p>
              <p style={{ margin: 0 }}>{contract.email}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Company
              </p>
              <p style={{ margin: 0 }}>{contract.companyName || "N/A"}</p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Period
              </p>
              <p style={{ margin: 0 }}>
                {contract.startDate} → {contract.endDate}
              </p>
            </div>
            <div>
              <p style={{ margin: "0 0 0.5rem 0", color: "var(--muted)", fontSize: "0.85rem" }}>
                Total Orders
              </p>
              <p style={{ margin: 0, fontWeight: 600 }}>{contract.orders.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "1rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "0.875rem",
              color: "#fca5a5",
              marginBottom: "2rem",
            }}
          >
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            className="btn-outline"
            onClick={handleCancel}
            disabled={deleting}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: deleting
                ? "rgba(239, 68, 68, 0.5)"
                : "linear-gradient(135deg, #ef4444, #dc2626)",
              boxShadow: deleting
                ? "none"
                : "0 6px 20px rgba(239, 68, 68, 0.4)",
              marginLeft: "1rem",
            }}
          >
            {deleting ? "Deleting..." : "Delete Contract"}
          </button>
        </div>
      </div>
    </div>
  );
}