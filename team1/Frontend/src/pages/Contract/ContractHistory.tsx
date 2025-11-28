import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ContractHistory } from "../../types/contract";
import { getContractHistory } from "../../api/contract.api";

export default function ContractHistoryPage() {
  const { id } = useParams();
  const [items, setItems] = useState<ContractHistory[]>([]);

  useEffect(() => {
    if (!id) return;
    getContractHistory(Number(id)).then(setItems);
  }, [id]);

  return (
    <div>
      <div className="page-header">
        <h1>Contract history</h1>
      </div>
      <div className="timeline">
        {items.map((h) => (
          <div key={h.id} className="timeline-item">
            <div className="timeline-dot" />
            <div className="timeline-content">
              <div className="timeline-time">
                {new Date(h.changedAt).toLocaleString()}
              </div>
              <div>{h.summary}</div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="muted">No history.</p>}
      </div>
    </div>
  );
}
