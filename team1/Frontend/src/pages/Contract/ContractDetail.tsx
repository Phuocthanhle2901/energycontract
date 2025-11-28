import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Contract } from "../../types/contract";
import { getContractById } from "../../api/contract.api";

export default function ContractDetail() {
  const { id } = useParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    getContractById(Number(id)).then((c) => c && setContract(c));
  }, [id]);

  if (!contract) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contract {contract.contractNumber}</h1>
          <p className="muted">
            {contract.firstname} {contract.lastname} – {contract.email}
          </p>
        </div>
        <div className="btn-group">
          <button
            className="btn-outline"
            onClick={() => navigate(`/contracts/${contract.id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate(`/contracts/${contract.id}/history`)}
          >
            History
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate(`/contracts/${contract.id}/pdf`)}
          >
            PDF
          </button>
          <button
            className="btn-outline"
            onClick={() => navigate(`/contracts/${contract.id}/delete`)}
            style={{
              borderColor: "rgba(239, 68, 68, 0.5)",
              color: "#fca5a5",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="card-grid">
        <div className="card">
          <h2>Customer</h2>
          <p>{contract.companyName}</p>
          <p>{contract.phone}</p>
          <p>Bank: {contract.bankAccountNumber}</p>
        </div>
        <div className="card">
          <h2>Contract</h2>
          <p>
            Period: {contract.startDate} → {contract.endDate}
          </p>
          <p>Reseller: {contract.reseller.name}</p>
          <p>
            Address: {contract.address.housenumber} {contract.address.extension}{" "}
            – {contract.address.zipcode}
          </p>
        </div>
      </div>

      <div className="card">
        <h2>Orders</h2>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Status</th>
                <th>Period</th>
                <th>Topup fee</th>
              </tr>
            </thead>
            <tbody>
              {contract.orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>{o.orderType}</td>
                  <td>{o.status}</td>
                  <td>
                    {o.startDate} → {o.endDate}
                  </td>
                  <td>{o.topupFee?.toLocaleString() ?? "-"}</td>
                </tr>
              ))}
              {contract.orders.length === 0 && (
                <tr>
                  <td colSpan={5}>No orders.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
