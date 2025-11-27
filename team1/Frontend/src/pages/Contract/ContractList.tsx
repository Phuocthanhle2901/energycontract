import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Contract } from "../../types/contract";
import { getContracts } from "../../api/contract.api";

export default function ContractList() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getContracts().then((data) => {
      setContracts(data);
      setLoading(false);
    });
  }, []);

  const filtered = contracts.filter((c) => {
    const key =
      `${c.contractNumber} ${c.firstname} ${c.lastname} ${c.email}`.toLowerCase();
    return key.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Contracts</h1>
          <p className="muted">Danh sách hợp đồng từ mock data.</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate("/contracts/new")}
        >
          + New Contract
        </button>
      </div>

      <div className="search-bar">
        <input
          placeholder="Search by contract, customer, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Reseller</th>
                <th>Period</th>
                <th>Orders</th>
                <th colSpan={2} style={{ textAlign: "center" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.contractNumber}</td>
                  <td>
                    {c.firstname} {c.lastname}
                  </td>
                  <td>{c.email}</td>
                  <td>{c.reseller.name}</td>
                  <td>
                    {c.startDate} → {c.endDate}
                  </td>
                  <td>{c.orders.length}</td>
                  <td>
                    <button
                      className="btn-link"
                      onClick={() => navigate(`/contracts/${c.id}`)}
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn-link"
                      onClick={() => navigate(`/contracts/${c.id}/delete`)}
                      style={{
                        color: "#fca5a5",
                        padding: "0.4rem 0.8rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(239, 68, 68, 0.2)";
                        e.currentTarget.style.borderRadius = "0.625rem";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "none";
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8}>No contracts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
