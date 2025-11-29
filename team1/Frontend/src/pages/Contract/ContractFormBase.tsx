import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Contract } from "../../types/contract";
import {
  createContractMock,
  getContractById,
  updateContractMock,
} from "../../api/contract.api";

type Mode = "create" | "edit";

interface Props {
  mode: Mode;
}

export default function ContractFormBase({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(mode === "edit");
  const [form, setForm] = useState<Partial<Contract>>({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    companyName: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (mode === "edit" && id) {
      getContractById(Number(id)).then((c) => {
        if (c) {
          setForm({
            ...c,
          });
        }
        setLoading(false);
      });
    }
  }, [id, mode]);

  function handleChange<K extends keyof Contract>(key: K, value: any) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "create") {
      await createContractMock();
      alert("Mock: created contract");
    } else {
      await updateContractMock();
      alert("Mock: updated contract");
    }
    navigate("/contracts");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>{mode === "create" ? "Create Contract" : "Edit Contract"}</h1>
      </div>
      <form className="card form-grid" onSubmit={handleSubmit}>
        <div className="two-col">
          <div>
            <label>First name</label>
            <input
              value={form.firstname ?? ""}
              onChange={(e) => handleChange("firstname", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Last name</label>
            <input
              value={form.lastname ?? ""}
              onChange={(e) => handleChange("lastname", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email ?? ""}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              value={form.phone ?? ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Company</label>
            <input
              value={form.companyName ?? ""}
              onChange={(e) => handleChange("companyName", e.target.value)}
            />
          </div>
          <div>
            <label>Bank account</label>
            <input
              value={form.bankAccountNumber ?? ""}
              onChange={(e) =>
                handleChange("bankAccountNumber", e.target.value)
              }
            />
          </div>
          <div>
            <label>Start date</label>
            <input
              type="date"
              value={form.startDate?.slice(0, 10) ?? ""}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div>
            <label>End date</label>
            <input
              type="date"
              value={form.endDate?.slice(0, 10) ?? ""}
              onChange={(e) => handleChange("endDate", e.target.value)}
            />
          </div>
        </div>
        <div className="form-actions">
          <button className="btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
